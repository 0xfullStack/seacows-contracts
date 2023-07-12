import { type ActionType } from 'hardhat/types';
import {
  Environment,
  SupportedChain,
  addresses,
  getSwapTokenInMax,
  getSwapTokenOutMin,
  BI_ZERO,
} from '@yolominds/seacows-sdk';
import { type SeacowsRouter } from '@yolominds/seacows-sdk/types/periphery';
import ROUTER_ABI from '@yolominds/seacows-sdk/abis/periphery/SeacowsRouter.json';
// import { addresses } from '../deployed';
import ERC20_FAUCET_ABI from './abis/ERC20Faucet.json';
import ERC721_FAUCET_ABI from './abis/ERC721Faucet.json';
import { type BigNumber } from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';

const faucets = {
  [Environment.DEV]: {
    [SupportedChain.GÖRLI]: {
      erc20: '0x2786BFDa0764Ec13bf58eE147FA385E08e92d533',
      erc721: '0xc973f7456d5518f47cd9fc203857f19904c1b0b6',
    },
  },
};

export const initialize: ActionType<{ env: Environment }> = async ({ env }, { ethers, network }) => {
  const chainId = network.config.chainId as SupportedChain;
  const { weth, router, manager } = addresses[env][chainId];
  const { erc20, erc721 } = faucets[env][chainId];
  const [owner] = await ethers.getSigners();

  const ERC20Contract = new ethers.Contract(erc20, ERC20_FAUCET_ABI, owner);
  const ERC721Contract = new ethers.Contract(erc721, ERC721_FAUCET_ABI, owner);
  const ManagerContract = await ethers.getContractAt('SeacowsPositionManager', manager);
  const RouterContract = new ethers.Contract(router, ROUTER_ABI, owner) as SeacowsRouter;

  try {
    // Prepare assets
    const ERC20Symbol = (await ERC20Contract.symbol()) as string;
    console.log(`Minting ${ERC20Symbol}...`);
    await ERC20Contract.mint(owner.address, ethers.utils.parseEther('100'));
    console.log(`100${ERC20Symbol} Minted`);

    const ERC721Symbol = (await ERC721Contract.symbol()) as string;
    console.log(`Minting ${ERC721Symbol}...`);
    const total = ((await ERC721Contract.totalSupply()) as BigNumber).toNumber();
    console.log(`Total ${total} ${ERC721Symbol} in the collection`);
    const ids: number[] = [];

    for (let i = total; i < total + 8; i++) {
      console.log(`Mint ${ERC721Symbol} with ID ${i}`);
      const txn = await ERC721Contract.mint(owner.address);
      await txn.wait();
      ids.push(i);
      console.log(`${ERC721Symbol} Minted: `, ids);
    }

    // Create new Pair and mint Position NFTs via Manager
    await (await ERC20Contract.approve(manager, ethers.utils.parseEther('100'))).wait();
    await (await ERC721Contract.setApprovalForAll(manager, true)).wait();

    console.log(`Minting ${ERC20Symbol}-${ERC721Symbol} Pair with 1% fee...`);
    await (
      await ManagerContract.mint(
        erc20,
        erc721,
        100,
        ethers.utils.parseEther('40'),
        ids.slice(0, 4),
        ethers.utils.parseEther('40'),
        MaxUint256,
      )
    ).wait();
    console.log(`Done!`);
    console.log(`Minting ${ERC20Symbol}-${ERC721Symbol} Pair with 0.5% fee...`);
    await (
      await ManagerContract.mint(
        erc20,
        erc721,
        50,
        ethers.utils.parseEther('40'),
        ids.slice(4),
        ethers.utils.parseEther('40'),
        MaxUint256,
      )
    ).wait();
    console.log(`Done!`);

    // Swap something
    const pair = await ManagerContract.getPair(erc20, erc721, 100);
    console.log('Pair address: ', pair);
    const pairContract = await ethers.getContractAt('SeacowsERC721TradePair', pair);

    const { tokenInMax: amountIn } = await getSwapTokenInMax(pair, ids.slice(0, 1), BI_ZERO, 0, 100, owner);
    console.log('Approving Manager to spend ERC20');
    await (await ERC20Contract.connect(owner).approve(RouterContract.address, amountIn)).wait();
    await RouterContract.connect(owner).swapTokensForExactNFTs(
      pair,
      ids.slice(0, 1),
      amountIn,
      owner.address,
      MaxUint256,
    );

    const { tokenOutMin: amountOut } = await getSwapTokenOutMin(pair, ids.slice(0, 1), BI_ZERO, 0, 100, owner);
    await RouterContract.connect(owner).swapExactNFTsForTokens(
      pair,
      ids.slice(0, 1),
      amountOut,
      owner.address,
      MaxUint256,
    );
    // ManagerContract.connect(owner).swapExactNFTsForTokens(pair, [])
  } catch (error) {
    console.error('Error meesage:', error.message);
  }
};
