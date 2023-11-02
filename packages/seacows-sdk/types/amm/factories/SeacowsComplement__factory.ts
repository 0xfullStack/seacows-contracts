/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SeacowsComplement,
  SeacowsComplementInterface,
} from "../SeacowsComplement";

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
    inputs: [],
    name: "COMPLEMENT_PRECISION_DIGITS",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_nftBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tokenExpectedOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_nftExpectedOut",
        type: "uint256",
      },
    ],
    name: "caculateAssetsOutAfterComplemented",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506101e6806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80635c2454b4146100465780639e75baa714610073578063db8cd58914610090575b600080fd5b61005961005436600461015a565b6100aa565b604080519283526020830191909152015b60405180910390f35b610082670de0b6b3a764000081565b60405190815260200161006a565b610098601281565b60405160ff909116815260200161006a565b6000806100b9868686866100c6565b9150915094509492505050565b604051633d27eded60e11b81526004810185905260248101849052604481018390526064810182905260126084820152600090819073__$7361758c0d185160b6cca64507b9678c39$__90637a4fdbda9060a4016040805180830381865af4158015610136573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100b9919061018c565b6000806000806080858703121561017057600080fd5b5050823594602084013594506040840135936060013592509050565b6000806040838503121561019f57600080fd5b50508051602090910151909290915056fea2646970667358221220299b7824da307693c76c6ef8cfb3b8d3a27c3c07c7dcb79f7e69da1a2ef582b264736f6c63430008120033";

type SeacowsComplementConstructorParams =
  | [linkLibraryAddresses: SeacowsComplementLibraryAddresses, signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SeacowsComplementConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => {
  return (
    typeof xs[0] === "string" ||
    (Array.isArray as (arg: any) => arg is readonly any[])(xs[0]) ||
    "_isInterface" in xs[0]
  );
};

export class SeacowsComplement__factory extends ContractFactory {
  constructor(...args: SeacowsComplementConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      const [linkLibraryAddresses, signer] = args;
      super(
        _abi,
        SeacowsComplement__factory.linkBytecode(linkLibraryAddresses),
        signer
      );
    }
  }

  static linkBytecode(
    linkLibraryAddresses: SeacowsComplementLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$7361758c0d185160b6cca64507b9678c39\\$__", "g"),
      linkLibraryAddresses["contracts/lib/PricingKernel.sol:PricingKernel"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SeacowsComplement> {
    return super.deploy(overrides || {}) as Promise<SeacowsComplement>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): SeacowsComplement {
    return super.attach(address) as SeacowsComplement;
  }
  connect(signer: Signer): SeacowsComplement__factory {
    return super.connect(signer) as SeacowsComplement__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SeacowsComplementInterface {
    return new utils.Interface(_abi) as SeacowsComplementInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SeacowsComplement {
    return new Contract(address, _abi, signerOrProvider) as SeacowsComplement;
  }
}

export interface SeacowsComplementLibraryAddresses {
  ["contracts/lib/PricingKernel.sol:PricingKernel"]: string;
}
