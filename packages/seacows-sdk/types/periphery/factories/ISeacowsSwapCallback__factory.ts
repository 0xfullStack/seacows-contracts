/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  ISeacowsSwapCallback,
  ISeacowsSwapCallbackInterface,
} from "../ISeacowsSwapCallback";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "seacowsSwapCallback",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "idsIn",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ISeacowsSwapCallback__factory {
  static readonly abi = _abi;
  static createInterface(): ISeacowsSwapCallbackInterface {
    return new utils.Interface(_abi) as ISeacowsSwapCallbackInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISeacowsSwapCallback {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ISeacowsSwapCallback;
  }
}
