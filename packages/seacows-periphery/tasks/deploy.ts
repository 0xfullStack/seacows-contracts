import { type ActionType } from 'hardhat/types';
import { type Environment } from '@yolominds/seacows-sdk';
// import { addresses } from '../deployed';
import { save } from './utils';

export const deploy: ActionType<{ env: Environment }> = async ({ env }, { ethers, network }) => {
  try {
    const SeacowsRouterFC = await ethers.getContractFactory('SeacowsRouter');
    const router = await SeacowsRouterFC.deploy();
    await router.deployed();
    await save(env, network.name, 'SeacowsRouter', router.address);
  } catch (error) {
    console.error('Error meesage:', error.message);
  }
};
