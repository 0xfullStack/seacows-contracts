/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  PeripheryImmutableState,
  PeripheryImmutableStateInterface,
} from "../PeripheryImmutableState";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_manager",
        type: "address",
      },
      {
        internalType: "address",
        name: "_weth",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "manager",
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
    name: "weth",
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
];

const _bytecode =
  "0x60c060405234801561001057600080fd5b5060405161018b38038061018b83398101604081905261002f91610062565b6001600160a01b0391821660a05216608052610095565b80516001600160a01b038116811461005d57600080fd5b919050565b6000806040838503121561007557600080fd5b61007e83610046565b915061008c60208401610046565b90509250929050565b60805160a05160d56100b66000396000607d01526000603b015260d56000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80633fc8cef3146037578063481c6a75146079575b600080fd5b605d7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200160405180910390f35b605d7f00000000000000000000000000000000000000000000000000000000000000008156fea2646970667358221220367bfd93b97ef2900acea5c7b0a39a633b52a4a04de88a456f468f58fc91861f64736f6c634300080d0033";

export class PeripheryImmutableState__factory extends ContractFactory {
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
    _manager: string,
    _weth: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PeripheryImmutableState> {
    return super.deploy(
      _manager,
      _weth,
      overrides || {}
    ) as Promise<PeripheryImmutableState>;
  }
  getDeployTransaction(
    _manager: string,
    _weth: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_manager, _weth, overrides || {});
  }
  attach(address: string): PeripheryImmutableState {
    return super.attach(address) as PeripheryImmutableState;
  }
  connect(signer: Signer): PeripheryImmutableState__factory {
    return super.connect(signer) as PeripheryImmutableState__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PeripheryImmutableStateInterface {
    return new utils.Interface(_abi) as PeripheryImmutableStateInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PeripheryImmutableState {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as PeripheryImmutableState;
  }
}
