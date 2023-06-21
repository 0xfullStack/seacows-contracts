/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IFeeManagement,
  IFeeManagementInterface,
} from "../IFeeManagement";

const _abi = [
  {
    inputs: [],
    name: "feeManager",
    outputs: [
      {
        internalType: "address",
        name: "feeManager",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeTo",
    outputs: [
      {
        internalType: "address",
        name: "feeTo",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "setFeeManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "setFeeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IFeeManagement__factory {
  static readonly abi = _abi;
  static createInterface(): IFeeManagementInterface {
    return new utils.Interface(_abi) as IFeeManagementInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IFeeManagement {
    return new Contract(address, _abi, signerOrProvider) as IFeeManagement;
  }
}
