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
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_collection",
        type: "address",
      },
    ],
    name: "getComplementedBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "balance1",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506102a5806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632c586d9c1461003b5780639e75baa714610068575b600080fd5b61004e6100493660046101c5565b610085565b604080519283526020830191909152015b60405180910390f35b610077670de0b6b3a764000081565b60405190815260200161005f565b600080546040516370a0823160e01b81523060048201528291906001600160a01b038616906370a0823190602401602060405180830381865afa1580156100d0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100f491906101ef565b6100fe919061021e565b6001546040516370a0823160e01b81523060048201529193509061018190670de0b6b3a7640000906001600160a01b038716906370a0823190602401602060405180830381865afa158015610157573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061017b91906101ef565b90610194565b61018b9190610245565b90509250929050565b60006101a08284610258565b90505b92915050565b80356001600160a01b03811681146101c057600080fd5b919050565b600080604083850312156101d857600080fd5b6101e1836101a9565b915061018b602084016101a9565b60006020828403121561020157600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b818103600083128015838313168383128216171561023e5761023e610208565b5092915050565b818103818111156101a3576101a3610208565b80820281158282048414176101a3576101a361020856fea2646970667358221220bd43a573a0fcc993dcc6382393b17bdaab16d1b5907737f7b591f0cbe81bff2b64736f6c63430008120033";

export class SeacowsComplement__factory extends ContractFactory {
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
