import { MaxUint256 } from '@ethersproject/constants';
import { deployContract } from 'ethereum-waffle';
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getWithdrawAssetsOutMin, BI_ZERO } from '@yolominds/seacows-sdk';
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
} from 'types';
import { ONE_PERCENT, POINT_FIVE_PERCENT } from './constants';
import { sqrt } from './utils';

describe('SeacowsPositionManager', () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let weth: WETH;

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
  });

  describe('Create Pair', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    beforeEach(async () => {
      // Prepare Royalty Registry
      const MockRoyaltyRegistryFC = await ethers.getContractFactory('MockRoyaltyRegistry');
      registry = await MockRoyaltyRegistryFC.deploy(ethers.constants.AddressZero);

      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });

      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address);
      router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;
    });

    it('Should have correct initial configuration after create pair', async () => {
      await manager.createPair(erc20.address, erc721.address, ONE_PERCENT);

      const pairAddress = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);

      expect(await pair.positionManager()).to.be.equal(manager.address);
      expect(await pair.feePercent()).to.be.equal(ONE_PERCENT);
      expect(await pair.PERCENTAGE_PRECISION()).to.be.equal(10000);
      expect(await pair.ONE_PERCENT()).to.be.equal(ONE_PERCENT);
      expect(await pair.POINT_FIVE_PERCENT()).to.be.equal(POINT_FIVE_PERCENT);
      expect(await pair.slot()).to.be.equal(1);
      expect(await pair.totalSupply()).to.be.equal(0);
    });

    it('Should mint 2 NFTs for the Pair', async () => {
      await manager.createPair(erc20.address, erc721.address, ONE_PERCENT);

      const pairAddress = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);

      expect(await manager.tokenOf(pair.address)).to.be.equal(1);
    });

    it('Should create same pair with different fee', async () => {
      await expect(manager.createPair(erc20.address, erc721.address, ONE_PERCENT)).to.be.emit(manager, 'PairCreated');
      await expect(manager.createPair(erc20.address, erc721.address, POINT_FIVE_PERCENT)).to.be.emit(
        manager,
        'PairCreated',
      );
    });

    it('Should not create same pair with the same fee that created before', async () => {
      const ONE_PERCENT = 100;
      await manager.createPair(erc20.address, erc721.address, ONE_PERCENT);

      await expect(manager.createPair(erc20.address, erc721.address, ONE_PERCENT)).to.be.revertedWith(
        'Factory: Pair already exists',
      );
    });
  });

  describe('Mint', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address);
      router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;

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

    it('Should create a new pair, mint Position NFT and add liquidity', async () => {
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

      // Verify Pair assets
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(3);

      // Verify Position NFT owned by Alice
      expect(await manager.ownerOf(2)).to.be.equal(alice.address);
      const [balance0, balance1] = await pair.getComplementedBalance();
      const liquidity = sqrt(balance0.mul(balance1));
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(liquidity);

      // Verify Alice balances
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('7'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);
    });

    it('Should mint anonther Position NFT and add liquidity', async () => {
      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('1'));

      const pair = await ethers.getContractAt(
        'SeacowsERC721TradePair',
        await manager.getPair(erc20.address, erc721.address, ONE_PERCENT),
      );
      const [reserve0, reserve1] = await pair.getReserves();
      const totalSupply = await pair.totalSupply();
      const liquidity0 = ethers.utils.parseEther('1').mul(totalSupply).div(reserve0);
      const liquidity1 = ethers.utils.parseEther('1').mul(totalSupply).div(reserve1);
      const liquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1;
      await expect(
        manager
          .connect(alice)
          .mint(
            erc20.address,
            erc721.address,
            ONE_PERCENT,
            ethers.utils.parseEther('1'),
            [4],
            ethers.utils.parseEther('1'),
            MaxUint256,
          ),
      )
        .to.emit(manager, 'Transfer')
        .withArgs(ethers.constants.AddressZero, alice.address, 3)
        .to.emit(manager, 'TransferValue')
        .withArgs(0, 3, liquidity);

      // Verify Pair assets
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('4'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(4);
    });
  });

  describe('Mint ETH', () => {
    let erc721: MockERC721;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });
      erc721 = await erc721FC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address);
      router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;

      /**
       * @notes Prepare assets for Alice
       * ERC721: [1, 2, 3, 4, 5]
       */
      for (let i = 0; i < 5; i++) {
        await erc721.mint(alice.address);
      }
    });

    it('Should create a new pair, mint Position NFT and add liquidity with ETH', async () => {
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

      // Verify Pair assets
      expect(await weth.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(3);

      // Verify Position NFT owned by Alice
      expect(await manager.ownerOf(2)).to.be.equal(alice.address);
      const [balance0, balance1] = await pair.getComplementedBalance();
      const liquidity = sqrt(balance0.mul(balance1));
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(liquidity);

      // Verify Alice balances
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);
    });

    it('Should mint anonther Position NFT and add liquidity with ETH', async () => {
      const pair = await ethers.getContractAt(
        'SeacowsERC721TradePair',
        await manager.getPair(weth.address, erc721.address, ONE_PERCENT),
      );
      const [reserve0, reserve1] = await pair.getReserves();
      const totalSupply = await pair.totalSupply();
      const liquidity0 = ethers.utils.parseEther('1').mul(totalSupply).div(reserve0);
      const liquidity1 = ethers.utils.parseEther('1').mul(totalSupply).div(reserve1);
      const liquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1;
      await expect(
        manager.connect(alice).mintWithETH(erc721.address, ONE_PERCENT, [4], ethers.utils.parseEther('1'), MaxUint256, {
          value: ethers.utils.parseEther('1'),
        }),
      )
        .to.emit(manager, 'Transfer')
        .withArgs(ethers.constants.AddressZero, alice.address, 3)
        .to.emit(manager, 'TransferValue')
        .withArgs(0, 3, liquidity);

      // Verify Pair assets
      expect(await weth.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('4'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(4);
    });
  });

  describe('Add Liquidity', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address);
      router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;

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

    it('Should add liquidity to existing NFT IDs', async () => {
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
      /**
       * @notes Pair State after add liqudity
       * Input ETH: 4 Ethers
       * Input ERC721: [1, 2, 3, 4]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      expect(await erc20.balanceOf(pairAddress)).to.be.equal(ethers.utils.parseEther('4'));
      expect(await erc721.balanceOf(pairAddress)).to.be.equal(4);

      // Check liqudity balance of Alice Position NFT
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('4'));
    });

    it('Should revert for invalid token ID', async () => {
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
            10,
            MaxUint256,
          ),
      ).to.rejectedWith('SeacowsPositionManager: INVALID_TOKEN_ID');
    });
  });

  describe('Add Liquidity ETH', () => {
    let erc721: MockERC721;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });
      erc721 = await erc721FC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address);
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

    it('Should add liquidity with ETH to existing NFT IDs', async () => {
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

      await manager
        .connect(alice)
        .addLiquidityETH(erc721.address, ONE_PERCENT, [4], ethers.utils.parseEther('1'), 2, MaxUint256, {
          value: ethers.utils.parseEther('1'),
        });
      /**
       * @notes Pair State after add liqudity
       * Input ETH: 4 Ethers
       * Input ERC721: [1, 2, 3, 4]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      expect(await weth.balanceOf(pairAddress)).to.be.equal(ethers.utils.parseEther('4'));
      expect(await erc721.balanceOf(pairAddress)).to.be.equal(4);

      // Check liqudity balance of Alice Position NFT
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('4'));
    });

    it('Should revert for invalid token ID', async () => {
      await expect(
        manager
          .connect(alice)
          .addLiquidityETH(erc721.address, ONE_PERCENT, [4], ethers.utils.parseEther('1'), 10, MaxUint256, {
            value: ethers.utils.parseEther('1'),
          }),
      ).to.rejectedWith('SeacowsPositionManager: INVALID_TOKEN_ID');
    });
  });

  describe('Remove Liquidity', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address);
      router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;

      await manager.setRoyaltyRegistry(registry.address);

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

    it('Should remove liquidity from existing NFT IDs', async () => {
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

      await manager
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
        );
      /**
       * @notes Pair State after remove liqudity
       * Input ETH: 2 Ethers
       * Input ERC721: [2, 3]
       */
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('2'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(2);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('8'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(3);

      // Check liqudity balance of Alice Position NFT
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('2'));
    });

    it('Should revert for invalid token ID', async () => {
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
            { cTokenOutMin, cNftOutMin, nftIds: [2] },
            5,
            alice.address,
            MaxUint256,
          ),
      ).to.rejectedWith('SeacowsPositionManager: INVALID_TOKEN_ID');
    });
  });

  describe('Remove Liquidity ETH', () => {
    let erc721: MockERC721;
    let pair: SeacowsERC721TradePair;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });
      erc721 = await erc721FC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address);
      router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;
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

    it('Should remove liquidity from existing NFT IDs', async () => {
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

      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        pair.address,
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
          { cTokenOutMin, cNftOutMin, nftIds: [2] },
          2,
          alice.address,
          MaxUint256,
        );
      /**
       * @notes Pair State after add liqudity
       * Input ETH: 2 Ethers
       * Input ERC721: [1, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Pair Lock Position: 2
       * Position NFT ID of Alice: 3
       */
      expect(await weth.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('2'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(2);
      expect(await erc721.balanceOf(alice.address)).to.be.equal(3);

      // // Check liqudity balance of Alice Position NFT
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('2'));
    });

    it('Should revert for invalid token ID', async () => {
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
            5,
            alice.address,
            MaxUint256,
          ),
      ).to.rejectedWith('SeacowsPositionManager: INVALID_TOKEN_ID');
    });
  });

  describe('Burn', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;
    before(async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
        libraries: {
          NFTRenderer: rendererLib.address,
        },
      });
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();
      manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address);
      router = (await deployContract(owner, SeacowsRouterArtifact, [manager.address, weth.address])) as SeacowsRouter;
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
      const pairAddress = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
    });

    it('Should not burn liquidity when liquidity > 0 in the NFT', async () => {
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('3'));
      await expect(manager.connect(alice).burn(2)).to.be.revertedWith('SeacowsPositionManager: NOT_CLEARED');
    });

    it('Should burn liquidity when liquidity = 0 in the NFT', async () => {
      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        pair.address,
        ethers.utils.parseEther('3'),
        0,
        100,
        alice,
      );
      await manager
        .connect(alice)
        .removeLiquidity(
          erc20.address,
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('3'),
          { cTokenOutMin, cNftOutMin, nftIds: [1, 2, 3] },
          2,
          alice.address,
          MaxUint256,
        );
      await expect(manager.connect(alice).burn(2))
        .to.emit(manager, 'Transfer')
        .withArgs(alice.address, ethers.constants.AddressZero, 2)
        .to.emit(manager, 'TransferValue')
        .withArgs(2, 0, 0);
    });
  });
});
