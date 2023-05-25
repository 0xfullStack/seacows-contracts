/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockSeacowsComplement,
  MockSeacowsComplementInterface,
} from "../MockSeacowsComplement";

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
    name: "amount0Out",
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
    name: "amount1Out",
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
    name: "complements",
    outputs: [
      {
        internalType: "int256",
        name: "_complement0",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "_complement1",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenAmountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_nftAmountOut",
        type: "uint256",
      },
    ],
    name: "getComplemenetedAssetsOut",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenAmountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nftAmountOut",
        type: "uint256",
      },
      {
        internalType: "int256",
        name: "tokenComplementAdjusted",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "nftComplementAdjusted",
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
  {
    inputs: [],
    name: "nftComplement",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount0Out",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount1Out",
        type: "uint256",
      },
    ],
    name: "updateComplement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061056e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c806369eedcde1161006657806369eedcde146100f95780637a97c37a1461012c5780639a2fe1bd146101355780639e75baa71461013d578063a4ac5c1d1461014c57600080fd5b806312c6a224146100985780632c586d9c146100b4578063568f771a146100dc578063670dfa14146100e4575b600080fd5b6100a160035481565b6040519081526020015b60405180910390f35b6100c76100c236600461040f565b610154565b604080519283526020830191909152016100ab565b6100c761016c565b6100f76100f2366004610439565b610189565b005b61010c610107366004610439565b61019d565b6040805194855260208501939093529183015260608201526080016100ab565b6100a160025481565b6001546100a1565b6100a1670de0b6b3a764000081565b6000546100a1565b60008061016184846102ab565b915091509250929050565b60008061017860005490565b915061018360015490565b90509091565b61019382826103b4565b6003556002555050565b6000808080806101ad87876103d2565b90506000866001546101bf9190610471565b9050670de0b6b3a76400008110610261576101ec670de0b6b3a76400006101e683826103d2565b906103e7565b94506101f88582610484565b9250868510610235576000610211836101e68a89610484565b905061021d818a610484565b96508060005461022d9190610497565b9450506102a0565b6000610245836101e6888b610484565b9050610251818a610471565b96508060005461022d91906104bf565b8660015461026f9190610471565b6000955092508461028088846103e7565b905061028c818a610471565b96508060005461029c91906104bf565b9450505b505092959194509250565b600080546040516370a0823160e01b81523060048201528291906001600160a01b038616906370a0823190602401602060405180830381865afa1580156102f6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061031a91906104e6565b61032491906104bf565b6001546040516370a0823160e01b8152306004820152919350906103a190670de0b6b3a7640000906001600160a01b038716906370a0823190602401602060405180830381865afa15801561037d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101e691906104e6565b6103ab9190610484565b90509250929050565b6000806103c1848461019d565b600155600055909590945092505050565b60006103de82846104ff565b90505b92915050565b60006103de8284610521565b80356001600160a01b038116811461040a57600080fd5b919050565b6000806040838503121561042257600080fd5b61042b836103f3565b91506103ab602084016103f3565b6000806040838503121561044c57600080fd5b50508035926020909101359150565b634e487b7160e01b600052601160045260246000fd5b808201808211156103e1576103e161045b565b818103818111156103e1576103e161045b565b80820182811260008312801582168215821617156104b7576104b761045b565b505092915050565b81810360008312801583831316838312821617156104df576104df61045b565b5092915050565b6000602082840312156104f857600080fd5b5051919050565b60008261051c57634e487b7160e01b600052601260045260246000fd5b500490565b80820281158282048414176103e1576103e161045b56fea2646970667358221220594b08eeea7f89e9477ae5cc6667334b1136674b05969dd161523afc0e17657464736f6c63430008120033";

export class MockSeacowsComplement__factory extends ContractFactory {
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
  ): Promise<MockSeacowsComplement> {
    return super.deploy(overrides || {}) as Promise<MockSeacowsComplement>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockSeacowsComplement {
    return super.attach(address) as MockSeacowsComplement;
  }
  connect(signer: Signer): MockSeacowsComplement__factory {
    return super.connect(signer) as MockSeacowsComplement__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockSeacowsComplementInterface {
    return new utils.Interface(_abi) as MockSeacowsComplementInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockSeacowsComplement {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MockSeacowsComplement;
  }
}
