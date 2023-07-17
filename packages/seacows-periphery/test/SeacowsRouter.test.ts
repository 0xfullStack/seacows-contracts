import { MaxUint256, Zero } from '@ethersproject/constants';
import SeacowsERC721TradePairAbi from '@yolominds/seacows-amm/abis/ISeacowsERC721TradePair.json';
import SeacowsERC721TradePairArtifact from '@yolominds/seacows-amm/artifacts/contracts/SeacowsERC721TradePair.sol/SeacowsERC721TradePair.json';
import SeacowsPositionManagerArtifact from '@yolominds/seacows-amm/artifacts/contracts/SeacowsPositionManager.sol/SeacowsPositionManager.json';
import NFTRendererArtifact from '@yolominds/seacows-amm/artifacts/contracts/lib/NFTRenderer.sol/NFTRenderer.json';
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getSwapTokenInMax, getSwapTokenOutMin } from '@yolominds/seacows-sdk';
import { expect } from 'chai';
import { deployContract } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import {
  type SeacowsERC721TradePair,
  type SeacowsPositionManager,
  type NFTRenderer,
} from '@yolominds/seacows-sdk/types/amm';
import { type WETH, type MockERC20, type MockERC721, type SeacowsRouter, type MockRoyaltyRegistry } from 'types';
import { link } from 'fs';
import { type BigNumber } from 'ethers';

