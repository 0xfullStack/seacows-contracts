import { MaxUint256 } from '@ethersproject/constants';
import { deployContract } from 'ethereum-waffle';
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getWithdrawAssetsOutMin } from '@yolominds/seacows-sdk';
import { type SeacowsRouter } from '@yolominds/seacows-sdk/types/periphery';
import SeacowsRouterArtifact from '@yolominds/seacows-periphery/artifacts/contracts/SeacowsRouter.sol/SeacowsRouter.json';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  type SeacowsERC721TradePair,
  type WETH,
  type MockERC721,
  type MockERC20,
  type MockRoyaltyRegistry,
  type SpeedBump,
  type SeacowsPositionManagerWithSpeedBump,
} from 'types';
import { ONE_PERCENT } from './constants';

describe('SeacowsPositionManager', () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let weth: WETH;

  let speedBump: SpeedBump;
  let template: SeacowsERC721TradePair;
  let manager: SeacowsPositionManagerWithSpeedBump;
  let rendererLib;
  let registry: MockRoyaltyRegistry;
  let router: SeacowsRouter;

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

  describe('Remove Liquidity', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');

      const SpeedBumpFC = await ethers.getContractFactory('SpeedBump');
      const SeacowsPositionManagerWithSpeedBumpFC = await ethers.getContractFactory(
        'SeacowsPositionManagerWithSpeedBump',
        {
          libraries: {
            NFTRenderer: rendererLib.address,
          },
        },
      );
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();
      speedBump = await SpeedBumpFC.deploy();
      manager = await SeacowsPositionManagerWithSpeedBumpFC.deploy(template.address, weth.address, speedBump.address);
      router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);

      /**
       * @notes Prepare assets for Alice
       * ERC20: 10 Ethers
       * ERC721: [1, 2, 3, 4, 5]
       */
      for (let i = 0; i < 5; i++) {
        await erc721.mint(alice.address);
      }
      await erc20.mint(alice.address, ethers.utils.parseEther('10'));

      /**
       * @notes Prepare assets for Bob
       * ERC20: 100 Ethers
       * ERC721: [6, 7, 8, 9, 10]
       */
      for (let i = 0; i < 5; i++) {
        await erc721.mint(bob.address);
      }
      await erc20.mint(bob.address, ethers.utils.parseEther('100'));

      /**
       * @notes Mint Position NFTs
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
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
      const pairAddress = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
    });

    it('Should remove liquidity from Pool to SpeedBump', async () => {
      /**
       * @notes Inital Pair State
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(3);

      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('7'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);

      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        pair.address,
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

      /**
       * @notes Pair State after remove liqudity
       * Input ETH: 2 Ethers
       * Input ERC721: [2, 3]
       */
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('2'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(2);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('7'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);

      /**
       * @notes SpeedBump State after remove liqudity
       * Input ETH: 1 Ethers
       * Input ERC721: [2]
       */
      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);

      // Check liqudity balance of Alice Position NFT
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('2'));
    });

    it('Should withdraw to be reverted when sender is not owner', async () => {
      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('100'));
      expect(await erc721.balanceOf(bob.address)).to.be.equal(5);

      await expect(speedBump.connect(bob).batchWithdrawNFTs(erc721.address, [1])).to.be.reverted;
      await expect(speedBump.connect(bob).withdrawToken(erc20.address)).to.be.reverted;

      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('100'));
      expect(await erc721.balanceOf(bob.address)).to.be.equal(5);
    });

    it('Should withdraw assets when sender is owner', async () => {
      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('7'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);

      await expect(await speedBump.connect(alice).batchWithdrawNFTs(erc721.address, [1]))
        .to.emit(speedBump, 'WithdrawNFTs')
        .withArgs(alice.address, erc721.address, [1]);

      await expect(speedBump.connect(alice).withdrawToken(erc20.address))
        .to.emit(speedBump, 'WithdrawToken')
        .withArgs(alice.address, erc20.address, ethers.utils.parseEther('1'));

      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('0'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(0);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('8'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(3);
    });
  });

  describe('Remove Liquidity ETH', () => {
    let erc721: MockERC721;
    let pair: SeacowsERC721TradePair;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');

      const SpeedBumpFC = await ethers.getContractFactory('SpeedBump');
      const SeacowsPositionManagerWithSpeedBumpFC = await ethers.getContractFactory(
        'SeacowsPositionManagerWithSpeedBump',
        {
          libraries: {
            NFTRenderer: rendererLib.address,
          },
        },
      );

      erc721 = await erc721FC.deploy();
      speedBump = await SpeedBumpFC.deploy();
      manager = await SeacowsPositionManagerWithSpeedBumpFC.deploy(template.address, weth.address, speedBump.address);
      router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);

      /**
       * @notes Prepare assets for Alice
       * ERC20: 10 Ethers
       * ERC721: [1, 2, 3, 4, 5]
       */
      for (let i = 0; i < 5; i++) {
        await erc721.mint(alice.address);
      }

      /**
       * @notes Prepare assets for Bob
       * ERC20: 10 Ethers
       * ERC721: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
       */
      for (let i = 0; i < 10; i++) {
        await erc721.mint(bob.address);
      }

      /**
       * @notes Mint Position NFTs
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      await erc721.connect(alice).setApprovalForAll(manager.address, true);
      await manager
        .connect(alice)
        .mintWithETH(erc721.address, ONE_PERCENT, [1, 2, 3], ethers.utils.parseEther('3'), MaxUint256, {
          value: ethers.utils.parseEther('3'),
        });
      const pairAddress = await manager.getPair(weth.address, erc721.address, ONE_PERCENT);
      pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
    });

    it('Should remove liquidity from Pool to SpeedBump', async () => {
      /**
       * @notes Inital Pair State
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      expect(await weth.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(3);
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);
    //   expect(await erc721.ownerOf(2)).to.be.equal(alice.address);

      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        pair.address,
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
            { cTokenOutMin, cNftOutMin, nftIds: [2] },
            2,
            alice.address,
            MaxUint256,
          ),
      )
        .to.emit(speedBump, 'RegisterNFTs')
        .withArgs(alice.address, erc721.address, [2])
        .to.emit(speedBump, 'RegisterETH')
        .withArgs(alice.address, ethers.utils.parseEther('1'));

      /**
       * @notes Pair State after remove liqudity
       * Input ETH: 2 Ethers
       * Input ERC721: [1, 3]
       */
      expect(await weth.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('2'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(2);
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);

      /**
       * @notes SpeedBump State after remove liqudity
       * Input ETH: 1 Ethers
       * Input ERC721: [2]
       */
      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);

      // Check liqudity balance of Alice Position NFT
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('2'));
    });

    it('Should withdraw to be reverted when sender is not owner', async () => {
      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc721.balanceOf(bob.address)).to.be.equal(10);

      await expect(speedBump.connect(bob).batchWithdrawNFTs(erc721.address, [2])).to.be.reverted;
      await expect(speedBump.connect(bob).withdrawETH()).to.be.reverted;

      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc721.balanceOf(bob.address)).to.be.equal(10);
    });

    it('Should withdraw assets when sender is owner', async () => {
      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);

      await expect(await speedBump.connect(alice).batchWithdrawNFTs(erc721.address, [2]))
        .to.emit(speedBump, 'WithdrawNFTs')
        .withArgs(alice.address, erc721.address, [2]);

      await expect(speedBump.connect(alice).withdrawETH())
        .to.emit(speedBump, 'WithdrawETH')
        .withArgs(alice.address, ethers.utils.parseEther('1'));

      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('0'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(0);
      expect(await erc721.balanceOf(alice.address)).to.be.equal(3);
    });
  });
});
