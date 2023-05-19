import path from 'path';
import fs from 'fs';
import { type Environment } from '@yolominds/seacows-sdk';
import { type BigNumber } from 'ethers';

const getTokenIn = (nftsOut: BigNumber, tokenReserve: BigNumber, nftReserve: BigNumber): BigNumber => {
  return tokenReserve.mul(nftsOut).div(nftReserve.sub(nftsOut));
};

const getTokenOut = (nftsIn: BigNumber, tokenReserve: BigNumber, nftReserve: BigNumber): BigNumber => {
  return tokenReserve.mul(nftsIn).div(nftReserve.add(nftsIn));
};

const save = async (env: Environment, network: string, name: string, address: string): Promise<void> => {
  const targetPath = path.join(
    __dirname,
    '../../../seacows-sdk/deployed',
    env.toString(),
    network.toString(),
    name + '.json',
  );
  ensureDirectory(targetPath);
  fs.writeFileSync(targetPath, JSON.stringify({ address }, null, 2));
  console.log(`${name} of address ${address} deployment saved to ${targetPath}`);
};

const ensureDirectory = (filePath: string): boolean => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectory(dirname);
  fs.mkdirSync(dirname);
  return false;
};

// function persistedDeploymentFilePath(network: string, name: string) {
//   return path.join(__dirname, '../../../../deployed', network, name + '.json');
// }

export { save, getTokenIn, getTokenOut };
