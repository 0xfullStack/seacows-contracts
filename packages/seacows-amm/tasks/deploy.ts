import { type ActionType } from 'hardhat/types';
import { type Environment, type SupportedChain } from '@yolominds/seacows-sdk';
import { addresses } from '../deployed';
import { save } from './utils';

export const deploy: ActionType<{ env: Environment }> = async ({ env }, { ethers, network }) => {
  const chainId = network.config.chainId as SupportedChain;
  const { weth } = addresses[env][chainId];

  try {
    const SeacowsERC721TradePairFC = await ethers.getContractFactory('SeacowsERC721TradePair');
    const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager');

    const template = await SeacowsERC721TradePairFC.deploy();
    await template.deployed();
    await save(env, network.name, 'SeacowsERC721TradePair', template.address);

    const manager = await SeacowsPositionManagerFC.deploy(template.address, weth);
    await manager.deployed();
    await save(env, network.name, 'SeacowsERC721TradePair', manager.address);

    console.log(`SeacowsPositionManager is deployed at: ${manager.address}`);
  } catch (error) {
    console.error('Error meesage:', error.message);
  }
};
