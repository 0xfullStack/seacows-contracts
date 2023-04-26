import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  type SeacowsERC721TradePair,
  type SeacowsPositionManager,
  type WETH,
  type MockERC721,
  type MockERC20,
} from 'types';

describe('SeacowsPositionManager', () => {
  const ONE_PERCENT = 100;
  const POINT_FIVE_PERCENT = 50;

  describe('SeacowsERC721TradePairFactory', () => {
    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let weth: WETH;
    let MockERC721: MockERC721;
    let MockERC20: MockERC20;

    let template: SeacowsERC721TradePair;
    let SeacowsPositionManager: SeacowsPositionManager;

    beforeEach(async () => {
      [owner, alice, bob] = await ethers.getSigners();

      const WETHFC = await ethers.getContractFactory('WETH');
      const MockERC721FC = await ethers.getContractFactory('MockERC721');
      const MockERC20FC = await ethers.getContractFactory('MockERC20');
      weth = await WETHFC.deploy();
      MockERC721 = await MockERC721FC.deploy();
      MockERC20 = await MockERC20FC.deploy();

      const SeacowsERC721TradePairFC = await ethers.getContractFactory('SeacowsERC721TradePair');
      const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager');

      template = await SeacowsERC721TradePairFC.deploy();
      SeacowsPositionManager = await SeacowsPositionManagerFC.deploy(template.address, weth.address);
    });

    it('Should have correct initial configuration after create pair', async () => {
      await (await SeacowsPositionManager.createPair(MockERC20.address, MockERC721.address, ONE_PERCENT)).wait();

      const pairAddress = await SeacowsPositionManager.getPair(MockERC20.address, MockERC721.address, ONE_PERCENT);
      const pair = await ethers.getContractAt('SeacowsERC721TradePair', pairAddress);

      expect(await pair.positionManager()).to.be.equal(SeacowsPositionManager.address);
      expect(await pair.fee()).to.be.equal(ONE_PERCENT);
      expect(await pair.MINIMUM_LIQUIDITY()).to.be.equal(10000);
      expect(await pair.PERCENTAGE_PRECISION()).to.be.equal(10000);
      expect(await pair.ONE_PERCENT()).to.be.equal(ONE_PERCENT);
      expect(await pair.POINT_FIVE_PERCENT()).to.be.equal(POINT_FIVE_PERCENT);
      expect(await pair.slot()).to.be.equal(1);
      expect(await pair.totalSupply()).to.be.equal(0);
    });

    it('Should not create same pair with the same fee that created before', async () => {
      const ONE_PERCENT = 100;
      await (await SeacowsPositionManager.createPair(MockERC20.address, MockERC721.address, ONE_PERCENT)).wait();

      await expect(
        SeacowsPositionManager.createPair(MockERC20.address, MockERC721.address, ONE_PERCENT),
      ).to.be.revertedWith('Factory: Pair already exists');
    });
  });
});
