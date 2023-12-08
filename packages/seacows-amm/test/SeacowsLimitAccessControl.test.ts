import { MaxUint256 } from '@ethersproject/constants';
import { deployContract } from 'ethereum-waffle';
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getWithdrawAssetsOutMin, getSwapTokenInMax, getSwapTokenOutMin } from '@yolominds/seacows-sdk';
import { type SeacowsRouter } from '@yolominds/seacows-sdk/types/periphery';
import SeacowsRouterArtifact from '@yolominds/seacows-periphery/artifacts/contracts/SeacowsRouter.sol/SeacowsRouter.json';
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
import { type BigNumber } from 'ethers';

describe('SeacowsLimitAccessControl', () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let weth: WETH;

  let speedBump: SpeedBump;
  let template: SeacowsERC721TradePair;
  let manager: SeacowsPositionManager;
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

  describe('Mint Under Access Control', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
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
    });

    it('Should only owner can change contracts paused/unpaused state', async () => {
      await expect(manager.connect(alice).pause()).to.revertedWith('Ownable: caller is not the owner');
      await expect(manager.connect(owner).pause()).to.emit(manager, 'Paused');
      await expect(manager.connect(owner).unpause()).to.emit(manager, 'Unpaused');
    });

    it('Should create a new pair, mint Position NFT and add liquidity failure if contracts is paused', async () => {
      /**
       * @notes Mint Position NFTs
       * Input ERC20: 1 Ethers
       * Input ERC721: [1]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('3'));
      await erc721.connect(alice).setApprovalForAll(manager.address, true);

      const pairAddress = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).pause()).to.emit(manager, 'Paused');

      /**
       * @notes Verify Event emitted
       * Alice Position NFT
       */
      await expect(
        manager
          .connect(alice)
          .mint(
            erc20.address,
            erc721.address,
            ONE_PERCENT,
            ethers.utils.parseEther('3'),
            [1, 2, 3],
            ethers.utils.parseEther('3'),
            MaxUint256,
          ),
      ).to.revertedWithCustomError(manager, 'SPMD_PAUSED');
    });

    it('Should create a new pair, mint Position NFT and add liquidity success if contracts is not paused', async () => {
      /**
       * @notes Mint Position NFTs
       * Input ERC20: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('3'));
      await erc721.connect(alice).setApprovalForAll(manager.address, true);

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).unpause()).to.emit(manager, 'Unpaused');

      const txn = await manager
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
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
      /**
       * @notes Verify Event emitted
       * Alice Position NFT
       */
      await expect(txn)
        .to.emit(manager, 'PairCreated')
        .withArgs(erc20.address, erc721.address, ONE_PERCENT, 1, pair.address)
        .to.emit(manager, 'Transfer')
        .withArgs(ethers.constants.AddressZero, alice.address, 2)
        .to.emit(manager, 'TransferValue')
        .withArgs(0, 2, ethers.utils.parseEther('3'));
    });
  });

  describe('Mint ETH Under Access Control', () => {
    let erc721: MockERC721;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const SpeedBumpFC = await ethers.getContractFactory('SpeedBump');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });
      erc721 = await erc721FC.deploy();
      speedBump = await SpeedBumpFC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address, speedBump.address);
      router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);
      /**
       * @notes Prepare assets for Alice
       * ERC721: [1, 2, 3, 4, 5]
       */
      for (let i = 0; i < 5; i++) {
        await erc721.mint(alice.address);
      }
    });

    it('Should create a new pair, mint Position NFT and add liquidity failure if contracts is paused', async () => {
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

      const pairAddress = await manager.getPair(weth.address, erc721.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).pause()).to.emit(manager, 'Paused');

      /**
       * @notes Verify Event emitted
       * Alice Position NFT
       */
      await expect(
        manager
          .connect(alice)
          .mintWithETH(erc721.address, ONE_PERCENT, [1, 2, 3], ethers.utils.parseEther('3'), MaxUint256, {
            value: ethers.utils.parseEther('3'),
          }),
      ).to.revertedWithCustomError(manager, 'SPMD_PAUSED');
    });

    it('Should create a new pair, mint Position NFT and add liquidity success if contracts is not paused', async () => {
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

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).unpause()).to.emit(manager, 'Unpaused');

      const txn = await manager
        .connect(alice)
        .mintWithETH(erc721.address, ONE_PERCENT, [1, 2, 3], ethers.utils.parseEther('3'), MaxUint256, {
          value: ethers.utils.parseEther('3'),
        });

      const pairAddress = await manager.getPair(weth.address, erc721.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
      /**
       * @notes Verify Event emitted
       * Alice Position NFT
       */
      await expect(txn)
        .to.emit(manager, 'PairCreated')
        .withArgs(weth.address, erc721.address, ONE_PERCENT, 1, pair.address)
        .to.emit(manager, 'Transfer')
        .withArgs(ethers.constants.AddressZero, alice.address, 2)
        .to.emit(manager, 'TransferValue')
        .withArgs(0, 2, ethers.utils.parseEther('3'));
    });
  });

  describe('Add Liquidity Under Access Control', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
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
    });

    it('Should add liquidity to existing NFT IDs failure if contracts if paused', async () => {
      /**
       * @notes Inital Pair State
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      const pairAddress = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      expect(await erc20.balanceOf(pairAddress)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(pairAddress)).to.be.equal(3);

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).pause()).to.emit(manager, 'Paused');

      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('1'));
      await expect(
        manager
          .connect(alice)
          .addLiquidity(
            erc20.address,
            erc721.address,
            ONE_PERCENT,
            ethers.utils.parseEther('1'),
            [4],
            ethers.utils.parseEther('1'),
            2,
            MaxUint256,
          ),
      ).to.revertedWithCustomError(manager, 'SPMD_PAUSED');
    });

    it('Should add liquidity to existing NFT IDs success if contracts not paused', async () => {
      /**
       * @notes Inital Pair State
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      const pairAddress = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      expect(await erc20.balanceOf(pairAddress)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(pairAddress)).to.be.equal(3);

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).unpause()).to.emit(manager, 'Unpaused');

      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('1'));
      await manager
        .connect(alice)
        .addLiquidity(
          erc20.address,
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('1'),
          [4],
          ethers.utils.parseEther('1'),
          2,
          MaxUint256,
        );
    });
  });

  describe('Add Liquidity ETH Under Access Control', () => {
    let erc721: MockERC721;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const SpeedBumpFC = await ethers.getContractFactory('SpeedBump');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });
      erc721 = await erc721FC.deploy();
      speedBump = await SpeedBumpFC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address, speedBump.address);
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);

      /**
       * @notes Prepare assets for Alice
       * ERC721: [1, 2, 3, 4, 5]
       */
      for (let i = 0; i < 5; i++) {
        await erc721.mint(alice.address);
      }

      /**
       * @notes Mint Position NFTs
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
    });
    it('Should add liquidity with ETH to existing NFT IDs failure if contracts if paused', async () => {
      /**
       * @notes Inital Pair State
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      const pairAddress = await manager.getPair(weth.address, erc721.address, ONE_PERCENT);
      expect(await weth.balanceOf(pairAddress)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(pairAddress)).to.be.equal(3);

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).pause()).to.emit(manager, 'Paused');

      await expect(
        manager
          .connect(alice)
          .addLiquidityETH(erc721.address, ONE_PERCENT, [4], ethers.utils.parseEther('1'), 2, MaxUint256, {
            value: ethers.utils.parseEther('1'),
          }),
      ).to.revertedWithCustomError(manager, 'SPMD_PAUSED');
    });

    it('Should add liquidity with ETH to existing NFT IDs success if contracts not paused', async () => {
      /**
       * @notes Inital Pair State
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      const pairAddress = await manager.getPair(weth.address, erc721.address, ONE_PERCENT);
      expect(await weth.balanceOf(pairAddress)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(pairAddress)).to.be.equal(3);
      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).unpause()).to.emit(manager, 'Unpaused');
      await manager
        .connect(alice)
        .addLiquidityETH(erc721.address, ONE_PERCENT, [4], ethers.utils.parseEther('1'), 2, MaxUint256, {
          value: ethers.utils.parseEther('1'),
        });
    });
  });

  describe('Remove Liquidity Under Access Control', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;
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

    it('Should remove liquidity from Pool to SpeedBump failure if contracts is paused', async () => {
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
      expect(await erc721.ownerOf(1)).to.be.equal(pair.address);

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).pause()).to.emit(manager, 'Paused');

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
      ).to.revertedWithCustomError(manager, 'SPMD_PAUSED');
    });

    it('Should remove liquidity from Pool to SpeedBump success if contracts not unpaused', async () => {
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
      expect(await erc721.ownerOf(1)).to.be.equal(pair.address);

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).unpause()).to.emit(manager, 'Unpaused');

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
    });
  });

  describe('Remove Liquidity ETH Under Access Control', () => {
    let erc721: MockERC721;
    let pair: SeacowsERC721TradePair;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const SpeedBumpFC = await ethers.getContractFactory('SpeedBump');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });
      erc721 = await erc721FC.deploy();
      speedBump = await SpeedBumpFC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address, speedBump.address);
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

    it('Should remove liquidity from Pool to SpeedBump failure if contracts is paused', async () => {
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
      expect(await erc721.ownerOf(2)).to.be.equal(pair.address);

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).pause()).to.emit(manager, 'Paused');

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
      ).to.revertedWithCustomError(manager, 'SPMD_PAUSED');
    });

    it('Should remove liquidity from Pool to SpeedBump success if contracts is not paused', async () => {
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
      expect(await erc721.ownerOf(2)).to.be.equal(pair.address);

      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        pair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );

      await expect(manager.connect(owner).unpause()).to.emit(manager, 'Unpaused');

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
  });

  describe('Swap Tokens For Exact NFTs Under Access Control', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;
    let minRoyaltyFeePercent: BigNumber;
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
      minRoyaltyFeePercent = await pair.minRoyaltyFeePercent();
    });

    it('swapTokensForExactNFTs should be failure if contracts is paused', async () => {
      // Caculate how much need to be paid
      const { tokenInMaxWithSlippage } = await getSwapTokenInMax(
        pair.address,
        [1],
        minRoyaltyFeePercent,
        1,
        100,
        owner,
      );

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).pause()).to.emit(manager, 'Paused');

      expect(tokenInMaxWithSlippage).to.be.equal(ethers.utils.parseEther('1.530604500000000001'));

      // Approve token cost
      await erc20.connect(bob).approve(router.address, tokenInMaxWithSlippage);
      await expect(
        router
          .connect(bob)
          .swapTokensForExactNFTs(
            pair.address,
            [1],
            tokenInMaxWithSlippage,
            minRoyaltyFeePercent,
            bob.address,
            MaxUint256,
          ),
      ).to.revertedWithCustomError(manager, 'SPMD_PAUSED');
    });

    it('swapTokensForExactNFTs should be success if contracts is not paused', async () => {
      // Caculate how much need to be paid
      const { tokenInMaxWithSlippage } = await getSwapTokenInMax(
        pair.address,
        [1],
        minRoyaltyFeePercent,
        1,
        100,
        owner,
      );

      expect(tokenInMaxWithSlippage).to.be.equal(ethers.utils.parseEther('1.530604500000000001'));

      /**
       * @notes Set contracts paused
       */
      await expect(manager.connect(owner).unpause()).to.emit(manager, 'Unpaused');

      // Approve token cost
      await erc20.connect(bob).approve(router.address, tokenInMaxWithSlippage);
      await router
        .connect(bob)
        .swapTokensForExactNFTs(
          pair.address,
          [1],
          tokenInMaxWithSlippage,
          minRoyaltyFeePercent,
          bob.address,
          MaxUint256,
        );
    });
  });
});
