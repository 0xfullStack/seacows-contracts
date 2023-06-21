/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { FeeManagement, FeeManagementInterface } from "../FeeManagement";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "feeManager",
    outputs: [
      {
        internalType: "address",
        name: "",
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
        name: "",
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

const _bytecode =
  "0x608060405234801561001057600080fd5b5060008054336001600160a01b0319918216811783556001805490921617905561020c90819061004090396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063017e7e5814610051578063472d35b91461007a578063d0fb02031461008f578063f46901ed146100a0575b600080fd5b6001546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b61008d6100883660046101a6565b6100b3565b005b6000546001600160a01b031661005e565b61008d6100ae3660046101a6565b61012f565b6000546001600160a01b0316331461010d5760405162461bcd60e51b81526020600482015260186024820152772332b2a6b0b730b3b2b6b2b73a1d102327a92124a22222a760411b60448201526064015b60405180910390fd5b600080546001600160a01b0319166001600160a01b0392909216919091179055565b6000546001600160a01b031633146101845760405162461bcd60e51b81526020600482015260186024820152772332b2a6b0b730b3b2b6b2b73a1d102327a92124a22222a760411b6044820152606401610104565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6000602082840312156101b857600080fd5b81356001600160a01b03811681146101cf57600080fd5b939250505056fea26469706673582212202541968f0fa0fb2844881e78575b3a98d3e80135e1d370de07232dfd1465ba7864736f6c63430008120033";

export class FeeManagement__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<FeeManagement> {
    return super.deploy(overrides || {}) as Promise<FeeManagement>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): FeeManagement {
    return super.attach(address) as FeeManagement;
  }
  connect(signer: Signer): FeeManagement__factory {
    return super.connect(signer) as FeeManagement__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FeeManagementInterface {
    return new utils.Interface(_abi) as FeeManagementInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FeeManagement {
    return new Contract(address, _abi, signerOrProvider) as FeeManagement;
  }
}
