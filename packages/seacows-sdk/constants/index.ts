import { BigNumber } from 'ethers';

export const BI_ZERO = BigNumber.from(0);

export enum Environment {
  DEV = 'dev',
  STAGING = 'staging',
  PRODUCTION = 'prod',
}

export enum SupportedChain {
  MAINNET = 1,
  POLYGON = 137,
  BSC = 56,

  GÖRLI = 5,
  SEPOLIA = 11155111,
  BSC_TESTNET = 97,
}
