import { MaxUint256, Zero } from '@ethersproject/constants';
import { deployContract } from 'ethereum-waffle';
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  getSwapTokenInMax,
  getSwapTokenOutMin,
  getDepositTokenInMax,
  getWithdrawAssetsOutMin,
  BI_ZERO,
} from '@yolominds/seacows-sdk';
import { type SeacowsRouter } from '@yolominds/seacows-sdk/types/periphery';
import SeacowsRouterArtifact from '@yolominds/seacows-periphery/artifacts/contracts/SeacowsRouter.sol/SeacowsRouter.json';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import {
  type SeacowsERC721TradePair,
  type SpeedBump,
  type SeacowsPositionManagerWithSpeedBump,
  type WETH,
  type MockERC721,
  type MockERC20,
} from 'types';
import { ONE_PERCENT, POINT_FIVE_PERCENT } from './constants';
import { sqrt } from './utils';

describe('SeacowsPositionManagerWithSpeedBump', () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let weth: WETH;

  let speedBump: SpeedBump;
  let template: SeacowsERC721TradePair;
  let manager: SeacowsPositionManagerWithSpeedBump;
  let rendererLib;
  let router: SeacowsRouter;
  before(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    const nftFactoryLibraryFactory = await ethers.getContractFactory('NFTRenderer');
    const WETHFC = await ethers.getContractFactory('WETH');
    const SeacowsERC721TradePairFC = await ethers.getContractFactory('SeacowsERC721TradePair');

    rendererLib = await nftFactoryLibraryFactory.deploy();
    weth = await WETHFC.deploy();
    template = await SeacowsERC721TradePairFC.deploy();
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
      speedBump.initialize(manager.address);

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

    it('Should remove liquidity from pool, and deposit nft and token to SpeedBump contract', async () => {
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

      const { cTokenOutMin, cNftOutMin, tokenInRange, nftOutRange } = await getWithdrawAssetsOutMin(
        pair.address,
        ethers.utils.parseEther('1'),
        0,
        100,
        alice,
      );
      expect(tokenInRange[0]).to.be.equal(0);
      expect(tokenInRange[1]).to.be.equal(0);
      expect(nftOutRange[0]).to.be.equal(1);
      expect(nftOutRange[1]).to.be.equal(2);

      /**
       * nft and token withdraw to SpeedBump contract
       */
      await manager
        .connect(alice)
        .removeLiquidity(
          erc20.address,
          erc721.address,
          ONE_PERCENT,
          ethers.utils.parseEther('1'),
          { cTokenOutMin, cNftOutMin, tokenInMax: tokenInRange[1], nftIds: [1] },
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
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('7'));
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);
      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);

      // Check liqudity balance of Alice Position NFT
      expect(await manager['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('2'));
    });

    it('Should revert for invalid owner', async () => {
      await expect(speedBump.connect(bob).withdrawNft(erc721.address, 1)).to.rejectedWith(
        'SpeedBump: INVALID_MSG_SENDER',
      );
    });

    it('Should revert for invalid token ID', async () => {
      await expect(speedBump.connect(alice).withdrawNft(erc721.address, 10)).to.rejectedWith(
        'SpeedBump: INVALID_TOKEN_ID',
      );
    });

    it('Should move nft from SpeedBump to alice', async () => {
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(1);
      expect(await erc721.balanceOf(alice.address)).to.be.equal(2);

      await speedBump.connect(alice).withdrawNft(erc721.address, 1);
      expect(await erc721.balanceOf(speedBump.address)).to.be.equal(0);
      expect(await erc721.balanceOf(alice.address)).to.be.equal(3);
    });

    it('Should move tokens from SpeedBump to alice', async () => {
      expect(await erc20.balanceOf(speedBump.address)).to.be.equal(ethers.utils.parseEther('1'));
      expect(await erc20.balanceOf(alice.address)).to.be.equal(ethers.utils.parseEther('7'));
    });
  });
});
