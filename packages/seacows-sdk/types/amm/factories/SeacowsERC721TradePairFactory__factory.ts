/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SeacowsERC721TradePairFactory,
  SeacowsERC721TradePairFactoryInterface,
} from "../SeacowsERC721TradePairFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "template_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_collection",
        type: "address",
      },
      {
        internalType: "uint112",
        name: "_fee",
        type: "uint112",
      },
    ],
    name: "getPair",
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
    name: "template",
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
  "0x60a060405234801561001057600080fd5b506040516101f33803806101f383398101604081905261002f91610040565b6001600160a01b0316608052610070565b60006020828403121561005257600080fd5b81516001600160a01b038116811461006957600080fd5b9392505050565b60805161016961008a6000396000603d01526101696000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80636f2ddd931461003b578063c10c69b814610079575b600080fd5b7f00000000000000000000000000000000000000000000000000000000000000005b6040516001600160a01b03909116815260200160405180910390f35b61005d6100873660046100e0565b6001600160a01b0392831660009081526020818152604080832094861683529381528382206001600160701b039390931682529190915220541690565b80356001600160a01b03811681146100db57600080fd5b919050565b6000806000606084860312156100f557600080fd5b6100fe846100c4565b925061010c602085016100c4565b915060408401356001600160701b038116811461012857600080fd5b80915050925092509256fea2646970667358221220a35b377c089a444831da52f7ee121ccd3ba627f244339525fc8dfbc8b82cea3e64736f6c63430008120033";

export class SeacowsERC721TradePairFactory__factory extends ContractFactory {
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
    template_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SeacowsERC721TradePairFactory> {
    return super.deploy(
      template_,
      overrides || {}
    ) as Promise<SeacowsERC721TradePairFactory>;
  }
  getDeployTransaction(
    template_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(template_, overrides || {});
  }
  attach(address: string): SeacowsERC721TradePairFactory {
    return super.attach(address) as SeacowsERC721TradePairFactory;
  }
  connect(signer: Signer): SeacowsERC721TradePairFactory__factory {
    return super.connect(signer) as SeacowsERC721TradePairFactory__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SeacowsERC721TradePairFactoryInterface {
    return new utils.Interface(_abi) as SeacowsERC721TradePairFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SeacowsERC721TradePairFactory {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as SeacowsERC721TradePairFactory;
  }
}
