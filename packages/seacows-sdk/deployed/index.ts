import { Environment } from '@yolominds/seacows-sdk';
import dev from './dev';
import prod from './prod';

export const addresses = {
  [Environment.DEV]: dev,
  [Environment.PRODUCTION]: prod,
};
