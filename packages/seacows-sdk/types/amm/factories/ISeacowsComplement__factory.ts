/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  ISeacowsComplement,
  ISeacowsComplementInterface,
} from "../ISeacowsComplement";

const _abi = [
  {
    inputs: [],
    name: "COMPLEMENT_PRECISION",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenAmountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_nftAmountOut",
        type: "uint256",
      },
    ],
    name: "getComplemenetedAssetsOut",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenAmountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nftAmountOut",
        type: "uint256",
      },
      {
        internalType: "int256",
        name: "tokenComplementAdjusted",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "nftComplementAdjusted",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nftComplement",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenComplement",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class ISeacowsComplement__factory {
  static readonly abi = _abi;
  static createInterface(): ISeacowsComplementInterface {
    return new utils.Interface(_abi) as ISeacowsComplementInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISeacowsComplement {
    return new Contract(address, _abi, signerOrProvider) as ISeacowsComplement;
  }
}
