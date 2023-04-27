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

  let weth: WETH;
  let erc721: MockERC721;
  let erc20: MockERC20;

  let template: SeacowsERC721TradePair;
  let manager: SeacowsPositionManager;

  // Prepare manager
  before(async () => {
    [owner, alice, bob] = await ethers.getSigners();

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
    let pair: SeacowsERC721TradePair;
    let pairTokenId: BigNumber;

    before(async () => {
      // Create a pair
      await manager.createPair(erc20.address, erc721.address, ONE_PERCENT);
      const address = await manager.getPair(erc20.address, erc721.address, ONE_PERCENT);
      pair = await ethers.getContractAt('SeacowsERC721TradePair', address);

      pairTokenId = await manager.tokenOf(pair.address);

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
       * Pair Lock Position NFT ID = 2, 10000 liquidity
       * Alice Position NFT ID = 3,
       */
      expect(await manager.ownerOf(1)).to.be.equal(pair.address);
      expect(await manager.ownerOf(2)).to.be.equal(pair.address);
      expect(await manager.ownerOf(3)).to.be.equal(alice.address);

      const lockedLiquidity = await manager['balanceOf(uint256)'](2);
      const aliceLiquidity = await manager['balanceOf(uint256)'](3);
      expect(lockedLiquidity).to.be.equal(10000);
      expect(aliceLiquidity.add(lockedLiquidity)).to.be.equal(
        sqrt(ethers.utils.parseEther('2').mul(BigNumber.from(1).mul(COMPLEMENT_PRECISION))),
      );
    });

    it('Should mint liqidity correctly even not using SeacowsPositionManager', async () => {
      const aliceLiquidityBefore = await manager['balanceOf(uint256)'](3);
      /**
       * @notes transfer assets from Alice to Pair
       * ERC20: 2 Ethers
       * ERC721: [1]
       */
      await erc20.connect(alice).transfer(pair.address, ethers.utils.parseEther('2'));
      await erc721.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, pair.address, 1);
      expect(await erc721.balanceOf(pair.address)).to.be.equal(2);
      expect(await erc20.balanceOf(pair.address)).to.be.equal(ethers.utils.parseEther('4'));

      const totalSupply = await pair.totalSupply();
      const [reserve0, reserve1] = await pair.getReserves();
      const [balance0, balance1] = await pair.getComplementedBalance(erc20.address, erc721.address);
      const liquidity1 = balance0.sub(reserve0).mul(totalSupply).div(reserve0);
      const liquidity2 = balance1.sub(reserve1).mul(totalSupply).div(reserve1);
      const expectedLiquidityToMint = liquidity1.lte(liquidity2) ? liquidity1 : liquidity2;

      // Mint liquidity based on balance
      await pair.mint(3);
      expect(await manager['balanceOf(uint256)'](3)).to.be.equal(aliceLiquidityBefore.add(expectedLiquidityToMint));
    });
  });
});
