/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IERC3525MetadataDescriptor,
  IERC3525MetadataDescriptorInterface,
} from "../IERC3525MetadataDescriptor";

const _abi = [
  {
    inputs: [],
    name: "constructContractURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "slot",
        type: "uint256",
      },
    ],
    name: "constructSlotURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
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
    name: "constructTokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IERC3525MetadataDescriptor__factory {
  static readonly abi = _abi;
  static createInterface(): IERC3525MetadataDescriptorInterface {
    return new utils.Interface(_abi) as IERC3525MetadataDescriptorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IERC3525MetadataDescriptor {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IERC3525MetadataDescriptor;
  }
}