describe('SeacowsRouter', () => {
  let ONE_PERCENT: BigNumber;

  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let weth: WETH;

  let template: SeacowsERC721TradePair;
  let rendererLib: NFTRenderer;
  before(async () => {
    [owner, alice, bob] = await ethers.getSigners();

    const WETHFC = await ethers.getContractFactory('WETH');
    weth = await WETHFC.deploy();

    rendererLib = (await deployContract(owner, NFTRendererArtifact)) as NFTRenderer;
    template = (await deployContract(owner, SeacowsERC721TradePairArtifact)) as SeacowsERC721TradePair;
    ONE_PERCENT = await template.ONE_PERCENT();
  });

  describe('Swap Tokens For Exact NFTs', () => {
    let manager: SeacowsPositionManager;
    let router: SeacowsRouter;
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;

    let registry: MockRoyaltyRegistry;
    let minRoyaltyFeePercent: BigNumber;

    before(async () => {
      // Prepare Royalty Registry
      const MockRoyaltyRegistryFC = await ethers.getContractFactory('MockRoyaltyRegistry');
      registry = await MockRoyaltyRegistryFC.deploy(ethers.constants.AddressZero);

      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();

      const SeacowsPositionManagerFactory = await ethers.getContractFactoryFromArtifact(
        SeacowsPositionManagerArtifact,
        {
          libraries: {
            NFTRenderer: rendererLib.address,
          },
        },
      );
      manager = (await SeacowsPositionManagerFactory.deploy(template.address, weth.address)) as SeacowsPositionManager;
      await manager.deployed();
      await manager.setFeeTo(ethers.constants.AddressZero);
      await manager.setRoyaltyRegistry(registry.address);

      // Deploy Router
      const SeacowsRouterFC = await ethers.getContractFactory('SeacowsRouter');
      router = await SeacowsRouterFC.deploy(manager.address, weth.address);

      /**
       * @notes Prepare assets for Alice
       * ERC20: 10 Ethers
       * ERC721: [0, 1, 2, 3, 4]
       */
      for (let i = 0; i < 10; i++) {
        await erc721.mint(alice.address);
      }
      await erc20.mint(alice.address, ethers.utils.parseEther('10'));
      await erc20.mint(bob.address, ethers.utils.parseEther('10'));

      /**
       * @notes Mint Position NFTs
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Alice: 2
       */
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
      pair = (await ethers.getContractAt(
        SeacowsERC721TradePairAbi,
        await manager.getPair(erc20.address, erc721.address, ONE_PERCENT),
      )) as SeacowsERC721TradePair;
    });

    it('should have 0% min royalty fee intially', async () => {
      minRoyaltyFeePercent = await pair.minRoyaltyFeePercent();
      expect(minRoyaltyFeePercent).to.be.equal(0);
    });

    it('should set min royalty fee correctly', async () => {
      await pair.connect(owner).setMinRoyaltyFeePercent(100);
      minRoyaltyFeePercent = await pair.minRoyaltyFeePercent();
      expect(minRoyaltyFeePercent).to.be.equal(100);
    });

    it('swapTokensForExactNFTs', async () => {
      // bob balances before
      const prevBobBalance = await erc20.balanceOf(bob.address);
      const prevPairBalance = await erc20.balanceOf(pair.address);
      // Caculate how much need to be paid
      const { tokenInMaxWithSlippage: tokenInWithFee } = await getSwapTokenInMax(
        pair.address,
        [1],
        minRoyaltyFeePercent,
        0,
        100,
        owner,
      );
      // Approve token cost
      await erc20.connect(bob).approve(router.address, tokenInWithFee);
      await router
        .connect(bob)
        .swapTokensForExactNFTs(pair.address, [1], tokenInWithFee, minRoyaltyFeePercent, bob.address, MaxUint256);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(prevBobBalance.sub(tokenInWithFee));
      expect(await erc20.balanceOf(pair.address)).to.be.equal(prevPairBalance.add(tokenInWithFee));
      expect(await erc721.ownerOf(1)).to.be.equal(bob.address);
    });

    it('batchSwapTokensForExactNFTs', async () => {
      // bob balances before
      const prevBobBalance = await erc20.balanceOf(bob.address);
      const prevPairBalance = await erc20.balanceOf(pair.address);
      // Caculate how much need to be paid
      const { tokenInMaxWithSlippage: tokenInWithFee } = await getSwapTokenInMax(
        pair.address,
        [2],
        minRoyaltyFeePercent,
        0,
        100,
        owner,
      );
      // Approve token cost
      await erc20.connect(bob).approve(router.address, tokenInWithFee);
      await router
        .connect(bob)
        .batchSwapTokensForExactNFTs(
          [pair.address],
          [[2]],
          [tokenInWithFee],
          minRoyaltyFeePercent,
          bob.address,
          MaxUint256,
        );
      expect(await erc20.balanceOf(bob.address)).to.be.equal(prevBobBalance.sub(tokenInWithFee));
      expect(await erc20.balanceOf(pair.address)).to.be.equal(prevPairBalance.add(tokenInWithFee));
      expect(await erc721.ownerOf(2)).to.be.equal(bob.address);
    });
  });

  describe('Swap Exact NFTs For Tokens', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;
    let manager: SeacowsPositionManager;
    let router: SeacowsRouter;

    let registry: MockRoyaltyRegistry;
    let minRoyaltyFeePercent: BigNumber;

    before(async () => {
      // Prepare Royalty Registry
      const MockRoyaltyRegistryFC = await ethers.getContractFactory('MockRoyaltyRegistry');
      registry = await MockRoyaltyRegistryFC.deploy(ethers.constants.AddressZero);

      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();

      const SeacowsPositionManagerFactory = await ethers.getContractFactoryFromArtifact(
        SeacowsPositionManagerArtifact,
        {
          libraries: {
            NFTRenderer: rendererLib.address,
          },
        },
      );
      manager = (await SeacowsPositionManagerFactory.deploy(template.address, weth.address)) as SeacowsPositionManager;
      await manager.deployed();
      await manager.setRoyaltyRegistry(registry.address);

      // Deploy Router
      const SeacowsRouterFC = await ethers.getContractFactory('SeacowsRouter');
      router = await SeacowsRouterFC.deploy(manager.address, weth.address);

      /**
       * @notes Prepare assets for Alice
       * ERC20: 10 Ethers
       * ERC721: [0, 1, 2, 3, 4]
       */
      for (let i = 0; i < 10; i++) {
        await erc721.mint(alice.address);
      }
      await erc20.mint(alice.address, ethers.utils.parseEther('10'));

      /**
       * @notes Mint Position NFTs
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Alice: 2
       */
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
      pair = (await ethers.getContractAt(
        SeacowsERC721TradePairAbi,
        await manager.getPair(erc20.address, erc721.address, ONE_PERCENT),
      )) as SeacowsERC721TradePair;
      await pair.connect(owner).setProtocolFeePercent(0);
    });

    it('should have 0% min royalty fee intially', async () => {
      minRoyaltyFeePercent = await pair.minRoyaltyFeePercent();
      expect(minRoyaltyFeePercent).to.be.equal(0);
    });

    it('should set min royalty fee correctly', async () => {
      await pair.connect(owner).setMinRoyaltyFeePercent(100);
      minRoyaltyFeePercent = await pair.minRoyaltyFeePercent();
      expect(minRoyaltyFeePercent).to.be.equal(100);
    });

    it('swapExactNFTsForTokens', async () => {
      // Alice balances before
      const prevAliceBalance = await erc20.balanceOf(alice.address);
      const prevPairBalance = await erc20.balanceOf(pair.address);

      // Caculate how much need to be paid
      const { tokenOutMinWithSlippage: tokenOutWithFee } = await getSwapTokenOutMin(
        pair.address,
        [4],
        minRoyaltyFeePercent,
        0,
        100,
        alice,
      );

      await erc721.connect(alice).setApprovalForAll(router.address, true);

      // Approve token cost
      await router
        .connect(alice)
        .swapExactNFTsForTokens(pair.address, [4], 0, minRoyaltyFeePercent, alice.address, MaxUint256);

      expect(await erc20.balanceOf(alice.address)).to.be.equal(prevAliceBalance.add(tokenOutWithFee));
      expect(await erc20.balanceOf(pair.address)).to.be.equal(prevPairBalance.sub(tokenOutWithFee));
      expect(await erc721.ownerOf(4)).to.be.equal(pair.address);
    });

    it('batchSwapExactNFTsForTokens', async () => {
      // Alice balances before
      const prevAliceBalance = await erc20.balanceOf(alice.address);
      const prevPairBalance = await erc20.balanceOf(pair.address);

      // Caculate how much need to be paid
      const { tokenOutMinWithSlippage: tokenOutWithFee } = await getSwapTokenOutMin(
        pair.address,
        [5],
        minRoyaltyFeePercent,
        0,
        100,
        alice,
      );

      await erc721.connect(alice).setApprovalForAll(router.address, true);

      // Approve token cost
      await router
        .connect(alice)
        .batchSwapExactNFTsForTokens([pair.address], [[5]], [0], minRoyaltyFeePercent, alice.address, MaxUint256);

      expect(await erc20.balanceOf(alice.address)).to.be.equal(prevAliceBalance.add(tokenOutWithFee));
      expect(await erc20.balanceOf(pair.address)).to.be.equal(prevPairBalance.sub(tokenOutWithFee));
      expect(await erc721.ownerOf(5)).to.be.equal(pair.address);
    });
  });
});
