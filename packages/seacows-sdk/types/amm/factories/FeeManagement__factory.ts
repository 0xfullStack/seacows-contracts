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
    name: "FM_NON_FEE_MANAGER",
    type: "error",
  },
  {
    inputs: [],
    name: "FM_NON_ROYALTY_FEE_MANAGER",
    type: "error",
  },
  {
    inputs: [],
    name: "RM_NON_ROYALTY_FEE_MANAGER",
    type: "error",
  },
  {
    inputs: [],
    name: "SPMD_ONLY_POSITION_MANAGER",
    type: "error",
  },
  {
    inputs: [],
    name: "SPMD_PAUSED",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_BELOW_NFT_OUT_MIN_CONSTRAINT",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_BELOW_TOKEN_OUT_MIN_CONSTRAINT",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_ETH_TRANSFER_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_EXPIRED",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_INSUFFICIENT_AMOUNT",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_INSUFFICIENT_LIQUIDITY",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_INSUFFICIENT_MINIMUM_LIQUIDITY_AMOUNT",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_INVALID_TOKEN_ID",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_ONLY_BURNABLE_WHEN_CLEARED",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_ONLY_PAIR_CAN_BURN",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_ONLY_PAIR_CAN_MINT",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_PAIR_NOT_EXIST",
    type: "error",
  },
  {
    inputs: [],
    name: "SPM_TOKEN_TRANSFER_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "SSB_ETH_TRANSFER_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "SSB_INSUFFICIENT_AMOUNT",
    type: "error",
  },
  {
    inputs: [],
    name: "SSB_ONE_MORE_BLOCK_AT_LEAST",
    type: "error",
  },
  {
    inputs: [],
    name: "SSB_UNAUTHORIZED",
    type: "error",
  },
  {
    inputs: [],
    name: "STPF_PAIR_ALREADY_EXIST",
    type: "error",
  },
  {
    inputs: [],
    name: "STPF_ZERO_ADDRESS",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_EXCEED_NFT_OUT_MAX",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_FEE_OUT_OF_RANGE",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_INSUFFICIENT_INPUT_AMOUNT",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_INSUFFICIENT_LIQUIDITY",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_INSUFFICIENT_LIQUIDITY_BURNED",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_INSUFFICIENT_LIQUIDITY_MINTED",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_INSUFFICIENT_MIN_FEE",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_INSUFFICIENT_NFT_TO_WITHDRAW",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_INSUFFICIENT_OUTPUT_AMOUNT",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_INVALID_FEE",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_INVALID_TO",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_K",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_SKIM_QUANTITY_MISMATCH",
    type: "error",
  },
  {
    inputs: [],
    name: "STP_UNAUTHORIZED",
    type: "error",
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
  "0x608060405234801561001057600080fd5b5060018054336001600160a01b031991821681179092556002805482168317905560038054909116909117905561029d8061004c6000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063a11b07121161005b578063a11b0712146100ef578063acb3cf8114610100578063d0fb020314610113578063f46901ed1461012457600080fd5b8063017e7e581461008d578063472d35b9146100b657806384a608e2146100cb57806387e4401f146100de575b600080fd5b6003546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b6100c96100c4366004610237565b610137565b005b6100c96100d9366004610237565b610161565b6002546001600160a01b031661009a565b6000546001600160a01b031661009a565b6100c961010e366004610237565b61018b565b6001546001600160a01b031661009a565b6100c9610132366004610237565b6101b5565b61013f6101df565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b61016961020c565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b61019361020c565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b6101bd6101df565b600380546001600160a01b0319166001600160a01b0392909216919091179055565b6001546001600160a01b0316331461020a576040516324fb7cf960e01b815260040160405180910390fd5b565b6002546001600160a01b0316331461020a5760405163be221f5760e01b815260040160405180910390fd5b60006020828403121561024957600080fd5b81356001600160a01b038116811461026057600080fd5b939250505056fea26469706673582212208f5bde5baacbda7eacd83957f5f127862ac426cd5225df2422a4c0f0295f02c764736f6c634300080d0033";

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
