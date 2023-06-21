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
    inputs: [],
    name: "COMPLEMENT_THRESHOLD",
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
  {
    inputs: [
      {
        internalType: "int256",
        name: "_tokenAmountOut",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "_nftAmountOut",
        type: "int256",
      },
    ],
    name: "getComplemenetedAssetsOut",
    outputs: [
      {
        internalType: "int256",
        name: "tokenAmountOut",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "nftAmountOut",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "newTokenComplement",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "newNftComplement",
        type: "int256",
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
        internalType: "int256",
        name: "",
        type: "int256",
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

const _bytecode =
  "0x608060405234801561001057600080fd5b506102fe806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80635b8d14da1461005c5780639a2fe1bd146100945780639e75baa7146100a65780639e7ef4c6146100b5578063a4ac5c1d146100c5575b600080fd5b61006f61006a3660046101cf565b6100cd565b6040805194855260208501939093529183015260608201526080015b60405180910390f35b6001545b60405190815260200161008b565b610098670de0b6b3a764000081565b6100986706f05b59d3b1ffff1981565b600054610098565b6000808080670de0b6b3a764000081816100e78189610207565b6100f19190610243565b905060006100ff8883610279565b90506706f05b59d3b1ffff196001548261011991906102a0565b1361012b5761012883836102a0565b91505b82821261019157819550600088876101439190610279565b90508060015461015391906102a0565b94506000896101628c84610243565b61016c9190610207565b9050610178818c610279565b9850806000546101889190610279565b965050506101c3565b8760015461019f9190610279565b6000965093506101b0896002610243565b9650886000546101c091906102a0565b94505b50505092959194509250565b600080604083850312156101e257600080fd5b50508035926020909101359150565b634e487b7160e01b600052601160045260246000fd5b60008261022457634e487b7160e01b600052601260045260246000fd5b600160ff1b82146000198414161561023e5761023e6101f1565b500590565b80820260008212600160ff1b8414161561025f5761025f6101f1565b8181058314821517610273576102736101f1565b92915050565b8181036000831280158383131683831282161715610299576102996101f1565b5092915050565b80820182811260008312801582168215821617156102c0576102c06101f1565b50509291505056fea2646970667358221220aed5c8bfb0e2f4b3bd68749f7c06f6b87358935ebde4888ccdf8043364ac23e164736f6c63430008120033";

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
