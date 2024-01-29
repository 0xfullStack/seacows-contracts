import { AddressZero, MaxUint256 } from '@ethersproject/constants';
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
import { ONE_PERCENT, POINT_FIVE_PERCENT } from './constants';
import { ONE, TWO, ZERO, ZERO_ADDRESS, sqrt } from './utils';

describe('SeacowsPositionManager', () => {
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

  describe('Before Each', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    beforeEach(async () => {
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
    });

    it('it should support payable to receive Ethers only from WETH', async () => {
      expect(await ethers.provider.getBalance(manager.address)).to.be.equal(ZERO);

      // sender is not WETH, failure
      await expect(
        alice.sendTransaction({ to: manager.address, value: ethers.utils.parseEther('12.0') }),
      ).to.be.revertedWithoutReason();
      expect(await ethers.provider.getBalance(manager.address)).to.be.equal(ZERO);

      // sender is WETH, successful
      await weth.connect(alice).deposit({ value: ethers.utils.parseEther('12') });
      await weth.connect(alice)['withdraw(address,uint256)'](manager.address, ethers.utils.parseEther('12'));
      expect(await ethers.provider.getBalance(manager.address)).to.be.equal(ethers.utils.parseEther('12.0'));
    });
  });

  describe('When Create Pair', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    beforeEach(async () => {
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
    });

    it('it should have correct initial configuration after create pair', async () => {
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

    it('it should mint 2 NFTs for the Pair', async () => {
      await manager.createPair(erc20.address, erc721.address, ONE_PERCENT);
      const pairAddress = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
      expect(await manager.tokenOf(pair.address)).to.be.equal(1);
    });

    it('it should create multiple pairs without any interference between them', async () => {
      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      const erc721One = await erc721FC.deploy();
      const erc20One = await erc20FC.deploy();
      const erc721Two = await erc721FC.deploy();
      const erc20Two = await erc20FC.deploy();
      const erc721Three = await erc721FC.deploy();
      const erc20Three = await erc20FC.deploy();

      await manager.createPair(erc20One.address, erc721One.address, ONE_PERCENT);
      await manager.createPair(erc20Two.address, erc721Three.address, ONE_PERCENT);
      await manager.createPair(erc20Three.address, erc721Two.address, ONE_PERCENT);
      await manager.createPair(erc20Two.address, erc721One.address, ONE_PERCENT);
      await manager.createPair(erc20Two.address, erc721Three.address, POINT_FIVE_PERCENT);

      const pairAddress1 = await manager.getPair(erc20One.address, erc721One.address, ONE_PERCENT);
      const pairAddress2 = await manager.getPair(erc20Two.address, erc721Three.address, ONE_PERCENT);
      const pairAddress3 = await manager.getPair(erc20Three.address, erc721Two.address, ONE_PERCENT);
      const pairAddress4 = await manager.getPair(erc20Two.address, erc721One.address, ONE_PERCENT);
      const pairAddress5 = await manager.getPair(erc20Two.address, erc721Three.address, POINT_FIVE_PERCENT);

      const pair1 = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress1);
      const pair2 = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress2);
      const pair3 = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress3);
      const pair4 = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress4);
      const pair5 = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress5);

      expect(await manager.tokenOf(pair1.address)).to.be.equal(1);
      expect(await manager.tokenOf(pair2.address)).to.be.equal(2);
      expect(await manager.tokenOf(pair3.address)).to.be.equal(3);
      expect(await manager.tokenOf(pair4.address)).to.be.equal(4);
      expect(await manager.tokenOf(pair5.address)).to.be.equal(5);
    });

    it('it should not create pair when use unsupported fee rule', async () => {
      await expect(manager.createPair(erc20.address, erc721.address, 500)).to.be.revertedWithCustomError(
        manager,
        'STP_INVALID_FEE',
      );
    });

    it('it should create same pair with different fee', async () => {
      await expect(manager.createPair(erc20.address, erc721.address, ONE_PERCENT)).to.be.emit(manager, 'PairCreated');
      await expect(manager.createPair(erc20.address, erc721.address, POINT_FIVE_PERCENT)).to.be.emit(
        manager,
        'PairCreated',
      );
    });

    it('it should not create same pair with the same fee that created before', async () => {
      const ONE_PERCENT = 100;
      await manager.createPair(erc20.address, erc721.address, ONE_PERCENT);

      await expect(manager.createPair(erc20.address, erc721.address, ONE_PERCENT)).to.revertedWithCustomError(
        manager,
        'STPF_PAIR_ALREADY_EXIST',
      );
    });
  });

  describe('When Mint', () => {
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

    it('it should create a new pair, mint Position NFT and add liquidity failure if initial nfts mininum liquidity amount < 2', async () => {
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
            ethers.utils.parseEther('1'),
            [1],
            ethers.utils.parseEther('1'),
            MaxUint256,
          ),
      ).to.revertedWithCustomError(manager, 'SPM_INSUFFICIENT_MINIMUM_LIQUIDITY_AMOUNT');

      // Verify Pair assets
      expect(pair.address).to.be.eq(AddressZero);
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('0'));
      await expect(erc721.balanceOf(pair.address)).to.be.revertedWith('ERC721: address zero is not a valid owner');

      // Verify Position NFT owned by address zero
      await expect(manager.ownerOf(2)).to.be.revertedWith('ERC3525: invalid token ID');
      await expect(manager['balanceOf(uint256)'](2)).to.be.revertedWith('ERC3525: invalid token ID');

      // Verify Alice balances no change
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('10'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(5);
    });

    it('it should create a new pair, mint Position NFT and add liquidity success if initial nfts mininum liquidity amount >= 2', async () => {
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

      // use minimum amount as token amount: 0
      await expect(
        manager.connect(alice).mint(erc20.address, erc721.address, ONE_PERCENT, ZERO, [1, 2, 3], ZERO, MaxUint256),
      ).to.be.revertedWithCustomError(manager, 'STP_INSUFFICIENT_LIQUIDITY_MINTED');

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
      const [balance0, balance1] = await pair.getBalances();
      const liquidity = sqrt(balance0.mul(balance1));
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(liquidity);

      // Verify Alice balances
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('7'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);
    });

    it('it should mint another Position NFT and add liquidity', async () => {
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

  describe('When Mint With ETH', () => {
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
    });

    it('it should create a new pair, mint Position NFT and add liquidity failure if initial nfts mininum liquidity amount < 2', async () => {
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
       * @notes Verify Event emitted
       * Alice Position NFT
       */
      await expect(
        manager.connect(alice).mintWithETH(erc721.address, ONE_PERCENT, [1], ethers.utils.parseEther('1'), MaxUint256, {
          value: ethers.utils.parseEther('3'),
        }),
      ).to.revertedWithCustomError(manager, 'SPM_INSUFFICIENT_MINIMUM_LIQUIDITY_AMOUNT');

      // Verify Pair assets
      expect(pair.address).to.be.eq(AddressZero);
      expect(await weth.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('0'));
      await expect(erc721.balanceOf(pair.address)).to.be.revertedWith('ERC721: address zero is not a valid owner');

      // Verify Position NFT owned by address zero
      await expect(manager.ownerOf(2)).to.be.revertedWith('ERC3525: invalid token ID');
      await expect(manager['balanceOf(uint256)'](2)).to.be.revertedWith('ERC3525: invalid token ID');

      // Verify Alice balances no change
      expect(await erc721.balanceOf(alice.address)).to.be.equal(5);
    });

    it('it should create a new pair, mint Position NFT and add liquidity success if initial nfts mininum liquidity amount >= 2', async () => {
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
      const [balance0, balance1] = await pair.getBalances();
      const liquidity = sqrt(balance0.mul(balance1));
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(liquidity);

      // Verify Alice balances
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);
    });

    it('it should mint another Position NFT and add liquidity with ETH', async () => {
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

  describe('When Add Liquidity', () => {
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

    it('it should add liquidity failure if deadline is passed', async () => {
      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('1'));
      await expect(
        manager.connect(alice).addLiquidity(
          erc20.address,
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('1'),
          [4],
          ethers.utils.parseEther('1'),
          2,
          0, // make deadline less than current block timestamp
        ),
      ).to.be.revertedWithCustomError(manager, 'SPM_EXPIRED');
    });

    it('it should add liquidity to existing NFT IDs', async () => {
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
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
      expect(await erc20.balanceOf(pairAddress)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(pairAddress)).to.be.equal(3);

      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('1'));

      const txn = await manager
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

      await expect(txn)
        .to.emit(pair, 'Mint')
        .withArgs(manager.address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1'));

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

    it('it should revert for invalid token ID', async () => {
      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('1'));

      // use a non-existed tokenID
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
      ).to.revertedWith('ERC3525: invalid token ID');

      // use a existed tokenID, but belong to other users' or pool's
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
            1,
            MaxUint256,
          ),
      ).to.revertedWithCustomError(manager, 'SPM_INVALID_TOKEN_ID');
    });
  });

  describe('When Add Liquidity With ETH', () => {
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

    it('it should add liquidity with ETH failure if deadline is passed', async () => {
      await expect(
        manager.connect(alice).addLiquidityETH(
          erc721.address,
          ONE_PERCENT,
          [4],
          ethers.utils.parseEther('1'),
          2,
          0, // make deadline less than current block timestamp,
          {
            value: ethers.utils.parseEther('1'),
          },
        ),
      ).to.be.revertedWithCustomError(manager, 'SPM_EXPIRED');
    });

    it('it should add liquidity with ETH to existing NFT IDs', async () => {
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

      // use insufficient amount
      await expect(
        manager
          .connect(alice)
          .addLiquidityETH(erc721.address, ONE_PERCENT, [4], ethers.utils.parseEther('1'), 2, MaxUint256, {
            value: ethers.utils.parseEther('0.5'),
          }),
      ).to.be.revertedWithCustomError(manager, 'SPM_INSUFFICIENT_AMOUNT');

      // use enough amount
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

    it('it should revert for invalid token ID', async () => {
      // use a non-existed tokenID
      await expect(
        manager
          .connect(alice)
          .addLiquidityETH(erc721.address, ONE_PERCENT, [4], ethers.utils.parseEther('1'), 10, MaxUint256, {
            value: ethers.utils.parseEther('1'),
          }),
      ).to.revertedWith('ERC3525: invalid token ID');

      // use a existed tokenID, but belong to other users' or pool's
      await expect(
        manager
          .connect(alice)
          .addLiquidityETH(erc721.address, ONE_PERCENT, [4], ethers.utils.parseEther('1'), 1, MaxUint256, {
            value: ethers.utils.parseEther('1'),
          }),
      ).to.revertedWithCustomError(manager, 'SPM_INVALID_TOKEN_ID');
    });
  });

  describe('When Remove Liquidity', () => {
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
      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('1000'));
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

    it('it should remove liquidity failure if deadline is passed', async () => {
      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        pair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );
      await expect(
        manager.connect(alice).removeLiquidity(
          erc20.address,
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('1'),
          { cTokenOutMin, cNftOutMin, nftIds: [1] },
          2,
          alice.address,
          0, // make deadline less than current block timestamp
        ),
      ).to.be.revertedWithCustomError(manager, 'SPM_EXPIRED');
    });

    it('it should remove liquidity partial from Pool to SpeedBump', async () => {
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

      const { cTokenOutMin: cTokenOutMin1, cNftOutMin: cNftOutMin1 } = await getWithdrawAssetsOutMin(
        pair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );

      // Partial Liquidity Removal
      await expect(
        manager
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

      // Remove all left
      const { cTokenOutMin: cTokenOutMin2, cNftOutMin: cNftOutMin2 } = await getWithdrawAssetsOutMin(
        pair.address,
        ethers.utils.parseEther('2'),
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
            ethers.utils.parseEther('2'),
            { cTokenOutMin: cTokenOutMin2, cNftOutMin: cNftOutMin2, nftIds: [2, 3] },
            2,
            alice.address,
            MaxUint256,
          ),
      )
        .to.emit(speedBump, 'RegisterNFTs')
        .withArgs(alice.address, erc721.address, [2, 3])
        .to.emit(speedBump, 'RegisterToken')
        .withArgs(alice.address, erc20.address, ethers.utils.parseEther('2'));

      // Check liqudity balance of Alice Position NFT
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ZERO);

      // check it will warning with MINIMUM LIQUIDITY required.
      await expect(
        manager
          .connect(alice)
          .mint(
            erc20.address,
            erc721.address,
            ONE_PERCENT,
            ethers.utils.parseEther('1'),
            [1],
            ethers.utils.parseEther('1'),
            MaxUint256,
          ),
      ).to.be.revertedWithCustomError(manager, 'SPM_INSUFFICIENT_MINIMUM_LIQUIDITY_AMOUNT');
    });

    it('it should withdraw from SpeedBump to be reverted when sender is not owner', async () => {
      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(3);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('100'));
      expect(await erc721.balanceOf(bob.address)).to.be.equal(5);

      await expect(speedBump.connect(bob).batchWithdrawNFTs(erc721.address, [1])).to.be.reverted;
      await expect(speedBump.connect(bob).withdrawToken(erc20.address)).to.be.reverted;

      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(3);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('100'));
      expect(await erc721.balanceOf(bob.address)).to.be.equal(5);
    });

    it('it should withdraw assets from SpeedBump when sender is owner', async () => {
      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(3);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('7'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);

      await expect(await speedBump.connect(alice).batchWithdrawNFTs(erc721.address, [1, 2, 3]))
        .to.emit(speedBump, 'WithdrawNFTs')
        .withArgs(alice.address, erc721.address, [1, 2, 3]);

      await expect(speedBump.connect(alice).withdrawToken(erc20.address))
        .to.emit(speedBump, 'WithdrawToken')
        .withArgs(alice.address, erc20.address, ethers.utils.parseEther('3'));

      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('0'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(0);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('10'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(5);
    });

    it('it should revert for invalid token ID', async () => {
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

      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        pair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );

      // use a non-existed tokenID
      await expect(
        manager
          .connect(alice)
          .removeLiquidity(
            erc20.address,
            erc721.address,
            ONE_PERCENT,
            ethers.utils.parseEther('1'),
            { cTokenOutMin, cNftOutMin, nftIds: [1] },
            5,
            alice.address,
            MaxUint256,
          ),
      ).to.revertedWith('ERC3525: invalid token ID');

      // use a existed tokenID, but belong to other users' or pool's
      await expect(
        manager
          .connect(alice)
          .removeLiquidity(
            erc20.address,
            erc721.address,
            ONE_PERCENT,
            ethers.utils.parseEther('1'),
            { cTokenOutMin, cNftOutMin, nftIds: [1] },
            1,
            alice.address,
            MaxUint256,
          ),
      ).to.revertedWithCustomError(manager, 'SPM_INVALID_TOKEN_ID');
    });
  });

  describe('When Remove Liquidity With ETH', () => {
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

    it('it should remove liquidity with ETH failure if deadline is passed', async () => {
      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        pair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );
      await expect(
        manager.connect(alice).removeLiquidityETH(
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('1'),
          { cTokenOutMin, cNftOutMin, nftIds: [2] },
          2,
          alice.address,
          0, // make deadline less than current block timestamp
        ),
      ).to.be.revertedWithCustomError(manager, 'SPM_EXPIRED');
    });

    it('it should remove liquidity from Pool to SpeedBump', async () => {
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

      // exceed the available liquidity.
      const { cTokenOutMin: cTokenOutMin1, cNftOutMin: cNftOutMin1 } = await getWithdrawAssetsOutMin(
        pair.address,
        ethers.utils.parseEther('100'),
        0,
        100,
        alice,
      );
      await expect(
        manager.connect(alice).removeLiquidityETH(
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('100'), // 100 liquidity
          { cTokenOutMin: cTokenOutMin1, cNftOutMin: cNftOutMin1, nftIds: [2] },
          2,
          alice.address,
          MaxUint256,
        ),
      ).to.be.revertedWith('ERC3525: insufficient balance for transfer');

      // available liquidity.
      const { cTokenOutMin: cTokenOutMin2, cNftOutMin: cNftOutMin2 } = await getWithdrawAssetsOutMin(
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
            { cTokenOutMin: cTokenOutMin2, cNftOutMin: cNftOutMin2, nftIds: [2] },
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

    it('it should withdraw from SpeedBump to be reverted when sender is not owner', async () => {
      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc721.balanceOf(bob.address)).to.be.equal(10);

      await expect(speedBump.connect(bob).batchWithdrawNFTs(erc721.address, [2])).to.be.reverted;
      await expect(speedBump.connect(bob).withdrawETH()).to.be.reverted;

      expect(await ethers.provider.getBalance(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc721.balanceOf(bob.address)).to.be.equal(10);
    });

    it('it should withdraw assets from SpeedBump when sender is owner', async () => {
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

    it('it should revert for invalid token ID', async () => {
      const { cTokenOutMin, cNftOutMin } = await getWithdrawAssetsOutMin(
        pair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );

      // use a non-existed tokenID
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
      ).to.revertedWith('ERC3525: invalid token ID');

      // use a existed tokenID, but belong to other users' or pool's
      await expect(
        manager
          .connect(alice)
          .removeLiquidityETH(
            erc721.address,
            ONE_PERCENT,
            ethers.utils.parseEther('1'),
            { cTokenOutMin, cNftOutMin, nftIds: [2] },
            1,
            alice.address,
            MaxUint256,
          ),
      ).to.revertedWithCustomError(manager, 'SPM_INVALID_TOKEN_ID');
    });
  });

  describe('When Burn NFT / Burn Value', () => {
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
      const pairAddress = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
    });

    it('it should not burn liquidity when liquidity > 0 in the NFT', async () => {
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('3'));
      await expect(manager.connect(alice).burn(2)).to.revertedWithCustomError(
        manager,
        'SPM_ONLY_BURNABLE_WHEN_CLEARED',
      );
    });

    it('it should not burn liquidity NFT when msg sender is not owner', async () => {
      await expect(manager.connect(bob).burn(2)).to.revertedWithCustomError(manager, 'SPM_UNAUTHORIZED');
    });

    it('it should not burn liquidity value when msg sender is not pair', async () => {
      await expect(manager.connect(bob).burnValue(2, ethers.utils.parseEther('1'))).to.revertedWithCustomError(
        manager,
        'SPM_ONLY_PAIR_CAN_BURN',
      );
    });

    it('it should burn liquidity when liquidity = 0 in the NFT', async () => {
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('3'));
      expect(await manager.totalSupply()).to.be.eq(TWO);
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

      // check this tokenId is erased
      await expect(manager['balanceOf(uint256)'](2)).to.be.revertedWith('ERC3525: invalid token ID');

      // total supply reduces as expected, from TWO => ONE
      expect(await manager.totalSupply()).to.be.eq(ONE);
    });
  });

  describe('When Set Fee / RoyaltyFee Manager', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    beforeEach(async () => {
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
      await manager.createPair(erc20.address, erc721.address, ONE_PERCENT);
    });

    it('it should set fee manager to be reverted when caller is not owner', async () => {
      await expect(manager.connect(alice).setFeeManager(alice.address)).to.be.revertedWithCustomError(
        manager,
        'FM_NON_FEE_MANAGER',
      );
    });

    it('it should set fee manager when caller is owner', async () => {
      expect(await manager.feeManager()).to.be.eql(owner.address);
      expect(await manager.connect(owner).setFeeManager(alice.address));
      expect(await manager.feeManager()).to.be.eql(alice.address);

      // restricted to the old manager.
      await expect(manager.connect(owner).setFeeManager(bob.address)).to.be.revertedWithCustomError(
        manager,
        'FM_NON_FEE_MANAGER',
      );

      // available to new manager.
      expect(await manager.connect(alice).setFeeManager(owner.address));
      expect(await manager.feeManager()).to.be.eql(owner.address);
    });

    it('it should set royalty fee manager to be reverted when caller is not owner', async () => {
      await expect(manager.connect(alice).setRoyaltyFeeManager(alice.address)).to.be.revertedWithCustomError(
        manager,
        'FM_NON_ROYALTY_FEE_MANAGER',
      );
    });

    it('it should set royalty fee manager when caller is owner', async () => {
      expect(await manager.royaltyFeeManager()).to.be.eql(owner.address);
      expect(await manager.connect(owner).setRoyaltyFeeManager(alice.address));
      expect(await manager.royaltyFeeManager()).to.be.eql(alice.address);

      // restricted to the old manager.
      await expect(manager.connect(owner).setRoyaltyFeeManager(bob.address)).to.be.revertedWithCustomError(
        manager,
        'FM_NON_ROYALTY_FEE_MANAGER',
      );

      // available to new manager.
      expect(await manager.connect(alice).setRoyaltyFeeManager(owner.address));
      expect(await manager.royaltyFeeManager()).to.be.eql(owner.address);
    });
  });
});
