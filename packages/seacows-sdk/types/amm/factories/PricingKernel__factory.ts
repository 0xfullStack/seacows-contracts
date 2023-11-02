/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PricingKernel, PricingKernelInterface } from "../PricingKernel";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "X0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "Y0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "E",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "N",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "DIGITS",
        type: "uint8",
      },
    ],
    name: "partialCompensated",
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
  {
    inputs: [
      {
        internalType: "int256",
        name: "X0",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "Y0",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "E",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "N",
        type: "int256",
      },
    ],
    name: "partialCompensation",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x610f2561003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100405760003560e01c80637a4fdbda14610045578063bedbf15b14610072575b600080fd5b610058610053366004610e1b565b610093565b604080519283526020830191909152015b60405180910390f35b610085610080366004610e6e565b61011d565b604051908152602001610069565b6000806100a4565b60405180910390fd5b6000806000806100b78b8b8b8b8b610a83565b935093509350935060006100ca82610c93565b9050808213156101075760006100e28686868661011d565b90506100f86100f18286610ea0565b838b610d10565b97509750505050505050610113565b89899650965050505050505b9550959350505050565b60008083121561017e5760405162461bcd60e51b815260206004820152602660248201527f50726963696e674b65726e656c3a2045206d757374206265206e6f6e2d6e656760448201526530ba34bb329760d11b606482015260840161009b565b60008212156101de5760405162461bcd60e51b815260206004820152602660248201527f50726963696e674b65726e656c3a204e206d757374206265206e6f6e2d6e656760448201526530ba34bb329760d11b606482015260840161009b565b69d3c21bcecceda100000060006101f484610c93565b905080841315610a74578560000361024e5760405162461bcd60e51b815260206004820181905260248201527f50726963696e674b65726e656c3a204469766973696f6e206279207a65726f2e604482015260640161009b565b604051635c9f540960e11b8152600481018890526024810186905260009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063b93ea81290604401602060405180830381865af41580156102a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102cc9190610ed6565b604051635c9f540960e11b8152600481018990526024810187905290915060009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063b93ea81290604401602060405180830381865af4158015610329573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061034d9190610ed6565b604051635c9f540960e11b8152600481018a90526024810185905290915060009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063b93ea81290604401602060405180830381865af41580156103aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ce9190610ed6565b905081158015906103de57508015155b61042a5760405162461bcd60e51b815260206004820181905260248201527f50726963696e674b65726e656c3a204469766973696f6e206279207a65726f2e604482015260640161009b565b604051630788611560e31b8152600481018490526024810183905260009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__90633c4308a890604401602060405180830381865af4158015610484573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104a89190610ed6565b604051630788611560e31b8152600481018690526024810184905290915060009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__90633c4308a890604401602060405180830381865af4158015610505573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105299190610ed6565b604051637acc211b60e11b815260048101899052602481018d905290915060009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063f598423690604401602060405180830381865af4158015610586573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105aa9190610ed6565b604051637acc211b60e11b8152600481018a90526024810187905290915060009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063b93ea812908490839063f598423690604401602060405180830381865af4158015610611573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106359190610ed6565b6040516001600160e01b031960e085901b16815260048101929092526024820152604401602060405180830381865af4158015610676573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061069a9190610ed6565b604051637acc211b60e11b8152600481018b90526024810187905290915060009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063b93ea812908590839063f598423690604401602060405180830381865af4158015610701573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107259190610ed6565b6040516001600160e01b031960e085901b16815260048101929092526024820152604401602060405180830381865af4158015610766573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061078a9190610ed6565b604051630788611560e31b8152600481018690526024810182905290915060009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__90633c4308a890604401602060405180830381865af41580156107e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061080b9190610ed6565b604051630788611560e31b8152600481018890526024810185905273__$a07b0a54ee71e1e9cea8c760501dd024c5$__9163b93ea812918390633c4308a890604401602060405180830381865af415801561086a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061088e9190610ed6565b6040516001600160e01b031960e085901b16815260048101929092526024820152604401602060405180830381865af41580156108cf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108f39190610ed6565b604051630788611560e31b8152600481018990526024810184905290915060009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063a5f3c23b908e908390633c4308a890604401602060405180830381865af415801561095a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061097e9190610ed6565b6040516001600160e01b031960e085901b16815260048101929092526024820152604401602060405180830381865af41580156109bf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109e39190610ed6565b604051637acc211b60e11b8152600481018490526024810182905290915073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063f598423690604401602060405180830381865af4158015610a3d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a619190610ed6565b9c50505050505050505050505050610a7b565b6000925050505b949350505050565b60405163d6c1528b60e01b81526004810186905260ff8216602482015260009081908190819073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063d6c1528b90604401602060405180830381865af4158015610ae5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b099190610ed6565b60405163d6c1528b60e01b8152600481018a905260ff8716602482015273__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063d6c1528b90604401602060405180830381865af4158015610b62573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b869190610ed6565b60405163d6c1528b60e01b8152600481018a905260ff8816602482015273__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063d6c1528b90604401602060405180830381865af4158015610bdf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c039190610ed6565b60405163d6c1528b60e01b8152600481018a905260ff8916602482015273__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063d6c1528b90604401602060405180830381865af4158015610c5c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c809190610ed6565b929c919b50995090975095505050505050565b6040516370bcf92960e11b81526004810182905260009073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063e179f25290602401602060405180830381865af4158015610ce6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d0a9190610ed6565b92915050565b604051631c9e522360e11b81526004810184905260ff82166024820152600090819073__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063393ca44690604401602060405180830381865af4158015610d6e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d929190610ed6565b604051631c9e522360e11b81526004810186905260ff8516602482015273__$a07b0a54ee71e1e9cea8c760501dd024c5$__9063393ca44690604401602060405180830381865af4158015610deb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e0f9190610ed6565b91509150935093915050565b600080600080600060a08688031215610e3357600080fd5b85359450602086013593506040860135925060608601359150608086013560ff81168114610e6057600080fd5b809150509295509295909350565b60008060008060808587031215610e8457600080fd5b5050823594602084013594506040840135936060013592509050565b8082018281126000831280158216821582161715610ece57634e487b7160e01b600052601160045260246000fd5b505092915050565b600060208284031215610ee857600080fd5b505191905056fea26469706673582212204e2eebb0d0146fc4c7a9e8c6ba257d9b6ddd0e3b1fe49736ad45dce1923bf28464736f6c63430008120033";

type PricingKernelConstructorParams =
  | [linkLibraryAddresses: PricingKernelLibraryAddresses, signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PricingKernelConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => {
  return (
    typeof xs[0] === "string" ||
    (Array.isArray as (arg: any) => arg is readonly any[])(xs[0]) ||
    "_isInterface" in xs[0]
  );
};

export class PricingKernel__factory extends ContractFactory {
  constructor(...args: PricingKernelConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      const [linkLibraryAddresses, signer] = args;
      super(
        _abi,
        PricingKernel__factory.linkBytecode(linkLibraryAddresses),
        signer
      );
    }
  }

  static linkBytecode(
    linkLibraryAddresses: PricingKernelLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$a07b0a54ee71e1e9cea8c760501dd024c5\\$__", "g"),
      linkLibraryAddresses["contracts/lib/FixidityLib.sol:FixidityLib"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PricingKernel> {
    return super.deploy(overrides || {}) as Promise<PricingKernel>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PricingKernel {
    return super.attach(address) as PricingKernel;
  }
  connect(signer: Signer): PricingKernel__factory {
    return super.connect(signer) as PricingKernel__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PricingKernelInterface {
    return new utils.Interface(_abi) as PricingKernelInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PricingKernel {
    return new Contract(address, _abi, signerOrProvider) as PricingKernel;
  }
}

export interface PricingKernelLibraryAddresses {
  ["contracts/lib/FixidityLib.sol:FixidityLib"]: string;
}
