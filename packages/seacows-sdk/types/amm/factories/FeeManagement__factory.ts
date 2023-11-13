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
    inputs: [],
    name: "royaltyFeeManager",
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
    name: "royaltyRegistry",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "setRoyaltyFeeManager",
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
    name: "setRoyaltyRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060018054336001600160a01b03199182168117909255600280548216831790556003805490911690911790556103568061004c6000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063a11b07121161005b578063a11b0712146100ef578063acb3cf8114610100578063d0fb020314610113578063f46901ed1461012457600080fd5b8063017e7e581461008d578063472d35b9146100b657806384a608e2146100cb57806387e4401f146100de575b600080fd5b6003546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b6100c96100c43660046102aa565b610137565b005b6100c96100d93660046102aa565b6101b8565b6002546001600160a01b031661009a565b6000546001600160a01b031661009a565b6100c961010e3660046102aa565b610204565b6001546001600160a01b031661009a565b6100c96101323660046102aa565b61022e565b6001546001600160a01b031633146101965760405162461bcd60e51b815260206004820152601e60248201527f4665654d616e6167656d656e743a204e4f4e5f4645455f4d414e41474552000060448201526064015b60405180910390fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6001546001600160a01b031633146101e25760405162461bcd60e51b815260040161018d906102da565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b6001546001600160a01b031633146101965760405162461bcd60e51b815260040161018d906102da565b6001546001600160a01b031633146102885760405162461bcd60e51b815260206004820152601e60248201527f4665654d616e6167656d656e743a204e4f4e5f4645455f4d414e414745520000604482015260640161018d565b600380546001600160a01b0319166001600160a01b0392909216919091179055565b6000602082840312156102bc57600080fd5b81356001600160a01b03811681146102d357600080fd5b9392505050565b60208082526026908201527f4665654d616e6167656d656e743a204e4f4e5f524f59414c54595f4645455f4d60408201526520a720a3a2a960d11b60608201526080019056fea2646970667358221220e00436a1f162b3cc9454f763d0d8ccdb5946c77cd5c7948b32a1f5959e76d13964736f6c63430008120033";

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
