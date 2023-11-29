import { BigNumber } from 'ethers';

export const BI_ZERO = BigNumber.from(0);

export enum Environment {
  DEV = 'dev',
  PRODUCTION = 'prod',
}

export enum SupportedChain {
  MAINNET = 1,
  GÖRLI = 5,
  SEPOLIA = 11155111,
}
