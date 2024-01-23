/* eslint-disable @typescript-eslint/naming-convention */
import { MaxUint256 } from '@ethersproject/constants';
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getWithdrawAssetsOutMin } from '@yolominds/seacows-sdk';
import { expect } from 'chai';
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
import { ONE_PERCENT } from './constants';

describe('SpeedBump', () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let weth: WETH;

  let speedBump: SpeedBump;
  let template: SeacowsERC721TradePair;
  let manager: SeacowsPositionManager;
  let rendererLib;

  let registry: MockRoyaltyRegistry;
  before(async () => {
    [owner, alice, bob] = await ethers.getSigners();
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

    // Prepare Royalty Registry
    const MockRoyaltyRegistryFC = await ethers.getContractFactory('MockRoyaltyRegistry');
    registry = await MockRoyaltyRegistryFC.deploy(ethers.constants.AddressZero);
  });

  describe('When register to SpeedBump', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    let Token_NFTpair: SeacowsERC721TradePair;
    let WETH_NFTpair: SeacowsERC721TradePair;
    before(async () => {
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
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);

      for (let i = 0; i < 10; i++) {
        await erc721.mint(alice.address);
      }
      await erc20.mint(alice.address, ethers.utils.parseEther('10'));

      for (let i = 0; i < 5; i++) {
        await erc721.mint(bob.address);
      }
      await erc20.mint(bob.address, ethers.utils.parseEther('100'));

      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('3'));
      await erc721.connect(alice).setApprovalForAll(manager.address, true);
      await manager
        .connect(alice)
        .mint(
          erc20.address,
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('3'),
          [1, 2, 3],
          ethers.utils.parseEther('3'),
          MaxUint256,
        );

      await manager
        .connect(alice)
        .mintWithETH(erc721.address, ONE_PERCENT, [4, 5], ethers.utils.parseEther('2'), MaxUint256, {
          value: ethers.utils.parseEther('2'),
        });

      Token_NFTpair = await ethers.getContractAt(
        'SeacowsERC721TradePair',
        await manager.getPair(erc20.address, erc721.address, ONE_PERCENT),
      );

      WETH_NFTpair = await ethers.getContractAt(
        'SeacowsERC721TradePair',
        await manager.getPair(weth.address, erc721.address, ONE_PERCENT),
      );
    });

    it('it should register to be reverted when sender is not position manager', async () => {
      await expect(speedBump.connect(bob).batchRegisterNFTs(erc721.address, [1], bob.address)).to.be.reverted;
      await expect(speedBump.connect(bob).registerToken(erc20.address, ethers.utils.parseEther('1'), bob.address)).to.be
        .reverted;
      await expect(speedBump.connect(bob).registerETH(ethers.utils.parseEther('1'), bob.address)).to.be.reverted;
    });

    it('it should register Token and NFT when sender is position manager', async () => {
      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        Token_NFTpair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );

      await expect(
        manager
          .connect(alice)
          .removeLiquidity(
            erc20.address,
            erc721.address,
            ONE_PERCENT,
            ethers.utils.parseEther('1'),
            { cTokenOutMin, cNftOutMin, nftIds: [1] },
            2,
            alice.address,
            MaxUint256,
          ),
      )
        .to.emit(speedBump, 'RegisterNFTs')
        .withArgs(alice.address, erc721.address, [1])
        .to.emit(speedBump, 'RegisterToken')
        .withArgs(alice.address, erc20.address, ethers.utils.parseEther('1'));

      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
    });

    it('it should register ETH and NFT when sender is position manager', async () => {
      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        WETH_NFTpair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );

      await expect(
        manager
          .connect(alice)
          .removeLiquidityETH(
            erc721.address,
            ONE_PERCENT,
            ethers.utils.parseEther('1'),
            { cTokenOutMin, cNftOutMin, nftIds: [4] },
            4,
            alice.address,
            MaxUint256,
          ),
      )
        .to.emit(speedBump, 'RegisterNFTs')
        .withArgs(alice.address, erc721.address, [4])
        .to.emit(speedBump, 'RegisterETH')
        .withArgs(alice.address, ethers.utils.parseEther('1'));
    });
  });

  describe('When withdraw from SpeedBump', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    let Token_NFTpair: SeacowsERC721TradePair;
    let WETH_NFTpair: SeacowsERC721TradePair;

    before(async () => {
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
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);

      for (let i = 0; i < 10; i++) {
        await erc721.mint(alice.address);
      }
      await erc20.mint(alice.address, ethers.utils.parseEther('10'));

      for (let i = 0; i < 5; i++) {
        await erc721.mint(bob.address);
      }
      await erc20.mint(bob.address, ethers.utils.parseEther('100'));

      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('3'));
      await erc721.connect(alice).setApprovalForAll(manager.address, true);
      await manager
        .connect(alice)
        .mint(
          erc20.address,
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('3'),
          [1, 2, 3],
          ethers.utils.parseEther('3'),
          MaxUint256,
        );

      Token_NFTpair = await ethers.getContractAt(
        'SeacowsERC721TradePair',
        await manager.getPair(erc20.address, erc721.address, ONE_PERCENT),
      );

      await manager
        .connect(alice)
        .mintWithETH(erc721.address, ONE_PERCENT, [4, 5], ethers.utils.parseEther('2'), MaxUint256, {
          value: ethers.utils.parseEther('2'),
        });

      WETH_NFTpair = await ethers.getContractAt(
        'SeacowsERC721TradePair',
        await manager.getPair(weth.address, erc721.address, ONE_PERCENT),
      );

      const { cTokenOutMin: cTokenOutMin1, cNftOutMin: cNftOutMin1 } = await getWithdrawAssetsOutMin(
        Token_NFTpair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );

      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('3'));
      await erc721.connect(alice).setApprovalForAll(manager.address, true);
      await manager
        .connect(alice)
        .removeLiquidity(
          erc20.address,
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('1'),
          { cTokenOutMin: cTokenOutMin1, cNftOutMin: cNftOutMin1, nftIds: [1] },
          2,
          alice.address,
          MaxUint256,
        );

      const { cTokenOutMin: cTokenOutMin2, cNftOutMin: cNftOutMin2 } = await getWithdrawAssetsOutMin(
        WETH_NFTpair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );

      await manager
        .connect(alice)
        .removeLiquidityETH(
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('1'),
          { cTokenOutMin: cTokenOutMin2, cNftOutMin: cNftOutMin2, nftIds: [4] },
          4,
          alice.address,
          MaxUint256,
        );
    });

    it('it should withdraw Token and NFT to be reverted when sender is not owner', async () => {
      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(2);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('100'));
      expect(await erc721.balanceOf(bob.address)).to.be.equal(5);

      await expect(speedBump.connect(bob).batchWithdrawNFTs(erc721.address, [1])).to.be.revertedWithCustomError(
        speedBump,
        'SSB_UNAUTHORIZED',
      );
      await expect(speedBump.connect(bob).withdrawToken(erc20.address)).to.be.revertedWithCustomError(
        speedBump,
        'SSB_INSUFFICIENT_AMOUNT',
      );

      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(2);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('100'));
      expect(await erc721.balanceOf(bob.address)).to.be.equal(5);
    });

    it('it should withdraw Token and NFT when sender is owner', async () => {
      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(2);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('7'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(5);

      await expect(await speedBump.connect(alice).batchWithdrawNFTs(erc721.address, [1]))
        .to.emit(speedBump, 'WithdrawNFTs')
        .withArgs(alice.address, erc721.address, [1]);

      await expect(speedBump.connect(alice).withdrawToken(erc20.address))
        .to.emit(speedBump, 'WithdrawToken')
        .withArgs(alice.address, erc20.address, ethers.utils.parseEther('1'));

      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('0'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('8'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(6);
    });

    it('it should withdraw ETH and NFT to be reverted when sender is not owner', async () => {
      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc721.balanceOf(bob.address)).to.be.equal(5);

      await expect(speedBump.connect(bob).batchWithdrawNFTs(erc721.address, [4])).to.be.revertedWithCustomError(
        speedBump,
        'SSB_UNAUTHORIZED',
      );
      await expect(speedBump.connect(bob).withdrawETH()).to.be.revertedWithCustomError(
        speedBump,
        'SSB_INSUFFICIENT_AMOUNT',
      );

      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc721.balanceOf(bob.address)).to.be.equal(5);
    });

    it('it should withdraw ETH and NFT to be reverted when sender is owner, but not this NFT tokenID owner', async () => {
      await expect(speedBump.connect(alice).batchWithdrawNFTs(erc721.address, [2])).to.be.revertedWithCustomError(
        speedBump,
        'SSB_UNAUTHORIZED',
      );
    });

    it('it should withdraw ETH and NFT when sender is owner', async () => {
      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc721.balanceOf(alice.address)).to.be.equal(6);

      await expect(await speedBump.connect(alice).batchWithdrawNFTs(erc721.address, [4]))
        .to.emit(speedBump, 'WithdrawNFTs')
        .withArgs(alice.address, erc721.address, [4]);

      await expect(speedBump.connect(alice).withdrawETH())
        .to.emit(speedBump, 'WithdrawETH')
        .withArgs(alice.address, ethers.utils.parseEther('1'));

      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('0'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(0);
      expect(await erc721.balanceOf(alice.address)).to.be.equal(7);
    });
  });
});
