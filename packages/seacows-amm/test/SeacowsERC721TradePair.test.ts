import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
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
} from 'types';
import { ONE_PERCENT, COMPLEMENT_PRECISION } from './constants';
import { sqrt } from './utils';

describe('SeacowsERC721TradePair', () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;

  let weth: WETH;
  let erc721: MockERC721;
  let erc20: MockERC20;

  let template: SeacowsERC721TradePair;
  let manager: SeacowsPositionManager;
  let pair: SeacowsERC721TradePair;

  // Prepare contracts
  before(async () => {
    [owner, alice, bob, carol] = await ethers.getSigners();

    const WETHFC = await ethers.getContractFactory('WETH');
    const MockERC721FC = await ethers.getContractFactory('MockERC721');
    const MockERC20FC = await ethers.getContractFactory('MockERC20');
    weth = await WETHFC.deploy();
    erc721 = await MockERC721FC.deploy();
    erc20 = await MockERC20FC.deploy();

    const SeacowsERC721TradePairFC = await ethers.getContractFactory('SeacowsERC721TradePair');
    const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager');

    template = await SeacowsERC721TradePairFC.deploy();
    manager = await SeacowsPositionManagerFC.deploy(template.address, weth.address);
  });

  describe('Mint', () => {
    before(async () => {
      // Create a pair
      await manager.createPair(erc20.address, erc721.address, ONE_PERCENT);
      const address = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      pair = await ethers.getContractAt('SeacowsERC721TradePair', address);

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

    it('Should have 0 balance initially', async () => {
      const [tokenReserve, nftReserve] = await pair.getReserves();
      expect(tokenReserve).to.be.equal(0);
      expect(nftReserve).to.be.equal(0);
    });

    it('Should mint 2 Position NFTs the Pair and 1 for Alice', async () => {
      // await pair.mint(erc20.address, erc721.address, ONE_PERCENT);
      await erc20.connect(alice).approve(manager.address, ethers.utils.parseEther('2'));
      await erc721.connect(alice).setApprovalForAll(manager.address, true);
      await manager
        .connect(alice)
        .mint(erc20.address, erc721.address, ONE_PERCENT, ethers.utils.parseEther('2'), [0], 0, MaxUint256);

      /**
       * @notes
       * At this point, 3 position NFTs are minted
       * Pair Position NFT ID = 1, 0 liquidity
       * Alice Position NFT ID = 2,
       */
      expect(await manager.ownerOf(1)).to.be.equal(pair.address);
      expect(await manager.ownerOf(2)).to.be.equal(alice.address);

      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(
        sqrt(ethers.utils.parseEther('2').mul(BigNumber.from(1).mul(COMPLEMENT_PRECISION))),
      );
    });

    it('Should mint liqidity correctly even not using SeacowsPositionManager', async () => {
      const aliceLiquidityBefore = await manager['balanceOf(uint256)'](2);
      /**
       * @notes transfer assets from Alice to Pair
       * ERC20: 2 Ethers
       * ERC721: [1, 2, 3]
       */
      await erc20.connect(alice).transfer(pair.address, ethers.utils.parseEther('2'));
      await erc721.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, pair.address, 1);
      await erc721.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, pair.address, 2);
      await erc721.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, pair.address, 3);
      expect(await erc721.balanceOf(pair.address)).to.be.equal(4);
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('4'));

      const totalSupply = await pair.totalSupply();
      const [reserve0, reserve1] = await pair.getReserves();
      const [balance0, balance1] = await pair.getComplementedBalance(erc20.address, erc721.address);
      const liquidity1 = balance0.sub(reserve0).mul(totalSupply).div(reserve0);
      const liquidity2 = balance1.sub(reserve1).mul(totalSupply).div(reserve1);
      const expectedLiquidityToMint = liquidity1.lte(liquidity2) ? liquidity1 : liquidity2;

      // Mint liquidity based on balance
      await expect(pair.connect(alice).mint(2))
        .to.be.emit(pair, 'Mint')
        .withArgs(alice.address, ethers.utils.parseEther('2'), ethers.utils.parseEther('3'));
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(aliceLiquidityBefore.add(expectedLiquidityToMint));
    });

    it('Should have the correct final state', async () => {
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

  describe('Burn', () => {
    before(async () => {
      /**
       * @notes Prepare assets for Bob
       * ERC721: [5, 6]
       * ERC20: 10 Ethers
       * Position NFT: [4]
       */
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

    it('Should have correct initial state for Bob', async () => {
      expect(await erc721.ownerOf(5)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(6)).to.be.equal(bob.address);
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('5'));
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('9'));
    });

    it('Should burn liqidity correctly even not using SeacowsPositionManager', async () => {
      // Owner of ERC721 ID = 1 is the Pair
      expect(await erc721.ownerOf(1)).to.be.equal(pair.address);
      const bobLiquidity = await manager['balanceOf(uint256)'](3);
      const pairTokenId = await manager.tokenOf(pair.address);
      await manager.connect(bob)['transferFrom(uint256,uint256,uint256)'](3, pairTokenId, bobLiquidity);

      // Bob burn the liquidity and want to get back ERC721 with ID = [1]
      await expect(pair.connect(bob).burn(bob.address, [1]))
        .to.be.emit(pair, 'Burn')
        .withArgs(bob.address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1'), bob.address);

      // Owner of ERC721 ID = 1 is Bob now
      expect(await erc721.ownerOf(1)).to.be.equal(bob.address);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('10'));
    });

    it('Should have the correct final state', async () => {
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
       * ERC721: [0, 2, 3, 5]
       * ERC20: 4 Ethers
       * Pair NFT: [1, 2]
       */
      expect(await erc721.ownerOf(0)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(2)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(3)).to.be.equal(pair.address);
      expect(await erc721.ownerOf(5)).to.be.equal(pair.address);
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('4'));
      expect(await manager.ownerOf(1)).to.be.equal(pair.address);
      expect(await manager.ownerOf(2)).to.be.equal(alice.address);
    });
  });

  describe('Swap', () => {
    it('Should swap out ERC20 token successfully', async () => {
      /**
       * @notes Summary of Alice before swap
       * ERC721: [4]
       * ERC20: 6 Ethers
       * Pair NFT: [3]
       */
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('6'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(1);

      /**
       * @notes Alice's swap
       * Swap in ERC721: [4]
       * Swap out ERC20 (Including fee): 0.784 Ethers
       */
      const [reserve0, reserve1] = await pair.getReserves();
      await erc721.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, pair.address, 4);
      const [balance0, balance1] = await pair.getComplementedBalance(erc20.address, erc721.address);
      const k = reserve0.mul(reserve1);
      const out = balance0.sub(k.div(balance1));
      const fee = await pair.fee();
      const precision = await pair.PERCENTAGE_PRECISION();
      const outWithFee = out.sub(out.mul(fee).mul(2).div(precision));
      // Expected ERC20 output after = 0.784 Ethers
      expect(outWithFee).to.be.equal(ethers.utils.parseEther('0.784'));

      /**
       * @notes Summary of Alice after swap
       * ERC721: []
       * ERC20: 6.792 Ethers
       */
      await expect(pair.connect(alice).swap(outWithFee, [], alice.address))
        .to.be.emit(pair, 'Swap')
        .withArgs(alice.address, 0, 1, outWithFee, 0, alice.address);
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('6.784'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(0);
    });

    it('Should swap out NFT successfully', async () => {
      /**
       * @notes Summary of Bob before swap
       * ERC721: [1, 6]
       * ERC20: 10 Ethers
       * Pair NFT: [4]
       */
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('10'));
      expect(await erc721.balanceOf(bob.address)).to.be.equal(2);

      /**
       * @notes Bob's swap
       * Swap in ERC20 (including fee): 0.81002 ether
       * Swap out ERC721: [6]
       */
      const fee = await pair.fee();
      const precision = await pair.PERCENTAGE_PRECISION();
      const [reserve0, reserve1] = await pair.getReserves();
      const k = reserve0.mul(reserve1);
      const reserve1AfterSwap = reserve1.sub(BigNumber.from(1).mul(await pair.COMPLEMENT_PRECISION()));
      const amount0In = k.div(reserve1AfterSwap).sub(reserve0);
      const amount0InWithFee = amount0In.add(amount0In.mul(fee).mul(2).div(precision));

      await erc20.connect(bob).transfer(pair.address, amount0InWithFee);
      expect(amount0InWithFee).to.be.equal(ethers.utils.parseEther('0.82008'));

      /**
       * @notes Summary of Bob after swap
       * ERC721: [1, 4, 6]
       * ERC20: 6.792 Ethers
       */
      await expect(pair.connect(bob).swap(0, [4], bob.address))
        .to.be.emit(pair, 'Swap')
        .withArgs(bob.address, amount0InWithFee, 0, 0, 1, bob.address);
      expect(await erc20.balanceOf(bob.address)).to.be.equal(ethers.utils.parseEther('9.17992'));
      expect(await erc721.balanceOf(bob.address)).to.be.equal(3);
      expect(await erc721.ownerOf(1)).to.be.equal(bob.address);
      expect(await erc721.ownerOf(4)).to.be.equal(bob.address);
      expect(await erc721.ownerOf(6)).to.be.equal(bob.address);
    });
  });
});
