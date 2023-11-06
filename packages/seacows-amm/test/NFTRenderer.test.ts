import { MaxUint256, Zero } from '@ethersproject/constants';
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import {
  type SeacowsERC721TradePair,
  type SeacowsPositionManager,
  type WETH,
  type MockERC721,
  type MockERC20,
  type SpeedBump,
} from 'types';
import { ONE_PERCENT, POINT_FIVE_PERCENT } from './constants';

describe('NFTRenderer', () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let weth: WETH;
  let erc721: MockERC721;
  let erc20: MockERC20;
  let pair: SeacowsERC721TradePair;

  let speedBump: SpeedBump;
  let template: SeacowsERC721TradePair;
  let manager: SeacowsPositionManager;
  let rendererLib;
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

  it('Should render NFT SVG correctly', async () => {
    // Only log it to debug
    // console.log(await manager.tokenURI(1));
  });
});
