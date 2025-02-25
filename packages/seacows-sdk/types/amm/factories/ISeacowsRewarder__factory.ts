/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  ISeacowsRewarder,
  ISeacowsRewarderInterface,
} from "../ISeacowsRewarder";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "CollectFee",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "updatePositionFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "updatePositionFeeDebt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateSwapFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ISeacowsRewarder__factory {
  static readonly abi = _abi;
  static createInterface(): ISeacowsRewarderInterface {
    return new utils.Interface(_abi) as ISeacowsRewarderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISeacowsRewarder {
    return new Contract(address, _abi, signerOrProvider) as ISeacowsRewarder;
  }
}
