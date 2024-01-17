import { MaxUint256, Zero } from '@ethersproject/constants';
import SeacowsERC721TradePairAbi from '@yolominds/seacows-amm/abis/ISeacowsERC721TradePair.json';
import SeacowsERC721TradePairArtifact from '@yolominds/seacows-amm/artifacts/contracts/SeacowsERC721TradePair.sol/SeacowsERC721TradePair.json';
import SeacowsPositionManagerArtifact from '@yolominds/seacows-amm/artifacts/contracts/SeacowsPositionManager.sol/SeacowsPositionManager.json';
import SpeedBumpArtifact from '@yolominds/seacows-amm/artifacts/contracts/base/SpeedBump.sol/SpeedBump.json';
import NFTRendererArtifact from '@yolominds/seacows-amm/artifacts/contracts/lib/NFTRenderer.sol/NFTRenderer.json';
import PricingKernelArtifact from '@yolominds/seacows-amm/artifacts/contracts/lib/PricingKernel.sol/PricingKernel.json';
import FixidityLibArtifact from '@yolominds/seacows-amm/artifacts/contracts/lib/FixidityLib.sol/FixidityLib.json';
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getSwapTokenInMax, getSwapTokenOutMin } from '@yolominds/seacows-sdk';
import { expect } from 'chai';
import { deployContract } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import {
  type SeacowsERC721TradePair,
  type SeacowsPositionManager,
  type NFTRenderer,
  type SpeedBump,
} from '@yolominds/seacows-sdk/types/amm';
import { type WETH, type MockERC20, type MockERC721, type SeacowsRouter, type MockRoyaltyRegistry } from 'types';
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

    const FixidityLibFC = await ethers.getContractFactoryFromArtifact(FixidityLibArtifact);
    const fixidityLib = await FixidityLibFC.deploy();

    const PricingKernelLibraryFC = await ethers.getContractFactoryFromArtifact(PricingKernelArtifact, {
      libraries: {
        FixidityLib: fixidityLib.address,
      },
    });
    const pricingKernelLib = await PricingKernelLibraryFC.deploy();
    const SeacowsERC721TradePairFC = await ethers.getContractFactoryFromArtifact(SeacowsERC721TradePairArtifact, {
      libraries: {
        PricingKernel: pricingKernelLib.address,
      },
    });
    template = (await SeacowsERC721TradePairFC.deploy()) as SeacowsERC721TradePair;
    ONE_PERCENT = await template.ONE_PERCENT();

    expect(await alice.getBalance()).to.be.equal(ethers.utils.parseEther('10000'));
    expect(await bob.getBalance()).to.be.equal(ethers.utils.parseEther('10000'));
  });

  describe('Swap ETHs For Exact NFTs success, and keep K no change approximatly', () => {
    let manager: SeacowsPositionManager;
    let router: SeacowsRouter;
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;

    let speedBump: SpeedBump;
    let registry: MockRoyaltyRegistry;
    let minRoyaltyFeePercent: BigNumber;

    let reserve0: BigNumber;
    let reserve1: BigNumber;

    before(async () => {
      // Prepare Royalty Registry
      const MockRoyaltyRegistryFC = await ethers.getContractFactory('MockRoyaltyRegistry');
      registry = await MockRoyaltyRegistryFC.deploy(ethers.constants.AddressZero);

      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();

      const SpeedBumpFC = await ethers.getContractFactoryFromArtifact(SpeedBumpArtifact);
      speedBump = await SpeedBumpFC.deploy();
      const SeacowsPositionManagerFactory = await ethers.getContractFactoryFromArtifact(
        SeacowsPositionManagerArtifact,
        {
          libraries: {
            NFTRenderer: rendererLib.address,
          },
        },
      );
      manager = (await SeacowsPositionManagerFactory.deploy(
        template.address,
        weth.address,
        speedBump.address,
      )) as SeacowsPositionManager;
      await manager.deployed();
      await manager.setFeeTo(ethers.constants.AddressZero);
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);

      // Deploy Router
      const SeacowsRouterFC = await ethers.getContractFactory('SeacowsRouter');
      router = await SeacowsRouterFC.deploy(manager.address, weth.address);

      /**
       * @notes Prepare assets for Alice
       * ERC721: [0, 1, 2, 3, 4]
       */
      for (let i = 0; i < 10; i++) {
        await erc721.mint(alice.address);
      }

      /**
       * @notes Mint Position NFTs
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Alice: 2
       */
      await erc721.connect(alice).setApprovalForAll(manager.address, true);
      await manager
        .connect(alice)
        .mintWithETH(erc721.address, ONE_PERCENT, [1, 2, 3], ethers.utils.parseEther('3'), MaxUint256, {
          value: ethers.utils.parseEther('3'),
        });
      pair = (await ethers.getContractAt(
        SeacowsERC721TradePairAbi,
        await manager.getPair(weth.address, erc721.address, ONE_PERCENT),
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

    it('should set K constant correctly', async () => {
      const [_reserve0, _reserve1] = await pair.getReserves();
      reserve0 = _reserve0;
      reserve1 = _reserve1;
      expect(reserve0).to.be.equal(ethers.utils.parseEther('3'));
      expect(reserve1).to.be.equal(ethers.utils.parseEther('3'));
    });

    it('swapETHForExactNFTs', async () => {
      // Caculate how much need to be paid
      const { tokenInMaxWithSlippage } = await getSwapTokenInMax(
        pair.address,
        [1],
        minRoyaltyFeePercent,
        1,
        100,
        owner,
      );

      expect(await weth.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('3'));
      expect((await pair.getComplementedBalance())[0]).to.be.equal(ethers.utils.parseEther('3'));
      expect(tokenInMaxWithSlippage).to.be.equal(ethers.utils.parseEther('1.545754500000000001'));

      await router
        .connect(bob)
        .swapETHForExactNFTs(pair.address, [1], tokenInMaxWithSlippage, minRoyaltyFeePercent, bob.address, MaxUint256, {
          value: tokenInMaxWithSlippage,
        });

      expect(await weth.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('4.530450000000000001'));
      expect((await pair.getComplementedBalance())[0]).to.be.equal(ethers.utils.parseEther('4.515450000000000001'));
      expect(await erc721.ownerOf(1)).to.be.equal(bob.address);
    });

    it('batchSwapETHForExactNFTs', async () => {
      // Caculate how much need to be paid
      const { tokenInMaxWithSlippage } = await getSwapTokenInMax(
        pair.address,
        [2],
        minRoyaltyFeePercent,
        1,
        100,
        owner,
      );

      await router
        .connect(bob)
        .batchSwapETHForExactNFTs(
          [pair.address],
          [[2]],
          [tokenInMaxWithSlippage],
          minRoyaltyFeePercent,
          bob.address,
          MaxUint256,
          {
            value: tokenInMaxWithSlippage,
          },
        );

      expect(await weth.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('9.137563635000000003'));
      expect((await pair.getComplementedBalance())[0]).to.be.equal(ethers.utils.parseEther('9.077409135000000003'));
      expect(await erc721.ownerOf(2)).to.be.equal(bob.address);
    });

    it('should keep K no change approximatly after swap', async () => {
      const [newReserve0, newReserve1] = await pair.getReserves();
      expect(newReserve0).to.be.equal(ethers.utils.parseEther('9.077409135000000003'));
      expect(newReserve1).to.be.equal(ethers.utils.parseEther('1'));
      expect(newReserve0.mul(newReserve1)).to.be.greaterThanOrEqual(reserve0.mul(reserve1)); // 9.077409135000000003 * 1 = 3 * 3
    });
  });

  describe('Swap Tokens For Exact NFTs success, and keep K no change approximatly', () => {
    let manager: SeacowsPositionManager;
    let router: SeacowsRouter;
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;

    let speedBump: SpeedBump;
    let registry: MockRoyaltyRegistry;
    let minRoyaltyFeePercent: BigNumber;

    let reserve0: BigNumber;
    let reserve1: BigNumber;

    before(async () => {
      // Prepare Royalty Registry
      const MockRoyaltyRegistryFC = await ethers.getContractFactory('MockRoyaltyRegistry');
      registry = await MockRoyaltyRegistryFC.deploy(ethers.constants.AddressZero);

      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();

      const SpeedBumpFC = await ethers.getContractFactoryFromArtifact(SpeedBumpArtifact);
      speedBump = await SpeedBumpFC.deploy();
      const SeacowsPositionManagerFactory = await ethers.getContractFactoryFromArtifact(
        SeacowsPositionManagerArtifact,
        {
          libraries: {
            NFTRenderer: rendererLib.address,
          },
        },
      );
      manager = (await SeacowsPositionManagerFactory.deploy(
        template.address,
        weth.address,
        speedBump.address,
      )) as SeacowsPositionManager;
      await manager.deployed();
      await manager.setFeeTo(ethers.constants.AddressZero);
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);

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

    it('should set K constant correctly', async () => {
      const [_reserve0, _reserve1] = await pair.getReserves();
      reserve0 = _reserve0;
      reserve1 = _reserve1;
      expect(reserve0).to.be.equal(ethers.utils.parseEther('3'));
      expect(reserve1).to.be.equal(ethers.utils.parseEther('3'));
    });

    it('swapTokensForExactNFTs', async () => {
      // Caculate how much need to be paid
      const { tokenInMaxWithSlippage } = await getSwapTokenInMax(
        pair.address,
        [1],
        minRoyaltyFeePercent,
        1,
        100,
        owner,
      );

      expect(tokenInMaxWithSlippage).to.be.equal(ethers.utils.parseEther('1.545754500000000001'));

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

      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('4.530450000000000001'));
      const [tokenBalance] = await pair.getComplementedBalance();
      expect(tokenBalance).to.be.equal(ethers.utils.parseEther('4.515450000000000001'));

      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('8.4695499999999999990'));
      expect(await erc721.ownerOf(1)).to.be.equal(bob.address);
    });

    it('batchSwapTokensForExactNFTs', async () => {
      // Caculate how much need to be paid
      const { tokenInMaxWithSlippage } = await getSwapTokenInMax(
        pair.address,
        [2],
        minRoyaltyFeePercent,
        1,
        100,
        owner,
      );
      // Approve token cost
      await erc20.connect(bob).approve(router.address, tokenInMaxWithSlippage);
      await router
        .connect(bob)
        .batchSwapTokensForExactNFTs(
          [pair.address],
          [[2]],
          [tokenInMaxWithSlippage],
          minRoyaltyFeePercent,
          bob.address,
          MaxUint256,
        );

      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('9.137563635000000003'));
      const [tokenBalance] = await pair.getComplementedBalance();
      expect(tokenBalance).to.be.equal(ethers.utils.parseEther('9.077409135000000003'));

      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('3.862436364999999997'));
      expect(await erc721.ownerOf(2)).to.be.equal(bob.address);
    });

    it('should keep K no change approximatly after swap', async () => {
      const [newReserve0, newReserve1] = await pair.getReserves();
      expect(newReserve0).to.be.equal(ethers.utils.parseEther('9.077409135000000003'));
      expect(newReserve1).to.be.equal(ethers.utils.parseEther('1'));
      expect(newReserve0.mul(newReserve1)).to.be.greaterThanOrEqual(reserve0.mul(reserve1)); // 9.077409135000000003 * 1 = 3 * 3
    });
  });

  describe('Swap Exact NFTs For ETHs success, and keep K no change approximatly', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;
    let manager: SeacowsPositionManager;
    let router: SeacowsRouter;
    let speedBump: SpeedBump;

    let registry: MockRoyaltyRegistry;
    let minRoyaltyFeePercent: BigNumber;

    let reserve0: BigNumber;
    let reserve1: BigNumber;

    before(async () => {
      // Prepare Royalty Registry
      const MockRoyaltyRegistryFC = await ethers.getContractFactory('MockRoyaltyRegistry');
      registry = await MockRoyaltyRegistryFC.deploy(ethers.constants.AddressZero);

      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();

      const SpeedBumpFC = await ethers.getContractFactoryFromArtifact(SpeedBumpArtifact);
      speedBump = await SpeedBumpFC.deploy();
      const SeacowsPositionManagerFactory = await ethers.getContractFactoryFromArtifact(
        SeacowsPositionManagerArtifact,
        {
          libraries: {
            NFTRenderer: rendererLib.address,
          },
        },
      );
      manager = (await SeacowsPositionManagerFactory.deploy(
        template.address,
        weth.address,
        speedBump.address,
      )) as SeacowsPositionManager;
      await manager.deployed();
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);
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

      /**
       * @notes Mint Position NFTs
       * Input ETH: 3 Ethers
       * Input ERC721: [1, 2, 3]
       *
       * Position NFT ID of Pair: 1
       * Position NFT ID of Alice: 2
       */
      await erc721.connect(alice).setApprovalForAll(manager.address, true);
      await manager
        .connect(alice)
        .mintWithETH(erc721.address, ONE_PERCENT, [1, 2, 3], ethers.utils.parseEther('3'), MaxUint256, {
          value: ethers.utils.parseEther('3'),
        });
      pair = (await ethers.getContractAt(
        SeacowsERC721TradePairAbi,
        await manager.getPair(weth.address, erc721.address, ONE_PERCENT),
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

    it('should set K constant correctly', async () => {
      const [_reserve0, _reserve1] = await pair.getReserves();
      reserve0 = _reserve0;
      reserve1 = _reserve1;
      expect(reserve0).to.be.equal(ethers.utils.parseEther('3'));
      expect(reserve1).to.be.equal(ethers.utils.parseEther('3'));
    });

    it('swapExactNFTsForETH', async () => {
      // Alice balances before
      const prevPairBalance = await weth.balanceOf(pair.address);
      expect(await erc721.ownerOf(4)).to.be.equal(alice.address);
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
      await router
        .connect(alice)
        .swapExactNFTsForETH(pair.address, [4], 0, minRoyaltyFeePercent, alice.address, MaxUint256);

      expect(await weth.balanceOf(pair.address)).to.be.equal(prevPairBalance.sub(tokenOutWithFee));
      expect(await erc721.ownerOf(4)).to.be.equal(pair.address);
    });

    it('batchSwapExactNFTsForETH', async () => {
      // Alice balances before
      const prevPairBalance = await weth.balanceOf(pair.address);

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
        .batchSwapExactNFTsForETH([pair.address], [[5]], [0], [minRoyaltyFeePercent], alice.address, MaxUint256);

      expect(await weth.balanceOf(pair.address)).to.be.equal(prevPairBalance.sub(tokenOutWithFee));
      expect(await erc721.ownerOf(5)).to.be.equal(pair.address);
    });

    it('should keep K no change approximatly after swap', async () => {
      const [newReserve0, newReserve1] = await pair.getReserves();
      expect(newReserve0).to.be.equal(ethers.utils.parseEther('1.810515000000000000'));
      expect(newReserve1).to.be.equal(ethers.utils.parseEther('5'));
      expect(newReserve0.mul(newReserve1)).to.be.greaterThanOrEqual(reserve0.mul(reserve1)); // 1.810515000000000000 * 5 = 3 * 3
    });
  });

  describe('Swap Exact NFTs For Tokens success, and keep K no change approximatly', () => {
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;
    let manager: SeacowsPositionManager;
    let router: SeacowsRouter;
    let speedBump: SpeedBump;

    let registry: MockRoyaltyRegistry;
    let minRoyaltyFeePercent: BigNumber;

    let reserve0: BigNumber;
    let reserve1: BigNumber;

    before(async () => {
      // Prepare Royalty Registry
      const MockRoyaltyRegistryFC = await ethers.getContractFactory('MockRoyaltyRegistry');
      registry = await MockRoyaltyRegistryFC.deploy(ethers.constants.AddressZero);

      const erc721FC = await ethers.getContractFactory('MockERC721');
      const erc20FC = await ethers.getContractFactory('MockERC20');
      erc721 = await erc721FC.deploy();
      erc20 = await erc20FC.deploy();

      const SpeedBumpFC = await ethers.getContractFactoryFromArtifact(SpeedBumpArtifact);
      speedBump = await SpeedBumpFC.deploy();
      const SeacowsPositionManagerFactory = await ethers.getContractFactoryFromArtifact(
        SeacowsPositionManagerArtifact,
        {
          libraries: {
            NFTRenderer: rendererLib.address,
          },
        },
      );
      manager = (await SeacowsPositionManagerFactory.deploy(
        template.address,
        weth.address,
        speedBump.address,
      )) as SeacowsPositionManager;
      await manager.deployed();
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);
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

    it('should set K constant correctly', async () => {
      const [_reserve0, _reserve1] = await pair.getReserves();
      reserve0 = _reserve0;
      reserve1 = _reserve1;
      expect(reserve0).to.be.equal(ethers.utils.parseEther('3'));
      expect(reserve1).to.be.equal(ethers.utils.parseEther('3'));
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

    it('should keep K no change approximatly after swap', async () => {
      const [newReserve0, newReserve1] = await pair.getReserves();
      expect(newReserve0).to.be.equal(ethers.utils.parseEther('1.810515000000000000'));
      expect(newReserve1).to.be.equal(ethers.utils.parseEther('5'));
      expect(newReserve0.mul(newReserve1)).to.be.greaterThanOrEqual(reserve0.mul(reserve1)); // 1.810515000000000000 * 5 = 3 * 3
    });
  });

  describe('Swap Tokens For Exact NFTs failure when pool has only one nft left', () => {
    let manager: SeacowsPositionManager;
    let router: SeacowsRouter;
    let erc721: MockERC721;
    let erc20: MockERC20;
    let pair: SeacowsERC721TradePair;
    let speedBump: SpeedBump;
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

      const SpeedBumpFC = await ethers.getContractFactoryFromArtifact(SpeedBumpArtifact);
      speedBump = await SpeedBumpFC.deploy();
      const SeacowsPositionManagerFactory = await ethers.getContractFactoryFromArtifact(
        SeacowsPositionManagerArtifact,
        {
          libraries: {
            NFTRenderer: rendererLib.address,
          },
        },
      );
      manager = (await SeacowsPositionManagerFactory.deploy(
        template.address,
        weth.address,
        speedBump.address,
      )) as SeacowsPositionManager;
      await manager.deployed();
      await manager.setFeeTo(ethers.constants.AddressZero);
      await manager.setRoyaltyRegistry(registry.address);
      await speedBump.initialize(manager.address);

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
      // Caculate how much need to be paid
      const { tokenInMaxWithSlippage } = await getSwapTokenInMax(
        pair.address,
        [1, 2],
        minRoyaltyFeePercent,
        1,
        100,
        owner,
      );

      expect(tokenInMaxWithSlippage).to.be.equal(ethers.utils.parseEther('6.183018000000000001'));

      // Approve token cost
      await erc20.connect(bob).approve(router.address, tokenInMaxWithSlippage);
      await router
        .connect(bob)
        .swapTokensForExactNFTs(
          pair.address,
          [1, 2],
          tokenInMaxWithSlippage,
          minRoyaltyFeePercent,
          bob.address,
          MaxUint256,
        );

      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('9.121800000000000001'));
      const [tokenBalance] = await pair.getComplementedBalance();
      expect(tokenBalance).to.be.equal(ethers.utils.parseEther('9.061800000000000001'));

      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('3.878199999999999999'));
      expect(await erc721.ownerOf(1)).to.be.equal(bob.address);
      expect(await erc721.ownerOf(2)).to.be.equal(bob.address);

      // now pool has only one nft id = 3
      expect(await erc721.ownerOf(3)).to.be.equal(pair.address);
      const [newReserve0, newReserve1] = await pair.getReserves();
      expect(newReserve0).to.be.equal(ethers.utils.parseEther('9.061800000000000001'));
      expect(newReserve1).to.be.equal(ethers.utils.parseEther('1'));

      // bob can not swap left 1 nft out
      await expect(
        router
          .connect(bob)
          .swapTokensForExactNFTs(
            pair.address,
            [3],
            ethers.utils.parseEther('5'),
            minRoyaltyFeePercent,
            bob.address,
            MaxUint256,
          ),
      ).to.be.reverted;
    });
  });
});
