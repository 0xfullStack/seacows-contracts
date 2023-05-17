import { type ActionType } from 'hardhat/types';
import { type Environment, type SupportedChain, addresses } from '@yolominds/seacows-sdk';
import { type ERC721, type ERC20, type SeacowsPositionManager } from '../types';
import MANAGER_ABI from '@yolominds/seacows-sdk/abis/seacows-amm/SeacowsPositionManager.json';
import ERC20_ABI from '@yolominds/seacows-sdk/abis/common/ERC20.json';
import ERC721_ABI from '@yolominds/seacows-sdk/abis/common/ERC721.json';
import { MaxUint256 } from '@ethersproject/constants';

export const mint: ActionType<{ env: Environment }> = async ({ env }, { ethers, network, config }) => {
  const wallets = await ethers.getSigners();
  // console.log(accounts.mnemonic);
  console.log(wallets);
  const chainId = network.config.chainId as SupportedChain;
  const { weth, manager } = addresses[env][chainId];
  const Manager = new ethers.Contract(manager, MANAGER_ABI, wallets[0]) as SeacowsPositionManager;

  console.log(manager);

  const token = new ethers.Contract('0x2786BFDa0764Ec13bf58eE147FA385E08e92d533', ERC20_ABI, wallets[0]) as ERC20;
  const collection = new ethers.Contract(
    '0xc973F7456d5518F47cD9fC203857f19904c1b0b6',
    ERC721_ABI,
    wallets[0],
  ) as ERC721;

  await token.approve(Manager.address, ethers.utils.parseEther('10'));
  await collection.setApprovalForAll(Manager.address, true);

  const txn = await Manager.connect(wallets[0]).mint(
    '0x2786BFDa0764Ec13bf58eE147FA385E08e92d533',
    '0xc973F7456d5518F47cD9fC203857f19904c1b0b6',
    100,
    ethers.utils.parseEther('10'),
    [4],
    ethers.utils.parseEther('10'),
    MaxUint256,
  );

  await txn.wait();
};
