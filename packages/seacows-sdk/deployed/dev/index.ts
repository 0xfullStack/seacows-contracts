import { SupportedChain } from "@yolominds/seacows-sdk";
import goerli from "./goerli";
import mumbai from "./mumbai";

export default {
  [SupportedChain.GÖRLI]: goerli,
  [SupportedChain.MUMBAI]: mumbai,
};
