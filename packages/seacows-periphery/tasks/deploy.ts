import { type ActionType } from 'hardhat/types';
import { addresses, type SupportedChain, type Environment } from '@yolominds/seacows-sdk';
// import { addresses } from '../deployed';
import { save } from './utils';

export const deploy: ActionType<{ env: Environment }> = async ({ env }, { ethers, network, run }) => {
  const chainId = network.config.chainId as SupportedChain;
  const { weth } = addresses[env][chainId];

  try {
    const SeacowsRouterFC = await ethers.getContractFactory('SeacowsRouter');
    const router = await SeacowsRouterFC.deploy(weth);
    await router.deployed();
    await save(env, network.name, 'SeacowsRouter', router.address);

    await run('verify:verify', {
      address: router.address,
      constructorArguments: [weth],
    });
  } catch (error) {
    console.error('Error meesage:', error.message);
  }
};
