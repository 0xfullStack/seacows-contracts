import { type ActionType } from 'hardhat/types';
import { type Environment, type SupportedChain, addresses } from '@yolominds/seacows-sdk';
// import { addresses } from '../deployed';
import { save } from './utils';

export const deploy: ActionType<{ env: Environment }> = async ({ env }, { ethers, network, run }) => {
  const chainId = network.config.chainId as SupportedChain;
  const { weth, royaltyRegistry } = addresses[env][chainId];

  try {
    const NFTRendererFC = await ethers.getContractFactory('NFTRenderer');
    const lib = await NFTRendererFC.deploy();
    await lib.deployed();
    await save(env, network.name, 'NFTRenderer', lib.address);

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
    const SeacowsPositionManagerFC = await ethers.getContractFactory('SeacowsPositionManager', {
      libraries: {
        NFTRenderer: lib.address,
      },
    });

    const template = await SeacowsERC721TradePairFC.deploy();
    await template.deployed();
    await save(env, network.name, 'SeacowsERC721TradePair', template.address);

    const manager = await SeacowsPositionManagerFC.deploy(template.address, weth);
    await manager.deployed();
    await save(env, network.name, 'SeacowsPositionManager', manager.address);

    const txn = await manager.setRoyaltyRegistry(royaltyRegistry);
    await txn.wait();

    await delay(1 * 30 * 1000);

    console.log('Start verifying contracts...');

    await run('verify:verify', {
      address: lib.address,
      constructorArguments: [],
    });

    await run('verify:verify', {
      address: template.address,
      constructorArguments: [],
    });

    await run('verify:verify', {
      address: manager.address,
      constructorArguments: [template.address, weth],
    });

    console.log('All contracts Verified!!!');
  } catch (error) {
    console.error('Error meesage:', error.message);
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
