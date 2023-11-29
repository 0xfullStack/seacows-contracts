import { Environment } from '@yolominds/seacows-sdk';
import dev from './dev';
import production from './production';

export const addresses = {
  [Environment.DEV]: dev,
  [Environment.PRODUCTION]: production,
};
