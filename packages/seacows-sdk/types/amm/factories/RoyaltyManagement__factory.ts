/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RoyaltyManagement,
  RoyaltyManagementInterface,
} from "../RoyaltyManagement";

const _abi = [
  {
    inputs: [],
    name: "royaltyRegistry",
    outputs: [
      {
        internalType: "contract IRoyaltyRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052348015600f57600080fd5b5060918061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063a11b071214602d575b600080fd5b600054603f906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f3fea2646970667358221220e031063c56dfb59685042108006135f617a055020f61dde1208ec9ddcd8d9aa864736f6c63430008120033";

export class RoyaltyManagement__factory extends ContractFactory {
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
  ): Promise<RoyaltyManagement> {
    return super.deploy(overrides || {}) as Promise<RoyaltyManagement>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): RoyaltyManagement {
    return super.attach(address) as RoyaltyManagement;
  }
  connect(signer: Signer): RoyaltyManagement__factory {
    return super.connect(signer) as RoyaltyManagement__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RoyaltyManagementInterface {
    return new utils.Interface(_abi) as RoyaltyManagementInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RoyaltyManagement {
    return new Contract(address, _abi, signerOrProvider) as RoyaltyManagement;
  }
}
