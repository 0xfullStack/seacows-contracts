import { MaxUint256, Zero } from '@ethersproject/constants';
import { deployContract } from 'ethereum-waffle';
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getSwapTokenInMax, getSwapTokenOutMin, getDepositTokenInMax, BI_ZERO } from '@yolominds/seacows-sdk';
import { type SeacowsRouter } from '@yolominds/seacows-sdk/types/periphery';
import SeacowsRouterArtifact from '@yolominds/seacows-periphery/artifacts/contracts/SeacowsRouter.sol/SeacowsRouter.json';
import { expect } from 'chai';
import { type BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import {
  type SeacowsERC721TradePair,
  type SeacowsPositionManager,
  type WETH,
  type MockERC721,
  type MockERC20,
  type MockRoyaltyRegistry,
  type SpeedBump,
} from 'types';

describe('SeacowsRewarder', () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let feeTo: SignerWithAddress;
  let weth: WETH;
  let erc721: MockERC721;
  let erc20: MockERC20;

  let ONE_PERCENT: BigNumber;
  let POINT_FIVE_PERCENT: BigNumber;
  let minRoyaltyFeePercent: BigNumber;

  let speedBump: SpeedBump;
  let template: SeacowsERC721TradePair;
  let manager: SeacowsPositionManager;
  let rendererLib;
  let registry: MockRoyaltyRegistry;
  let router: SeacowsRouter;

  let pair: SeacowsERC721TradePair;
  before(async () => {
    [owner, alice, bob, carol, feeTo] = await ethers.getSigners();

    // Prepare Royalty Registry
    const MockRoyaltyRegistryFC = await ethers.getContractFactory('MockRoyaltyRegistry');
    registry = await MockRoyaltyRegistryFC.deploy(ethers.constants.AddressZero);

    const nftFactoryLibraryFactory = await ethers.getContractFactory('NFTRenderer');
    rendererLib = await nftFactoryLibraryFactory.deploy();

    const WETHFC = await ethers.getContractFactory('WETH');

    const FixidityLibFC = await ethers.getContractFactory('FixidityLib');
    const fixidityLib = await FixidityLibFC.deploy();

    const PricingKernelLibraryFC = await ethers.getContractFactory('PricingKernel', {
      libraries: {
        FixidityLib: fixidityLib.address,
      },
    });
    const pricingKernelLib = await PricingKernelLibraryFC.deploy();
    const SeacowsERC721TradePairFC = await ethers.getContractFactory('SeacowsERC721TradePair', {
      libraries: {
        PricingKernel: pricingKernelLib.address,
      },
    });

    weth = await WETHFC.deploy();
    template = await SeacowsERC721TradePairFC.deploy();

    const erc721FC = await ethers.getContractFactory('MockERC721');
    const erc20FC = await ethers.getContractFactory('MockERC20');
    const SpeedBumpFC = await ethers.getContractFactory('SpeedBump');
    const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
      libraries: {
        NFTRenderer: rendererLib.address,
      },
    });

    erc721 = await erc721FC.deploy();
    erc20 = await erc20FC.deploy();
    speedBump = await SpeedBumpFC.deploy();
    manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address, speedBump.address);
    router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;

    await manager.setFeeTo(feeTo.address);
    await manager.setRoyaltyRegistry(registry.address);
    await speedBump.initialize(manager.address);

    ONE_PERCENT = await template.ONE_PERCENT();
    POINT_FIVE_PERCENT = await template.POINT_FIVE_PERCENT();
  });

  it('it should prepare assets for initialization', async () => {
    /**
     * @notes Alice assets
     * ERC721: [0, 1, 2, 3, 4]
     * ERC20: 100 Ethers
     */
    for (let i = 0; i < 5; i++) {
      await erc721.mint(alice.address);
    }
    await erc20.mint(alice.address, ethers.utils.parseEther('100'));
    expect(await erc721.balanceOf(alice.address)).to.be.equal(5);
    expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('100'));

    /**
     * @notes Bob assets
     * ERC721: [5, 6, 7, 8, 9]
     * ERC20: 100 Ethers
     */
    for (let i = 0; i < 5; i++) {
      await erc721.mint(bob.address);
    }
    await erc20.mint(bob.address, ethers.utils.parseEther('100'));
    expect(await erc721.balanceOf(bob.address)).to.be.equal(5);
    expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('100'));

    /**
     * @notes Carol assets
     * ERC721: [10, 11, 12, 13, 14]
     * ERC20: 100 Ethers
     */
    for (let i = 0; i < 5; i++) {
      await erc721.mint(carol.address);
    }
    await erc20.mint(carol.address, ethers.utils.parseEther('100'));
    expect(await erc721.balanceOf(carol.address)).to.be.equal(5);
    expect(await erc20.balanceOf(carol.address)).to.be.equal(ethers.utils.parseEther('100'));
  });

  it('it should mint correctly for initialization', async () => {
    await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('3'));
    await erc721.connect(alice).setApprovalForAll(manager.address, true);
    await manager
      .connect(alice)
      .mint(
        erc20.address,
        erc721.address,
        ONE_PERCENT,
        ethers.utils.parseEther('3'),
        [0, 1, 2],
        ethers.utils.parseEther('3'),
        MaxUint256,
      );

    await erc20.connect(bob).approve(manager.address, ethers.utils.parseEther('3'));
    await erc721.connect(bob).setApprovalForAll(manager.address, true);
    await manager
      .connect(bob)
      .mint(
        erc20.address,
        erc721.address,
        ONE_PERCENT,
        ethers.utils.parseEther('3'),
        [5, 6, 7],
        ethers.utils.parseEther('3'),
        MaxUint256,
      );
    pair = await ethers.getContractAt(
      'SeacowsERC721TradePair',
      await manager.getPair(erc20.address, erc721.address, ONE_PERCENT),
    );

    expect(await manager.ownerOf(1)).to.be.equal(pair.address);
    expect(await manager.ownerOf(2)).to.be.equal(alice.address);
    expect(await manager.ownerOf(3)).to.be.equal(bob.address);

    await pair.setProtocolFeePercent(1000);
  });

  it('it should be reverted when caller is not position manager', async () => {
    await expect(pair.connect(alice).updatePositionFee(2)).to.be.revertedWithCustomError(
      pair,
      'SPMD_ONLY_POSITION_MANAGER',
    );

    await expect(pair.connect(alice).updatePositionFeeDebt(2)).to.be.revertedWithCustomError(
      pair,
      'SPMD_ONLY_POSITION_MANAGER',
    );
  });

  it('it should have fee calculated correctly', async () => {
    const { tokenInMaxWithSlippage } = await getSwapTokenInMax(pair.address, [0, 1, 2], BI_ZERO, 1, 100, owner);
    expect(tokenInMaxWithSlippage).to.be.equal(ethers.utils.parseEther('6.726600000000000001'));

    await erc20.connect(carol).approve(router.address, tokenInMaxWithSlippage);
    await router
      .connect(carol)
      .swapTokensForExactNFTs(pair.address, [0, 1, 2], tokenInMaxWithSlippage, BI_ZERO, carol.address, MaxUint256);

    expect(await pair.getPendingFee(1)).to.be.equal(0); // 0 fee for Pair's Position NFT
    expect(await pair.getPendingFee(2)).to.be.equal(ethers.utils.parseEther('0.03'));
    expect(await pair.getPendingFee(3)).to.be.equal(ethers.utils.parseEther('0.03'));

    expect(await erc721.ownerOf(0)).to.be.equal(carol.address);
    expect(await erc721.ownerOf(1)).to.be.equal(carol.address);
    expect(await erc721.ownerOf(2)).to.be.equal(carol.address);

    expect(await erc20.balanceOf(feeTo.address)).to.be.equal(ethers.utils.parseEther('0.6'));
  });

  it('it should keep fee remain the same after adding liquidity', async () => {
    const { tokenInMaxWithSlippage } = await getDepositTokenInMax(pair.address, [0, 1, 2], 0, 100, owner);
    expect(tokenInMaxWithSlippage).to.be.equal(ethers.utils.parseEther('12.000000000000000001'));

    await erc20.connect(carol).approve(manager.address, tokenInMaxWithSlippage);
    await erc721.connect(carol).setApprovalForAll(manager.address, true);
    await manager
      .connect(carol)
      .mint(
        erc20.address,
        erc721.address,
        ONE_PERCENT,
        tokenInMaxWithSlippage,
        [0, 1, 2],
        tokenInMaxWithSlippage,
        MaxUint256,
      );

    expect(await pair.getPendingFee(1)).to.be.equal(0); // 0 fee for Pair's Position NFT
    expect(await pair.getPendingFee(2)).to.be.equal(ethers.utils.parseEther('0.03'));
    expect(await pair.getPendingFee(3)).to.be.equal(ethers.utils.parseEther('0.03'));
    expect(await pair.getPendingFee(4)).to.be.equal(0); // 0 fee for Carol's Position NFT

    /**
     * @notes Pair state
     * ERC20: 24.06 Ethers (Fee included)
     * ERC20 Complemented: 24 Ethers (Fee excluded)
     * ERC721: [0, 1, 2, 5, 6, 7]
     */
    expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('24.060000000000000002'));
    const [tokenBalance] = await pair.getBalances();
    expect(tokenBalance).to.be.equal(ethers.utils.parseEther('24.000000000000000002'));

    expect(await erc721.balanceOf(pair.address)).to.be.equal(6);
    expect(await erc721.ownerOf(0)).to.be.equal(pair.address);
    expect(await erc721.ownerOf(1)).to.be.equal(pair.address);
    expect(await erc721.ownerOf(2)).to.be.equal(pair.address);
    expect(await erc721.ownerOf(5)).to.be.equal(pair.address);
    expect(await erc721.ownerOf(6)).to.be.equal(pair.address);
    expect(await erc721.ownerOf(7)).to.be.equal(pair.address);
  });

  it('it should have fee calculated after previous added liquidity', async () => {
    const { tokenInMaxWithSlippage } = await getSwapTokenInMax(pair.address, [0, 1, 2], BI_ZERO, 1, 100, owner);
    expect(tokenInMaxWithSlippage).to.be.equal(ethers.utils.parseEther('26.906400000000000003'));

    await erc20.connect(carol).approve(router.address, tokenInMaxWithSlippage);
    await router
      .connect(carol)
      .swapTokensForExactNFTs(pair.address, [0, 1, 2], tokenInMaxWithSlippage, BI_ZERO, carol.address, MaxUint256);

    expect(await pair.getPendingFee(1)).to.be.equal(0); // 0 fee for Pair's Position NFT
    expect(await pair.getPendingFee(2)).to.be.equal(ethers.utils.parseEther('0.09'));
    expect(await pair.getPendingFee(3)).to.be.equal(ethers.utils.parseEther('0.09'));
    expect(await pair.getPendingFee(4)).to.be.equal(ethers.utils.parseEther('0.12'));

    expect(await erc721.ownerOf(0)).to.be.equal(carol.address);
    expect(await erc721.ownerOf(1)).to.be.equal(carol.address);
    expect(await erc721.ownerOf(2)).to.be.equal(carol.address);

    expect(await erc20.balanceOf(feeTo.address)).to.be.equal(ethers.utils.parseEther('3'));
  });

  it('it should collect fee correctly', async () => {
    const prevAliceBalance = await erc20.balanceOf(alice.address);
    expect(prevAliceBalance).to.be.equal(ethers.utils.parseEther('97'));

    await pair.collect(2);
    expect(await erc20.balanceOf(alice.address)).to.be.equal(prevAliceBalance.add(ethers.utils.parseEther('0.09')));

    expect(await pair.getPendingFee(1)).to.be.equal(0); // 0 fee for Pair's Position NFT
    expect(await pair.getPendingFee(2)).to.be.equal(0); // Fee has been collected
    expect(await pair.getPendingFee(3)).to.be.equal(ethers.utils.parseEther('0.09'));
    expect(await pair.getPendingFee(4)).to.be.equal(ethers.utils.parseEther('0.12'));
  });

  it('it should have correct fee state after user selling NFTs', async () => {
    const { tokenOutMinWithSlippage } = await getSwapTokenOutMin(pair.address, [4], BI_ZERO, 0, 100, owner);
    expect(tokenOutMinWithSlippage).to.be.equal(ethers.utils.parseEther('10.68'));

    await erc721.connect(alice).setApprovalForAll(router.address, true);
    await router
      .connect(alice)
      .swapExactNFTsForTokens(pair.address, [4], tokenOutMinWithSlippage, BI_ZERO, carol.address, MaxUint256);

    expect(await pair.getPendingFee(1)).to.be.equal(0); // 0 fee for Pair's Position NFT
    expect(await pair.getPendingFee(2)).to.be.equal(ethers.utils.parseEther('0.03'));
    expect(await pair.getPendingFee(3)).to.be.equal(ethers.utils.parseEther('0.12'));
    expect(await pair.getPendingFee(4)).to.be.equal(ethers.utils.parseEther('0.18'));

    expect(await erc721.ownerOf(4)).to.be.equal(pair.address);
  });
});
