import { type ActionType } from 'hardhat/types';
import { addresses, type SupportedChain, type Environment } from '@yolominds/seacows-sdk';
import { save } from './utils';

export const deploy: ActionType<{ env: Environment }> = async ({ env }, { ethers, network, run }) => {
  const chainId = network.config.chainId as SupportedChain;
  const { weth, manager } = addresses[env][chainId];

  try {
    const SeacowsRouterFC = await ethers.getContractFactory('SeacowsRouter');
    console.log('manager address: ', manager);
    const router = await SeacowsRouterFC.deploy(manager, weth);
    await router.deployed();
    await save(env, network.name, 'SeacowsRouter', router.address);

    await delay(1 * 30 * 1000);

    await run('verify:verify', {
      address: router.address,
      constructorArguments: [manager, weth],
    });
  } catch (error) {
    console.error('Error meesage:', error.message);
  }
};
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
