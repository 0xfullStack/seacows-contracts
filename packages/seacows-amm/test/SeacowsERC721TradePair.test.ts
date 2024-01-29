import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BI_ZERO, getSwapTokenInMax, getSwapTokenOutMin } from '@yolominds/seacows-sdk';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';
import { ethers } from 'hardhat';
import {
  type SeacowsERC721TradePair,
  type SeacowsPositionManager,
  type WETH,
  type MockERC721,
  type MockERC20,
  type MockSeacowsPairSwap,
  type MockRoyaltyRegistry,
  type SpeedBump,
} from 'types';
import { ONE_PERCENT, COMPLEMENT_PRECISION, POINT_FIVE_PERCENT } from './constants';
import { ZERO, sqrt } from './utils';

describe('SeacowsERC721TradePair', () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let jack: SignerWithAddress;
  let mike: SignerWithAddress;
  let feeTo: SignerWithAddress;
  let feeToa: SignerWithAddress;

  let weth: WETH;
  let erc721: MockERC721;
  let erc721a: MockERC721;
  let erc721b: MockERC721;
  let erc721c: MockERC721;
  let erc20: MockERC20;
  let erc20a: MockERC20;
  let erc20b: MockERC20;

  let speedBump: SpeedBump;
  let template: SeacowsERC721TradePair;
  let manager: SeacowsPositionManager;
  let pair: SeacowsERC721TradePair;
  let minRoyaltyFeePercent: BigNumber;
  let registry: MockRoyaltyRegistry;

  before(async () => {
    [owner, alice, bob, carol, jack, mike, feeTo, feeToa] = await ethers.getSigners();

    const WETHFC = await ethers.getContractFactory('WETH');
    const MockERC721FC = await ethers.getContractFactory('MockERC721');
    const MockERC20FC = await ethers.getContractFactory('MockERC20');
    const SpeedBumpFC = await ethers.getContractFactory('SpeedBump');
    weth = await WETHFC.deploy();
    erc721 = await MockERC721FC.deploy();
    erc721a = await MockERC721FC.deploy();
    erc721b = await MockERC721FC.deploy();
    erc721c = await MockERC721FC.deploy();
    erc20 = await MockERC20FC.deploy();
    erc20a = await MockERC20FC.deploy();
    erc20b = await MockERC20FC.deploy();

    const nftFactoryLibraryFactory = await ethers.getContractFactory('NFTRenderer');
    const rendererLib = await nftFactoryLibraryFactory.deploy();

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
    const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
      libraries: {
        NFTRenderer: rendererLib.address,
      },
    });

    template = await SeacowsERC721TradePairFC.deploy();
    speedBump = await SpeedBumpFC.deploy();
    manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address, speedBump.address);
    await speedBump.initialize(manager.address);
  });

  describe('Before Each', () => {
    before(async () => {
      // Create a pair
      await manager.createPair(erc20.address, erc721.address, ONE_PERCENT);
      await manager.setFeeTo(feeTo.address);

      const address = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      pair = await ethers.getContractAt('SeacowsERC721TradePair', address);
      await pair.setProtocolFeePercent(await pair.MAX_PROTOCOL_FEE_PERCENT());
    });

    it('it should not support payable to receive Ethers', async () => {
      expect(await ethers.provider.getBalance(pair.address)).to.be.equal(ZERO);
      await expect(alice.sendTransaction({ to: pair.address, value: ethers.utils.parseEther('12.0') })).to.be.reverted;
      expect(await ethers.provider.getBalance(pair.address)).to.be.equal(ZERO);
    });

    it('it should have 0 balance initially', async () => {
      const [tokenReserve, nftReserve] = await pair.getReserves();
      expect(tokenReserve).to.be.equal(0);
      expect(nftReserve).to.be.equal(0);
    });
  });

  describe('When Mint', () => {
    before(async () => {
      /**
       * @notes Prepare assets for Alice
       * ERC721: [0, 1, 2, 3, 4]
       * ERC20: 10 Ethers
       */
      for (let i = 0; i < 5; i++) {
        await erc721.mint(alice.address);
      }
      await erc20.mint(alice.address, ethers.utils.parseEther('10'));
    });

    it('it should mint 2 Position NFTs the Pair and 1 for Alice using SeacowsPositionManager', async () => {
      // await pair.mint(erc20.address, erc721.address, ONE_PERCENT);
      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('2'));
      await erc721.connect(alice).setApprovalForAll(manager.address, true);
      await manager
        .connect(alice)
        .mint(erc20.address, erc721.address, ONE_PERCENT, ethers.utils.parseEther('2'), [1, 2], 0, MaxUint256);
      /**
       * @notes
       * At this point, 3 position NFTs are minted
       * Pair Position NFT ID = 1, 0 liquidity
       * Alice Position NFT ID = 2,
       */
      expect(await manager.ownerOf(1)).to.be.equal(pair.address);
      expect(await manager.ownerOf(2)).to.be.equal(alice.address);

      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(
        sqrt(ethers.utils.parseEther('2').mul(BigNumber.from(2).mul(COMPLEMENT_PRECISION))),
      );
    });

    it('it should mint liqidity correctly even not using SeacowsPositionManager', async () => {
      const aliceLiquidityBefore = await manager['balanceOf(uint256)'](2);
      /**
       * @notes transfer assets from Alice to Pair
       * ERC20: 2 Ethers
       * ERC721: [3,4]
       */
      await erc20.connect(alice).transfer(pair.address, ethers.utils.parseEther('2'));
      await erc721.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, pair.address, 3);
      await erc721.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, pair.address, 4);
      expect(await erc721.balanceOf(pair.address)).to.be.equal(4);
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('4'));

      const totalSupply = await pair.totalSupply();
      const [reserve0, reserve1] = await pair.getReserves();
      const [balance0, balance1] = await pair.getBalances();
      const liquidity1 = balance0.sub(reserve0).mul(totalSupply).div(reserve0);
      const liquidity2 = balance1.sub(reserve1).mul(totalSupply).div(reserve1);
      const expectedLiquidityToMint = liquidity1.lte(liquidity2) ? liquidity1 : liquidity2;

      // Mint liquidity based on balance
      await expect(pair.connect(alice).mint(2))
        .to.be.emit(pair, 'Mint')
        .withArgs(alice.address, ethers.utils.parseEther('2'), ethers.utils.parseEther('2'));
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(aliceLiquidityBefore.add(expectedLiquidityToMint));
    });

    it('it should have the correct final state', async () => {
      /**
       * @notes Summary of Alice at this stage
       * ERC721: [4]
       * ERC20: 6 Ethers
       * Pair NFT: [3]
       */
      expect(await erc721.balanceOf(alice.address)).to.be.equal(1);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('6'));
      expect(await manager.ownerOf(2)).to.be.equal(alice.address);

      /**
       * @notes Summary of Pair at this stage
       * ERC721: [0, 1, 2, 3]
       * ERC20: 4 Ethers
       * Pair NFT: [1, 2]
       */
      expect(await erc721.balanceOf(pair.address)).to.be.equal(4);
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('4'));
      expect(await manager.ownerOf(1)).to.be.equal(pair.address);
    });
  });

  describe('When Burn', () => {
    before(async () => {
      for (let i = 0; i < 2; i++) {
        await erc721c.mint(bob.address);
      }
      await erc20a.mint(bob.address, ethers.utils.parseEther('10'));
      await erc20a.connect(bob).approve(manager.address, ethers.utils.parseEther('20'));
      await erc721c.connect(bob).setApprovalForAll(manager.address, true);

      for (let i = 0; i < 2; i++) {
        await erc721.mint(bob.address);
      }
      await erc20.mint(bob.address, ethers.utils.parseEther('10'));

      await erc20.connect(bob).approve(manager.address, ethers.utils.parseEther('2'));
      await erc721.connect(bob).setApprovalForAll(manager.address, true);
      await manager
        .connect(bob)
        .mint(erc20.address, erc721.address, ONE_PERCENT, ethers.utils.parseEther('1'), [5], 0, MaxUint256);
    });

    it('it should have correct initial state for Bob', async () => {
      expect(await erc721.ownerOf(5)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(6)).to.be.equal(bob.address);
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('5'));
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('9'));
    });

    it('it should burn liqidity failure when user hold zero liquidity', async () => {
      expect(await erc721.ownerOf(2)).to.be.equal(pair.address);

      await expect(pair.connect(jack).burn(jack.address, jack.address, [2])).to.be.revertedWithCustomError(
        pair,
        'STP_INSUFFICIENT_LIQUIDITY_BURNED',
      );

      // Owner of ERC721 ID = 2 is also pair now
      expect(await erc721.ownerOf(2)).to.be.equal(pair.address);
    });

    it('it should burn liqidity failure when using pair do not hold nft id', async () => {
      // Owner of ERC721 ID = 6 is not Pair
      expect(await erc721.ownerOf(6)).to.be.not.eq(pair.address);
      const bobLiquidity = await manager['balanceOf(uint256)'](3);
      const pairTokenId = await manager.tokenOf(pair.address);
      await manager.connect(bob)['transferFrom(uint256,uint256,uint256)'](3, pairTokenId, bobLiquidity);

      // Bob burn the liquidity and want to get back ERC721 with ID = [6]
      await expect(pair.connect(bob).burn(bob.address, bob.address, [6])).to.be.revertedWithCustomError(
        pair,
        'STP_INSUFFICIENT_NFT_TO_WITHDRAW',
      );
    });

    it('it should burn liqidity correctly even not using SeacowsPositionManager', async () => {
      // Owner of ERC721 ID = 1 is the Pair
      expect(await erc721.ownerOf(1)).to.be.equal(pair.address);
      const bobLiquidity = await manager['balanceOf(uint256)'](3);
      const pairTokenId = await manager.tokenOf(pair.address);
      await manager.connect(bob)['transferFrom(uint256,uint256,uint256)'](3, pairTokenId, bobLiquidity);

      // Bob burn the liquidity and want to get back ERC721 with ID = [1]
      await expect(pair.connect(bob).burn(bob.address, bob.address, [1]))
        .to.be.emit(pair, 'Burn')
        .withArgs(
          bob.address,
          ethers.utils.parseEther('1'),
          ethers.utils.parseEther('1'),
          ethers.utils.parseEther('1'),
          [1],
          bob.address,
        );

      // Owner of ERC721 ID = 1 is Bob now
      expect(await erc721.ownerOf(1)).to.be.equal(bob.address);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('10'));
    });

    it('it should burn liqidity failure when pool has zero liquidity', async () => {
      // Create a pair
      await manager.createPair(erc20a.address, erc721c.address, ONE_PERCENT);

      const address = await manager.getPair(erc20a.address, erc721c.address, ONE_PERCENT);
      const pair: SeacowsERC721TradePair = await ethers.getContractAt('SeacowsERC721TradePair', address);

      const [reserve0, reserve1] = await pair.getReserves();
      const pairTokenId = await manager.tokenOf(pair.address);

      // 1. zero liquidity when first created
      expect(pairTokenId).is.to.eq('4'); // new created pair
      expect(reserve0).is.to.eq(ZERO);
      expect(reserve1).is.to.eq(ZERO);

      //   2. burn failed because of zero liquidity
      await expect(pair.connect(bob).burn(bob.address, bob.address, [1])).to.be.reverted;

      // 3. mint liquidity
      await manager
        .connect(bob)
        .mint(erc20a.address, erc721c.address, ONE_PERCENT, ethers.utils.parseEther('2'), [0, 1], 0, MaxUint256);

      // 4. burn all liquidity
      const bobLiquidity = await manager['balanceOf(uint256)'](3);
      await manager.connect(bob)['transferFrom(uint256,uint256,uint256)'](5, pairTokenId, bobLiquidity);

      // 5. burn failed because of zero liquidity
      await expect(pair.connect(bob).burn(bob.address, bob.address, [1])).to.be.reverted;
    });

    it('it should have the correct final state', async () => {
      /**
       * @notes Summary of Alice at this stage
       * ERC721: [4]
       * ERC20: 6 Ethers
       * Pair NFT: [3]
       */
      expect(await erc721.balanceOf(alice.address)).to.be.equal(1);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('6'));
      expect(await manager.ownerOf(2)).to.be.equal(alice.address);

      /**
       * @notes Summary of Bob at this stage
       * ERC721: [1, 6]
       * ERC20: 10 Ethers
       * Pair NFT: [4]
       */
      expect(await erc721.balanceOf(bob.address)).to.be.equal(2);
      expect(await erc721.ownerOf(1)).to.be.equal(bob.address);
      expect(await erc721.ownerOf(6)).to.be.equal(bob.address);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('10'));
      expect(await manager.ownerOf(3)).to.be.equal(bob.address);

      /**
       * @notes Summary of Pair at this stage
       * ERC721: [1, 2, 3, 5]
       * ERC20: 4 Ethers
       * Pair NFT: [1, 2]
       */
      expect(await erc721.ownerOf(2)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(3)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(5)).to.be.equal(pair.address);
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('4'));
      expect(await manager.ownerOf(1)).to.be.equal(pair.address);
      expect(await manager.ownerOf(2)).to.be.equal(alice.address);
    });
  });

  describe('When Swap', () => {
    let feePercent: BigNumber;
    let protocolFeePercent: BigNumber;
    let precision: BigNumber;
    let pairSwap: MockSeacowsPairSwap;

    before(async () => {
      const MockSeacowsPairSwapFC = await ethers.getContractFactory('MockSeacowsPairSwap');
      pairSwap = await MockSeacowsPairSwapFC.deploy();

      feePercent = await pair.feePercent();
      protocolFeePercent = await pair.protocolFeePercent();
      precision = await pair.PERCENTAGE_PRECISION();
    });

    it('it should have correct initial state', async () => {
      expect(await manager.feeTo()).to.be.equal(feeTo.address);
      expect(await erc20.balanceOf(feeTo.address)).to.be.equal(0);
      expect(protocolFeePercent).to.be.equal(await pair.MAX_PROTOCOL_FEE_PERCENT());
    });

    it('it should swap out ERC20 token successfully, and keep K no change approximately', async () => {
      /**
       * @notes Summary of Alice before swap
       * ERC721: [0]
       * ERC20: 6 Ethers
       * Pair NFT: [3]
       */
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('6'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(1);

      /**
       * @notes Alice's swap
       * Swap in ERC721: [0]
       * Swap out ERC20 (Including fee): 0.792 Ethers
       */
      expect(await erc721.ownerOf(0)).to.be.equal(alice.address);

      const [oldReserve0, oldReserve1] = await pair.getReserves();
      expect(oldReserve0).to.be.equal(ethers.utils.parseEther('4'));
      expect(oldReserve1).to.be.equal(ethers.utils.parseEther('4'));
      const { tokenOutMin } = await getSwapTokenOutMin(pair.address, [0], BI_ZERO, 0, 100, owner);

      // Expected ERC20 output after = 0.784 Ethers
      expect(tokenOutMin).to.be.equal(ethers.utils.parseEther('0.712'));

      /**
       * @notes Summary of Alice after swap
       * ERC721: []
       * ERC20: 6.712 Ethers
       */
      await erc721.connect(alice).setApprovalForAll(pairSwap.address, true);
      await expect(pairSwap.connect(alice).swap(pair.address, tokenOutMin, [], alice.address, 0, [0]))
        .to.be.emit(pair, 'Swap')
        .withArgs(pairSwap.address, 0, ethers.utils.parseEther('1'), ethers.utils.parseEther('0.8'), 0, alice.address);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('6.712'));
      expect(await erc20.balanceOf(feeTo.address)).to.be.equal(ethers.utils.parseEther('0.08'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(0);

      const [newReserve0, newReserve1] = await pair.getReserves();
      expect(newReserve0).to.be.equal(ethers.utils.parseEther('3.2'));
      expect(newReserve1).to.be.equal(ethers.utils.parseEther('5'));
      expect(newReserve0.mul(newReserve1)).to.be.greaterThanOrEqual(oldReserve0.mul(oldReserve1)); // 4 * 4 = 3.2 * 5
    });

    it('it should swap out NFT successfully, and keep K no change approximately', async () => {
      /**
       * @notes Summary of Bob before swap
       * ERC721: [1, 6]
       * ERC20: 10 Ethers
       * Pair ERC721: [0, 2, 3, 4, 5]
       * Pair ERC20: 3.208 Ethers
       */
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('10'));
      expect(await erc721.balanceOf(bob.address)).to.be.equal(2);
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('3.208'));
      expect(await erc721.balanceOf(pair.address)).to.be.equal(5);
      expect(await erc721.ownerOf(0)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(2)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(3)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(4)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(5)).to.be.equal(pair.address);

      /**
       * @notes Bob's swap
       * Swap in ERC20 (including fee): 0.81002 ether
       * Swap out ERC721: [6]
       */

      const [oldReserve0, oldReserve1] = await pair.getReserves();
      expect(oldReserve0).to.be.equal(ethers.utils.parseEther('3.2'));
      expect(oldReserve1).to.be.equal(ethers.utils.parseEther('5'));
      const { tokenInMaxWithSlippage } = await getSwapTokenInMax(pair.address, [4], BI_ZERO, 1, 100, owner);
      expect(tokenInMaxWithSlippage).to.be.equal(ethers.utils.parseEther('0.896880000000000001'));

      /**
       * @notes Summary of Bob after swap
       * ERC721: [1, 4, 6]
       * ERC20: 6.792 Ethers
       */
      await erc20.connect(bob).approve(pairSwap.address, tokenInMaxWithSlippage);

      // when input invalid parameter: zero tokenAmountOut, zero idsOut
      await expect(
        pairSwap.connect(bob).swap(pair.address, 0, [], bob.address, tokenInMaxWithSlippage, []),
      ).to.be.revertedWithCustomError(pair, 'STP_INSUFFICIENT_OUTPUT_AMOUNT');

      // when input invalid parameter: zero tokenAmountIn, zero idsIn
      await expect(pairSwap.connect(bob).swap(pair.address, 0, [4], bob.address, 0, [])).to.be.revertedWithCustomError(
        pair,
        'STP_INSUFFICIENT_INPUT_AMOUNT',
      );

      // when input valid parameter: contract address without ERC721Receiver implementer
      await expect(
        pairSwap.connect(bob).swap(pair.address, 0, [4], pairSwap.address, tokenInMaxWithSlippage, []),
      ).to.be.revertedWith('ERC721: transfer to non ERC721Receiver implementer');

      // // when input valid parameter
      await expect(pairSwap.connect(bob).swap(pair.address, 0, [4], bob.address, tokenInMaxWithSlippage, []))
        .to.be.emit(pair, 'Swap')
        .withArgs(pairSwap.address, ethers.utils.parseEther('0.8'), 0, 0, ethers.utils.parseEther('1'), bob.address);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('9.103119999999999999'));
      expect(await erc721.balanceOf(bob.address)).to.be.equal(3);
      expect(await erc721.ownerOf(1)).to.be.equal(bob.address);
      expect(await erc721.ownerOf(4)).to.be.equal(bob.address);
      expect(await erc721.ownerOf(6)).to.be.equal(bob.address);

      const [newReserve0, newReserve1] = await pair.getReserves();
      expect(newReserve0).to.be.equal(ethers.utils.parseEther('4.008880000000000001'));
      expect(newReserve1).to.be.equal(ethers.utils.parseEther('4'));
      expect(newReserve0.mul(newReserve1)).to.be.greaterThanOrEqual(oldReserve0.mul(oldReserve1)); // 3.2 * 5 = 4.008880000000000001 * 4
    });

    it('it should swap out NFT with excessive slippage successfully', async () => {
      const { tokenInMaxWithSlippage: tokenInMaxWithBigSlippage } = await getSwapTokenInMax(
        pair.address,
        [2],
        BI_ZERO,
        100, // set slippage to 100%
        100,
        owner,
      );
      expect(tokenInMaxWithBigSlippage).to.be.equal(ethers.utils.parseEther('2.966571200000000000'));

      // swap token to NFT with max slippage
      await erc20.connect(bob).approve(pairSwap.address, tokenInMaxWithBigSlippage);
      await expect(pairSwap.connect(bob).swap(pair.address, 0, [2], bob.address, tokenInMaxWithBigSlippage, []))
        .to.be.emit(pair, 'Swap')
        .withArgs(
          pairSwap.address,
          ethers.utils.parseEther('1.336293333333333333'),
          0,
          0,
          ethers.utils.parseEther('1'),
          bob.address,
        );
      expect(await erc721.ownerOf(2)).to.be.equal(bob.address);

      // swap NFT to token with max slippage
      const { tokenOutMin } = await getSwapTokenOutMin(pair.address, [2], BI_ZERO, 100, 100, owner);
      expect(tokenOutMin).to.be.equal(ethers.utils.parseEther('1.519332112666666666'));
      await erc721.connect(bob).setApprovalForAll(pairSwap.address, true);
      await expect(pairSwap.connect(bob).swap(pair.address, tokenOutMin, [], bob.address, 0, [2]))
        .to.be.emit(pair, 'Swap')
        .withArgs(
          pairSwap.address,
          0,
          ethers.utils.parseEther('1'),
          ethers.utils.parseEther('1.707114733333333333'),
          0,
          bob.address,
        );
      expect(await erc721.ownerOf(2)).to.be.equal(pair.address);
    });
  });

  describe('When Skim', () => {
    before(async () => {
      for (let i = 0; i < 5; i++) {
        await erc721a.mint(carol.address);
      }

      const startingERC20Balance = ethers.utils.parseEther('10000000');
      await erc20.mint(carol.address, startingERC20Balance);
      await erc721a.connect(carol).setApprovalForAll(manager.address, true);
      await erc20.connect(carol).approve(manager.address, startingERC20Balance);

      const tokenAmount = ethers.utils.parseEther('2');
      await manager
        .connect(carol)
        .mint(erc20.address, erc721a.address, ONE_PERCENT, tokenAmount, [1, 2], tokenAmount, MaxUint256);
    });

    it('it should keep reserve0 and balance0 balance after skimming ', async () => {
      const pairAddress = await manager.getPair(erc20.address, erc721a.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
      await pair.setProtocolFeePercent(await pair.MAX_PROTOCOL_FEE_PERCENT());

      // // Verify Position NFT owned by Carol
      expect(await manager.ownerOf(7)).to.be.equal(carol.address);
      const [balance0, balance1] = await pair.getBalances();
      const liquidity = sqrt(balance0.mul(balance1));
      expect(await manager['balanceOf(uint256)'](7)).to.be.equal(liquidity);

      const previousCarolERC20Balance = await erc20.balanceOf(carol.address);
      //   console.log('carol balance', previousCarolERC20Balance);

      expect((await pair.getBalances())._balance0).to.be.equal((await pair.getReserves())._reserve0);

      await erc20.connect(carol).transfer(pair.address, ethers.utils.parseEther('1000000'));
      //   console.log('carol balance after transfer', await erc20.balanceOf(carol.address));
      expect(await erc20.balanceOf(carol.address)).to.be.equal(
        previousCarolERC20Balance.sub(ethers.utils.parseEther('1000000')),
      );
      expect((await pair.getBalances())._balance0.sub((await pair.getReserves())._reserve0)).to.be.equal(
        ethers.utils.parseEther('1000000'),
      );

      await pair.skim(carol.address, []);
      const latestCarolERC20Balance = await erc20.balanceOf(carol.address);
      //   console.log('carol balance after skim', latestCarolERC20Balance);
      expect(latestCarolERC20Balance).to.be.equal(previousCarolERC20Balance);

      expect((await pair.getBalances())._balance0).to.be.equal((await pair.getReserves())._reserve0);
    });

    it('it should keep reserve1 and balance1 balance after skimming ', async () => {
      const pairAddress = await manager.getPair(erc20.address, erc721a.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
      await pair.setProtocolFeePercent(await pair.MAX_PROTOCOL_FEE_PERCENT());
      // // Verify Position NFT owned by Carol
      expect(await manager.ownerOf(7)).to.be.equal(carol.address);
      const [balance0, balance1] = await pair.getBalances();
      const liquidity = sqrt(balance0.mul(balance1));
      expect(await manager['balanceOf(uint256)'](7)).to.be.equal(liquidity);

      const previousCarolERC721Balance = await erc721a.balanceOf(carol.address);
      //   console.log('carol balance', previousCarolERC721Balance);

      expect((await pair.getBalances())._balance1).to.be.equal((await pair.getReserves())._reserve1);

      await erc721a.connect(carol)['safeTransferFrom(address,address,uint256)'](carol.address, pair.address, 4);
      //   console.log('carol balance after transfer', await erc721a.balanceOf(carol.address));
      expect(await erc721a.balanceOf(carol.address)).to.be.equal(previousCarolERC721Balance.sub(1));
      expect((await pair.getBalances())._balance1.sub((await pair.getReserves())._reserve1)).to.be.equal(
        ethers.utils.parseEther('1'),
      );

      await pair.skim(carol.address, [4]);
      const latestCarolERC721Balance = await erc721a.balanceOf(carol.address);
      //   console.log('carol balance after skim', latestCarolERC721Balance);
      expect(latestCarolERC721Balance).to.be.equal(previousCarolERC721Balance);
      expect((await pair.getBalances())._balance1).to.be.equal((await pair.getReserves())._reserve1);
    });

    it('it should skim to be reverted when pair is balanced as it meant to be', async () => {
      const pairAddress = await manager.getPair(erc20.address, erc721a.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
      await pair.setProtocolFeePercent(await pair.MAX_PROTOCOL_FEE_PERCENT());
      // // Verify Position NFT owned by Carol
      expect(await manager.ownerOf(7)).to.be.equal(carol.address);
      const [balance0, balance1] = await pair.getBalances();
      const liquidity = sqrt(balance0.mul(balance1));

      expect(await manager['balanceOf(uint256)'](7)).to.be.equal(liquidity);
      expect((await pair.getBalances())._balance1).to.be.equal((await pair.getReserves())._reserve1);
      await expect(pair.skim(carol.address, [4])).to.be.revertedWithCustomError(pair, 'STP_SKIM_QUANTITY_MISMATCH');
    });
  });

  describe('When Set Protocol Fee Percent', () => {
    let pairSwap: MockSeacowsPairSwap;
    before(async () => {
      for (let i = 0; i < 5; i++) {
        await erc721a.mint(carol.address);
      }

      const startingERC20Balance = ethers.utils.parseEther('10000000');
      await erc20.mint(carol.address, startingERC20Balance);
      await erc721a.connect(carol).setApprovalForAll(manager.address, true);
      await erc20.connect(carol).approve(manager.address, startingERC20Balance);

      const MockSeacowsPairSwapFC = await ethers.getContractFactory('MockSeacowsPairSwap');
      pairSwap = await MockSeacowsPairSwapFC.deploy();
    });

    it('it should set fee percent when caller is fee manager', async () => {
      const pairAddress = await manager.getPair(erc20.address, erc721a.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);

      expect(await pair.protocolFeePercent()).to.be.eql(BigNumber.from(1000));
      await pair.connect(owner).setProtocolFeePercent(await pair.MAX_PROTOCOL_FEE_PERCENT());
      expect(await pair.protocolFeePercent()).to.be.eql(await pair.MAX_PROTOCOL_FEE_PERCENT());
    });

    it('it should to be reverted when caller is not fee manager', async () => {
      const pairAddress = await manager.getPair(erc20.address, erc721a.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);
      await expect(
        pair.connect(alice).setProtocolFeePercent(await pair.MAX_PROTOCOL_FEE_PERCENT()),
      ).to.be.revertedWithCustomError(pair, 'STP_UNAUTHORIZED');
    });

    it('it should to be reverted when protocol fee is out of range', async () => {
      const pairAddress = await manager.getPair(erc20.address, erc721a.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);

      const currentFeePercent = await pair.MAX_PROTOCOL_FEE_PERCENT();
      const newFeePercent = currentFeePercent.mul(10);
      await expect(pair.connect(owner).setProtocolFeePercent(newFeePercent)).to.be.revertedWithCustomError(
        pair,
        'STP_FEE_OUT_OF_RANGE',
      );
    });

    it('it should swap correctly when protocol fee is updated', async () => {
      await erc20.mint(bob.address, ethers.utils.parseEther('10000'));

      // Current Fee
      expect(await pair.protocolFeePercent()).to.be.eql(await pair.MAX_PROTOCOL_FEE_PERCENT());

      const { tokenInMaxWithSlippage: tokenInMaxWithSlippage1 } = await getSwapTokenInMax(
        pair.address,
        [5],
        BI_ZERO,
        1,
        100,
        owner,
      );

      const feeReceiver = await manager.feeTo();
      const oldBalance = await erc20.balanceOf(feeReceiver);
      await erc20.connect(bob).approve(pairSwap.address, tokenInMaxWithSlippage1);
      await expect(
        pairSwap.connect(bob).swap(pair.address, 0, [5], bob.address, tokenInMaxWithSlippage1, []),
      ).to.be.emit(pair, 'Swap');
      const newBalance = await erc20.balanceOf(feeReceiver);

      expect(newBalance.sub(oldBalance)).to.be.eq(ethers.utils.parseEther('0.170711473333333333'));
    });
  });

  describe('When Set Min Royalty Fee Percent', () => {
    let pairSwap: MockSeacowsPairSwap;
    before(async () => {
      const address = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      pair = await ethers.getContractAt('SeacowsERC721TradePair', address);

      const MockSeacowsPairSwapFC = await ethers.getContractFactory('MockSeacowsPairSwap');
      pairSwap = await MockSeacowsPairSwapFC.deploy();

      const MockRoyaltyRegistryFC = await ethers.getContractFactory('MockRoyaltyRegistry');
      registry = await MockRoyaltyRegistryFC.deploy(ethers.constants.AddressZero);
      await manager.setRoyaltyRegistry(registry.address);
    });

    it('it should have 0% min royalty fee intially', async () => {
      minRoyaltyFeePercent = await pair.minRoyaltyFeePercent();
      expect(minRoyaltyFeePercent).to.be.equal(0);
    });

    it('it should set min royalty fee correctly', async () => {
      await pair.connect(owner).setMinRoyaltyFeePercent(100);
      minRoyaltyFeePercent = await pair.minRoyaltyFeePercent();
      expect(minRoyaltyFeePercent).to.be.equal(100);
    });

    it('it should swap correctly when set min royalty fee with very high or very small value', async () => {
      await erc20.mint(bob.address, ethers.utils.parseEther('10000'));
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const SMALL_MinRoyaltyFeePercent = BigNumber.from(1);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const BIG_MinRoyaltyFeePercent = BigNumber.from(10000); // 😨 set to 100%, normal is 1%

      // set very small min royalty fee percent
      await pair.connect(owner).setMinRoyaltyFeePercent(SMALL_MinRoyaltyFeePercent);
      minRoyaltyFeePercent = await pair.minRoyaltyFeePercent();
      expect(minRoyaltyFeePercent).to.be.equal(SMALL_MinRoyaltyFeePercent);

      const { tokenInMaxWithSlippage: tokenInMaxWithSlippage1 } = await getSwapTokenInMax(
        pair.address,
        [3],
        SMALL_MinRoyaltyFeePercent,
        1,
        100,
        owner,
      );

      await erc20.connect(bob).approve(pairSwap.address, tokenInMaxWithSlippage1);
      await expect(
        pairSwap.connect(bob).swap(pair.address, 0, [3], bob.address, tokenInMaxWithSlippage1, []),
      ).to.be.emit(pair, 'Swap');

      // set very high min royalty fee percent
      await pair.connect(owner).setMinRoyaltyFeePercent(BIG_MinRoyaltyFeePercent);
      minRoyaltyFeePercent = await pair.minRoyaltyFeePercent();
      expect(minRoyaltyFeePercent).to.be.equal(BIG_MinRoyaltyFeePercent);

      // Input almost 17.13 eth
      const { tokenInMaxWithSlippage: tokenInMaxWithSlippage2 } = await getSwapTokenInMax(
        pair.address,
        [2],
        BIG_MinRoyaltyFeePercent,
        1,
        100,
        owner,
      );

      const recipient = await pair.getRoyaltyRecipient(2);
      const recipientOldBalance = await erc20.balanceOf(recipient);
      await erc20.connect(bob).approve(pairSwap.address, tokenInMaxWithSlippage2);
      await expect(
        pairSwap.connect(bob).swap(pair.address, 0, [2], bob.address, tokenInMaxWithSlippage2, []),
      ).to.be.emit(pair, 'Swap');
      const recipientNewBalance = await erc20.balanceOf(recipient);

      // receive big royalty fee 😂, 10.x eth
      expect(recipientNewBalance.sub(recipientOldBalance)).to.be.eq(ethers.utils.parseEther('10.487832320562541008'));
    });

    it('it should set min royalty to be reverted when called is not royalty fee manager', async () => {
      await expect(pair.connect(carol).setMinRoyaltyFeePercent(100)).to.be.revertedWithCustomError(
        pair,
        'RM_NON_ROYALTY_FEE_MANAGER',
      );
    });
  });

  describe('When Mint With Different Fee: POINT_FIVE_PERCENT VS ONE_PERCENT', () => {
    let pairSwap: MockSeacowsPairSwap;

    before(async () => {
      const MockSeacowsPairSwapFC = await ethers.getContractFactory('MockSeacowsPairSwap');
      pairSwap = await MockSeacowsPairSwapFC.deploy();

      await manager.setFeeTo(feeToa.address);
      for (let i = 0; i < 10; i++) {
        await erc721b.mint(jack.address);
      }
      await erc20a.mint(jack.address, ethers.utils.parseEther('10'));

      await erc20a.connect(jack).approve(manager.address, ethers.utils.parseEther('10'));
      await erc721b.connect(jack).setApprovalForAll(manager.address, true);

      // create pair: erc20a-erc721b-ONE_PERCENT
      await manager
        .connect(jack)
        .mint(erc20a.address, erc721b.address, ONE_PERCENT, ethers.utils.parseEther('2'), [1, 2], 0, MaxUint256);

      // create pair: erc20a-erc721b-POINT_FIVE_PERCENT
      await manager
        .connect(jack)
        .mint(erc20a.address, erc721b.address, POINT_FIVE_PERCENT, ethers.utils.parseEther('2'), [3, 4], 0, MaxUint256);
    });

    it('it should fee calculations are accurate', async () => {
      expect(await manager.feeTo()).to.be.equal(feeToa.address);
      const startProtocolFeeBalance = await erc20a.balanceOf(feeToa.address);
      expect(startProtocolFeeBalance).to.be.equal(0);
      expect(await erc20a.balanceOf(jack.address)).to.be.equal(ethers.utils.parseEther('6'));
      expect(await erc721b.balanceOf(jack.address)).to.be.equal(6);

      const pointFivePair: SeacowsERC721TradePair = await ethers.getContractAt(
        'SeacowsERC721TradePair',
        await manager.getPair(erc20a.address, erc721b.address, POINT_FIVE_PERCENT),
      );
      const onePointPair: SeacowsERC721TradePair = await ethers.getContractAt(
        'SeacowsERC721TradePair',
        await manager.getPair(erc20a.address, erc721b.address, ONE_PERCENT),
      );

      const { tokenOutMin: pointFivePairTokenOutMin } = await getSwapTokenOutMin(
        pointFivePair.address,
        [7],
        BI_ZERO,
        0,
        100,
        owner,
      );
      const { tokenOutMin: onePointPairTokenOutMin } = await getSwapTokenOutMin(
        onePointPair.address,
        [8],
        BI_ZERO,
        0,
        100,
        owner,
      );

      expect(pointFivePairTokenOutMin).to.be.equal(ethers.utils.parseEther('0.663133333333333332'));
      expect(onePointPairTokenOutMin).to.be.equal(ethers.utils.parseEther('0.659799999999999999'));

      await erc721b.connect(jack).setApprovalForAll(pairSwap.address, true);

      // first swap tx
      await expect(
        pairSwap.connect(jack).swap(pointFivePair.address, pointFivePairTokenOutMin, [], jack.address, 0, [7]),
      )
        .to.be.emit(pointFivePair, 'Swap')
        .withArgs(
          pairSwap.address,
          0,
          ethers.utils.parseEther('1'),
          ethers.utils.parseEther('0.666666666666666666'),
          0,
          jack.address,
        );

      const protocolFeeAfterOneTx = await erc20a.balanceOf(feeToa.address);

      // sencond swap tx
      await expect(pairSwap.connect(jack).swap(onePointPair.address, onePointPairTokenOutMin, [], jack.address, 0, [8]))
        .to.be.emit(onePointPair, 'Swap')
        .withArgs(
          pairSwap.address,
          0,
          ethers.utils.parseEther('1'),
          ethers.utils.parseEther('0.666666666666666666'),
          0,
          jack.address,
        );

      const protocolFeeAfterTwoTx = await erc20a.balanceOf(feeToa.address);

      // protocol fee should always same
      expect(protocolFeeAfterOneTx.sub(startProtocolFeeBalance)).to.be.equal(
        protocolFeeAfterTwoTx.sub(protocolFeeAfterOneTx),
      );

      // one point fee pair swap fee should be double than point five pair
      expect(await onePointPair.feeBalance()).to.be.equal((await pointFivePair.feeBalance()).mul(2));
    });
  });

  describe('When Mint With Boundary Values', () => {
    before(async () => {
      for (let i = 0; i < 5; i++) {
        await erc721c.mint(mike.address);
      }
      await erc20b.mint(mike.address, MaxUint256);
      await erc20b.connect(mike).approve(manager.address, MaxUint256);
      await erc721c.connect(mike).setApprovalForAll(manager.address, true);
    });

    it('it should mint to be reverted with panic code 0x11(overflowed) when token amount is MaxUint256', async () => {
      await expect(
        manager
          .connect(mike)
          .mint(erc20b.address, erc721c.address, POINT_FIVE_PERCENT, MaxUint256, [3, 4], 0, MaxUint256),
      ).to.be.revertedWithPanic('0x11'); // panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)
    });

    it('it should mint with very small token amount', async () => {
      await manager
        .connect(mike)
        .mint(
          erc20b.address,
          erc721c.address,
          ONE_PERCENT,
          ethers.utils.parseUnits('10', 'gwei'),
          [3, 2],
          0,
          MaxUint256,
        );
    });
  });
});
