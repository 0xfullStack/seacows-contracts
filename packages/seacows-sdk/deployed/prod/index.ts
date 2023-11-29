import { SupportedChain } from '@yolominds/seacows-sdk';
import mainnet from './mainnet';

export default {
  [SupportedChain.MAINNET]: mainnet,
};
