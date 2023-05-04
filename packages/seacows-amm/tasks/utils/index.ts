import path from 'path';
import fs from 'fs';
import { type Environment } from '@yolominds/constants';

const save = async (env: Environment, network: string, name: string, address: string): Promise<void> => {
  const targetPath = path.join(__dirname, '../../deployed', env.toString(), network.toString(), name + '.json');
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

export { save };
