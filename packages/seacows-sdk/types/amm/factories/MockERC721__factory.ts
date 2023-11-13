/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MockERC721, MockERC721Interface } from "../MockERC721";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "salePrice",
        type: "uint256",
      },
    ],
    name: "royaltyInfo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040518060400160405280600b81526020016a4d6f636b2045524337323160a81b815250604051806040016040528060078152602001664d45524337323160c81b81525081600090816200006791906200023c565b5060016200007682826200023c565b5050506200008c3360646200009260201b60201c565b62000308565b6127106001600160601b0382161115620001065760405162461bcd60e51b815260206004820152602a60248201527f455243323938313a20726f79616c7479206665652077696c6c206578636565646044820152692073616c65507269636560b01b60648201526084015b60405180910390fd5b6001600160a01b0382166200015e5760405162461bcd60e51b815260206004820152601960248201527f455243323938313a20696e76616c6964207265636569766572000000000000006044820152606401620000fd565b604080518082019091526001600160a01b039092168083526001600160601b039091166020909201829052600160a01b90910217600655565b634e487b7160e01b600052604160045260246000fd5b600181811c90821680620001c257607f821691505b602082108103620001e357634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200023757600081815260208120601f850160051c81016020861015620002125750805b601f850160051c820191505b8181101562000233578281556001016200021e565b5050505b505050565b81516001600160401b0381111562000258576200025862000197565b6200027081620002698454620001ad565b84620001e9565b602080601f831160018114620002a857600084156200028f5750858301515b600019600386901b1c1916600185901b17855562000233565b600085815260208120601f198616915b82811015620002d957888601518255948401946001909101908401620002b8565b5085821015620002f85787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b61145180620003186000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80636352211e11610097578063a22cb46511610066578063a22cb4651461021e578063b88d4fde14610231578063c87b56dd14610244578063e985e9c51461025757600080fd5b80636352211e146101cf5780636a627842146101e257806370a08231146101f557806395d89b411461021657600080fd5b8063095ea7b3116100d3578063095ea7b31461016257806323b872dd146101775780632a55205a1461018a57806342842e0e146101bc57600080fd5b806301ffc9a7146100fa57806306fdde0314610122578063081812fc14610137575b600080fd5b61010d610108366004610f74565b61026a565b60405190151581526020015b60405180910390f35b61012a610295565b6040516101199190610fe1565b61014a610145366004610ff4565b610327565b6040516001600160a01b039091168152602001610119565b610175610170366004611029565b61034e565b005b610175610185366004611053565b610468565b61019d61019836600461108f565b610499565b604080516001600160a01b039093168352602083019190915201610119565b6101756101ca366004611053565b610545565b61014a6101dd366004610ff4565b610560565b6101756101f03660046110b1565b6105c0565b6102086102033660046110b1565b6105e3565b604051908152602001610119565b61012a610669565b61017561022c3660046110cc565b610678565b61017561023f36600461111e565b610687565b61012a610252366004610ff4565b6106bf565b61010d6102653660046111fa565b610733565b60006001600160e01b0319821663152a902d60e11b148061028f575061028f82610761565b92915050565b6060600080546102a49061122d565b80601f01602080910402602001604051908101604052809291908181526020018280546102d09061122d565b801561031d5780601f106102f25761010080835404028352916020019161031d565b820191906000526020600020905b81548152906001019060200180831161030057829003601f168201915b5050505050905090565b600061033282610786565b506000908152600460205260409020546001600160a01b031690565b600061035982610560565b9050806001600160a01b0316836001600160a01b0316036103cb5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b03821614806103e757506103e78133610733565b6104595760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c00000060648201526084016103c2565b61046383836107e5565b505050565b6104723382610853565b61048e5760405162461bcd60e51b81526004016103c290611267565b6104638383836108b2565b60008281526007602090815260408083208151808301909252546001600160a01b038116808352600160a01b9091046001600160601b031692820192909252829161050e5750604080518082019091526006546001600160a01b0381168252600160a01b90046001600160601b031660208201525b60208101516000906127109061052d906001600160601b0316876112b4565b61053791906112d9565b915196919550909350505050565b61046383838360405180602001604052806000815250610687565b6000818152600260205260408120546001600160a01b03168061028f5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016103c2565b6105d2816105cd60085490565b610a16565b6105e0600880546001019055565b50565b60006001600160a01b03821661064d5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b60648201526084016103c2565b506001600160a01b031660009081526003602052604090205490565b6060600180546102a49061122d565b610683338383610ba1565b5050565b6106913383610853565b6106ad5760405162461bcd60e51b81526004016103c290611267565b6106b984848484610c6f565b50505050565b60606106ca82610786565b60006106e160408051602081019091526000815290565b90506000815111610701576040518060200160405280600081525061072c565b8061070b84610ca2565b60405160200161071c9291906112fb565b6040516020818303038152906040525b9392505050565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b0319821663152a902d60e11b148061028f575061028f82610d35565b6000818152600260205260409020546001600160a01b03166105e05760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016103c2565b600081815260046020526040902080546001600160a01b0319166001600160a01b038416908117909155819061081a82610560565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60008061085f83610560565b9050806001600160a01b0316846001600160a01b0316148061088657506108868185610733565b806108aa5750836001600160a01b031661089f84610327565b6001600160a01b0316145b949350505050565b826001600160a01b03166108c582610560565b6001600160a01b0316146108eb5760405162461bcd60e51b81526004016103c29061132a565b6001600160a01b03821661094d5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016103c2565b826001600160a01b031661096082610560565b6001600160a01b0316146109865760405162461bcd60e51b81526004016103c29061132a565b600081815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6001600160a01b038216610a6c5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016103c2565b6000818152600260205260409020546001600160a01b031615610ad15760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016103c2565b6000818152600260205260409020546001600160a01b031615610b365760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016103c2565b6001600160a01b038216600081815260036020908152604080832080546001019055848352600290915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b816001600160a01b0316836001600160a01b031603610c025760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016103c2565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b610c7a8484846108b2565b610c8684848484610d85565b6106b95760405162461bcd60e51b81526004016103c29061136f565b60606000610caf83610e86565b600101905060008167ffffffffffffffff811115610ccf57610ccf611108565b6040519080825280601f01601f191660200182016040528015610cf9576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a8504945084610d0357509392505050565b60006001600160e01b031982166380ac58cd60e01b1480610d6657506001600160e01b03198216635b5e139f60e01b145b8061028f57506301ffc9a760e01b6001600160e01b031983161461028f565b60006001600160a01b0384163b15610e7b57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610dc99033908990889088906004016113c1565b6020604051808303816000875af1925050508015610e04575060408051601f3d908101601f19168201909252610e01918101906113fe565b60015b610e61573d808015610e32576040519150601f19603f3d011682016040523d82523d6000602084013e610e37565b606091505b508051600003610e595760405162461bcd60e51b81526004016103c29061136f565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506108aa565b506001949350505050565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310610ec55772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310610ef1576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310610f0f57662386f26fc10000830492506010015b6305f5e1008310610f27576305f5e100830492506008015b6127108310610f3b57612710830492506004015b60648310610f4d576064830492506002015b600a831061028f5760010192915050565b6001600160e01b0319811681146105e057600080fd5b600060208284031215610f8657600080fd5b813561072c81610f5e565b60005b83811015610fac578181015183820152602001610f94565b50506000910152565b60008151808452610fcd816020860160208601610f91565b601f01601f19169290920160200192915050565b60208152600061072c6020830184610fb5565b60006020828403121561100657600080fd5b5035919050565b80356001600160a01b038116811461102457600080fd5b919050565b6000806040838503121561103c57600080fd5b6110458361100d565b946020939093013593505050565b60008060006060848603121561106857600080fd5b6110718461100d565b925061107f6020850161100d565b9150604084013590509250925092565b600080604083850312156110a257600080fd5b50508035926020909101359150565b6000602082840312156110c357600080fd5b61072c8261100d565b600080604083850312156110df57600080fd5b6110e88361100d565b9150602083013580151581146110fd57600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b6000806000806080858703121561113457600080fd5b61113d8561100d565b935061114b6020860161100d565b925060408501359150606085013567ffffffffffffffff8082111561116f57600080fd5b818701915087601f83011261118357600080fd5b81358181111561119557611195611108565b604051601f8201601f19908116603f011681019083821181831017156111bd576111bd611108565b816040528281528a60208487010111156111d657600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b6000806040838503121561120d57600080fd5b6112168361100d565b91506112246020840161100d565b90509250929050565b600181811c9082168061124157607f821691505b60208210810361126157634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b808202811582820484141761028f57634e487b7160e01b600052601160045260246000fd5b6000826112f657634e487b7160e01b600052601260045260246000fd5b500490565b6000835161130d818460208801610f91565b835190830190611321818360208801610f91565b01949350505050565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906113f490830184610fb5565b9695505050505050565b60006020828403121561141057600080fd5b815161072c81610f5e56fea2646970667358221220499ec1ebace60e894c0e6e7afb68b0a67044633ebb3befd195c5bd55be2fe56d64736f6c63430008120033";

export class MockERC721__factory extends ContractFactory {
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
  ): Promise<MockERC721> {
    return super.deploy(overrides || {}) as Promise<MockERC721>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockERC721 {
    return super.attach(address) as MockERC721;
  }
  connect(signer: Signer): MockERC721__factory {
    return super.connect(signer) as MockERC721__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC721Interface {
    return new utils.Interface(_abi) as MockERC721Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC721 {
    return new Contract(address, _abi, signerOrProvider) as MockERC721;
  }
}
