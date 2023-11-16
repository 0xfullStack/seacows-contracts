import { SupportedChain } from '@yolominds/seacows-sdk';
import goerli from './goerli';
import sepolia from './sepolia';

export default {
  [SupportedChain.GÖRLI]: goerli,
  [SupportedChain.SEPOLIA]: sepolia,
};
