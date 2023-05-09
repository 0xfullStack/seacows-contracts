/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ERC3525, ERC3525Interface } from "../ERC3525";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
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
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_approved",
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
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "ApprovalValue",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "metadataDescriptor",
        type: "address",
      },
    ],
    name: "SetMetadataDescriptor",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_oldSlot",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_newSlot",
        type: "uint256",
      },
    ],
    name: "SlotChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "TransferValue",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "operator_",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value_",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
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
        name: "tokenId_",
        type: "uint256",
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
    inputs: [],
    name: "contractURI",
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
        name: "tokenId_",
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
        name: "owner_",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator_",
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
    inputs: [],
    name: "metadataDescriptor",
    outputs: [
      {
        internalType: "contract IERC3525MetadataDescriptor",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
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
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "owner_",
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
        name: "from_",
        type: "address",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from_",
        type: "address",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator_",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved_",
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
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "slotOf",
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
        name: "slot_",
        type: "uint256",
      },
    ],
    name: "slotURI",
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
        name: "index_",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
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
        name: "owner_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index_",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
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
        name: "tokenId_",
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
    inputs: [],
    name: "totalSupply",
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
        name: "fromTokenId_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value_",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "uint256",
        name: "newTokenId",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from_",
        type: "address",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fromTokenId_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "toTokenId_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value_",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "valueDecimals",
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
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002ecc38038062002ecc833981016040819052620000349162000134565b600062000042848262000248565b50600162000051838262000248565b506002805460ff191660ff9290921691909117905550620003149050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200009757600080fd5b81516001600160401b0380821115620000b457620000b46200006f565b604051601f8301601f19908116603f01168101908282118183101715620000df57620000df6200006f565b81604052838152602092508683858801011115620000fc57600080fd5b600091505b8382101562000120578582018301518183018401529082019062000101565b600093810190920192909252949350505050565b6000806000606084860312156200014a57600080fd5b83516001600160401b03808211156200016257600080fd5b620001708783880162000085565b945060208601519150808211156200018757600080fd5b50620001968682870162000085565b925050604084015160ff81168114620001ae57600080fd5b809150509250925092565b600181811c90821680620001ce57607f821691505b602082108103620001ef57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200024357600081815260208120601f850160051c810160208610156200021e5750805b601f850160051c820191505b818110156200023f578281556001016200022a565b5050505b505050565b81516001600160401b038111156200026457620002646200006f565b6200027c81620002758454620001b9565b84620001f5565b602080601f831160018114620002b457600084156200029b5750858301515b600019600386901b1c1916600185901b1785556200023f565b600085815260208120601f198616915b82811015620002e557888601518255948401946001909101908401620002c4565b5085821015620003045787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b612ba880620003246000396000f3fe6080604052600436106101815760003560e01c80634f6ccce7116100d15780639cc7f7081161008a578063c87b56dd11610064578063c87b56dd14610416578063e345e0bc14610436578063e8a3d48514610456578063e985e9c51461046b57600080fd5b80639cc7f708146103c3578063a22cb465146103e3578063b88d4fde1461040357600080fd5b80634f6ccce71461031b5780636352211e1461033b57806370a082311461035b578063840f71131461037b5780638cb0a5111461039b57806395d89b41146103ae57600080fd5b806318160ddd1161013e5780632f745c59116101185780632f745c59146102b3578063310ed7f0146102d35780633e7e8669146102e657806342842e0e1461030857600080fd5b806318160ddd1461026b57806323b872dd14610280578063263f3e7e1461029357600080fd5b806301ffc9a71461018657806306fdde03146101bb578063081812fc146101dd578063095ea7b31461021557806309c3dd871461022a5780630f485c021461024a575b600080fd5b34801561019257600080fd5b506101a66101a13660046124df565b6104b8565b60405190151581526020015b60405180910390f35b3480156101c757600080fd5b506101d061055b565b6040516101b2919061254c565b3480156101e957600080fd5b506101fd6101f836600461255f565b6105ed565b6040516001600160a01b0390911681526020016101b2565b61022861022336600461258f565b61063f565b005b34801561023657600080fd5b506101d061024536600461255f565b610723565b61025d6102583660046125b9565b610815565b6040519081526020016101b2565b34801561027757600080fd5b5060055461025d565b61022861028e3660046125ee565b61084d565b34801561029f57600080fd5b5061025d6102ae36600461255f565b61087e565b3480156102bf57600080fd5b5061025d6102ce36600461258f565b6108c6565b6102286102e136600461261a565b610967565b3480156102f257600080fd5b5060025460405160ff90911681526020016101b2565b6102286103163660046125ee565b61097d565b34801561032757600080fd5b5061025d61033636600461255f565b610998565b34801561034757600080fd5b506101fd61035636600461255f565b610a29565b34801561036757600080fd5b5061025d610376366004612646565b610ac5565b34801561038757600080fd5b506008546101fd906001600160a01b031681565b6102286103a93660046125b9565b610b4d565b3480156103ba57600080fd5b506101d0610c0c565b3480156103cf57600080fd5b5061025d6103de36600461255f565b610c1b565b3480156103ef57600080fd5b506102286103fe36600461266f565b610c63565b610228610411366004612715565b610c72565b34801561042257600080fd5b506101d061043136600461255f565b610ca4565b34801561044257600080fd5b5061025d6104513660046127c0565b610d43565b34801561046257600080fd5b506101d0610d77565b34801561047757600080fd5b506101a66104863660046127ec565b6001600160a01b0391821660009081526007602090815260408083209390941682526002909201909152205460ff1690565b60006001600160e01b031982166301ffc9a760e01b14806104e957506001600160e01b03198216630354d60560e61b145b8061050457506001600160e01b031982166380ac58cd60e01b145b8061051f57506001600160e01b031982166370b0048160e11b145b8061053a57506001600160e01b0319821663780e9d6360e01b145b8061055557506001600160e01b03198216635b5e139f60e01b145b92915050565b60606000805461056a90612816565b80601f016020809104026020016040519081016040528092919081815260200182805461059690612816565b80156105e35780601f106105b8576101008083540402835291602001916105e3565b820191906000526020600020905b8154815290600101906020018083116105c657829003601f168201915b5050505050905090565b60006105f882610e71565b60008281526006602052604090205460058054909190811061061c5761061c612850565b60009182526020909120600460069092020101546001600160a01b031692915050565b600061064a82610a29565b9050806001600160a01b0316836001600160a01b0316036106865760405162461bcd60e51b815260040161067d90612866565b60405180910390fd5b336001600160a01b03821614806106a257506106a28133610486565b6107145760405162461bcd60e51b815260206004820152603960248201527f455243333532353a20617070726f76652063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f76656420666f7220616c6c00000000000000606482015260840161067d565b61071e8383610ec5565b505050565b6060600061073c60408051602081019091526000815290565b6008549091506001600160a01b031661079c57600081511161076d576040518060200160405280600081525061080e565b8061077784610f5c565b6040516020016107889291906128a8565b60405160208183030381529060405261080e565b600854604051633601bfc560e11b8152600481018590526001600160a01b0390911690636c037f8a906024015b600060405180830381865afa1580156107e6573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261080e91908101906128e8565b9392505050565b6000610822338584610fef565b61082b8461107f565b9050610842838261083b8761087e565b6000611089565b61080e8482846111b3565b61085733826114ab565b6108735760405162461bcd60e51b815260040161067d9061295f565b61071e83838361152e565b600061088982610e71565b6000828152600660205260409020546005805490919081106108ad576108ad612850565b9060005260206000209060060201600101549050919050565b60006108d183610ac5565b821061092a5760405162461bcd60e51b815260206004820152602260248201527f455243333532353a206f776e657220696e646578206f7574206f6620626f756e604482015261647360f01b606482015260840161067d565b6001600160a01b038316600090815260076020526040902080548390811061095457610954612850565b9060005260206000200154905092915050565b610972338483610fef565b61071e8383836111b3565b61071e83838360405180602001604052806000815250610c72565b60006109a360055490565b82106109fd5760405162461bcd60e51b815260206004820152602360248201527f455243333532353a20676c6f62616c20696e646578206f7574206f6620626f756044820152626e647360e81b606482015260840161067d565b60058281548110610a1057610a10612850565b9060005260206000209060060201600001549050919050565b6000610a3482610e71565b600082815260066020526040902054600580549091908110610a5857610a58612850565b60009182526020909120600360069092020101546001600160a01b0316905080610ac05760405162461bcd60e51b8152602060048201526019602482015278115490cccd4c8d4e881a5b9d985b1a59081d1bdad95b881251603a1b604482015260640161067d565b919050565b60006001600160a01b038216610b315760405162461bcd60e51b815260206004820152602b60248201527f455243333532353a2062616c616e636520717565727920666f7220746865207a60448201526a65726f206164647265737360a81b606482015260840161067d565b506001600160a01b031660009081526007602052604090205490565b6000610b5884610a29565b9050806001600160a01b0316836001600160a01b031603610b8b5760405162461bcd60e51b815260040161067d90612866565b610b9533856114ab565b610bfb5760405162461bcd60e51b815260206004820152603160248201527f455243333532353a20617070726f76652063616c6c6572206973206e6f74206f6044820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606482015260840161067d565b610c0684848461168f565b50505050565b60606001805461056a90612816565b6000610c2682610e71565b600082815260066020526040902054600580549091908110610c4a57610c4a612850565b9060005260206000209060060201600201549050919050565b610c6e3383836117c7565b5050565b610c7c33836114ab565b610c985760405162461bcd60e51b815260040161067d9061295f565b610c0684848484611891565b6060610caf82610e71565b6000610cc660408051602081019091526000815290565b6008549091506001600160a01b0316610d12576000815111610cf7576040518060200160405280600081525061080e565b80610d0184610f5c565b6040516020016107889291906129b1565b6008546040516344a5a61760e11b8152600481018590526001600160a01b039091169063894b4c2e906024016107c9565b6000610d4e83610e71565b5060009182526004602090815260408084206001600160a01b0393909316845291905290205490565b60606000610d9060408051602081019091526000815290565b6008549091506001600160a01b0316610df0576000815111610dc15760405180602001604052806000815250610e6b565b80610dcb30611904565b604051602001610ddc9291906129e0565b604051602081830303815290604052610e6b565b600860009054906101000a90046001600160a01b03166001600160a01b031663725fa09c6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610e43573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610e6b91908101906128e8565b91505090565b610e7a8161191a565b610ec25760405162461bcd60e51b8152602060048201526019602482015278115490cccd4c8d4e881a5b9d985b1a59081d1bdad95b881251603a1b604482015260640161067d565b50565b600081815260066020526040902054600580548492908110610ee957610ee9612850565b6000918252602090912060069091020160040180546001600160a01b0319166001600160a01b0392831617905581908316610f2382610a29565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60606000610f6983611966565b600101905060008167ffffffffffffffff811115610f8957610f896126a6565b6040519080825280601f01601f191660200182016040528015610fb3576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a8504945084610fbd57509392505050565b6000610ffb8385610d43565b905061100784846114ab565b15801561101657506000198114155b15610c06578181101561106b5760405162461bcd60e51b815260206004820152601f60248201527f455243333532353a20696e73756666696369656e7420616c6c6f77616e636500604482015260640161067d565b610c06838561107a8585612a3a565b61168f565b6000610555611a3e565b6001600160a01b0384166110e95760405162461bcd60e51b815260206004820152602160248201527f455243333532353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b606482015260840161067d565b826000036111435760405162461bcd60e51b815260206004820152602160248201527f455243333532353a2063616e6e6f74206d696e74207a65726f20746f6b656e496044820152601960fa1b606482015260840161067d565b61114c8361191a565b156111995760405162461bcd60e51b815260206004820152601d60248201527f455243333532353a20746f6b656e20616c7265616479206d696e746564000000604482015260640161067d565b6111a4848484611a55565b6111ae8382611b1b565b610c06565b6111bc8361191a565b6112185760405162461bcd60e51b815260206004820152602760248201527f455243333532353a207472616e736665722066726f6d20696e76616c696420746044820152661bdad95b88125160ca1b606482015260840161067d565b6112218261191a565b61127b5760405162461bcd60e51b815260206004820152602560248201527f455243333532353a207472616e7366657220746f20696e76616c696420746f6b604482015264195b88125160da1b606482015260840161067d565b60008381526006602052604081205460058054909190811061129f5761129f612850565b90600052602060002090600602019050600060056006600086815260200190815260200160002054815481106112d7576112d7612850565b90600052602060002090600602019050828260020154101561134e5760405162461bcd60e51b815260206004820152602a60248201527f455243333532353a20696e73756666696369656e742062616c616e636520666f60448201526939103a3930b739b332b960b11b606482015260840161067d565b80600101548260010154146113bc5760405162461bcd60e51b815260206004820152602e60248201527f455243333532353a207472616e7366657220746f20746f6b656e20776974682060448201526d191a5999995c995b9d081cdb1bdd60921b606482015260840161067d565b828260020160008282546113d09190612a3a565b92505081905550828160020160008282546113eb9190612a4d565b9091555050604051838152849086907f0b2aac84f3ec956911fd78eae5311062972ff949f38412e8da39069d9f068cc69060200160405180910390a361144285858560405180602001604052806000815250611ba0565b6114a45760405162461bcd60e51b815260206004820152602d60248201527f455243333532353a207472616e736665722072656a656374656420627920455260448201526c21999a991aa932b1b2b4bb32b960991b606482015260840161067d565b5050505050565b6000806114b783610a29565b9050806001600160a01b0316846001600160a01b0316148061150257506001600160a01b038082166000908152600760209081526040808320938816835260029093019052205460ff165b806115265750836001600160a01b031661151b846105ed565b6001600160a01b0316145b949350505050565b826001600160a01b031661154182610a29565b6001600160a01b0316146115a35760405162461bcd60e51b8152602060048201526024808201527f455243333532353a207472616e736665722066726f6d20696e76616c6964206f6044820152633bb732b960e11b606482015260840161067d565b6001600160a01b0382166116075760405162461bcd60e51b815260206004820152602560248201527f455243333532353a207472616e7366657220746f20746865207a65726f206164604482015264647265737360d81b606482015260840161067d565b60006116128261087e565b9050600061161f83610c1b565b905061162c600084610ec5565b61163583611cd5565b61163f8584611d80565b6116498484611ea1565b82846001600160a01b0316866001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a46114a4565b6001600160a01b0382166116f85760405162461bcd60e51b815260206004820152602a60248201527f455243333532353a20617070726f76652076616c756520746f20746865207a65604482015269726f206164647265737360b01b606482015260840161067d565b6117028284611f2a565b6117685760008381526006602052604090205460058054909190811061172a5761172a612850565b60009182526020808320600692909202909101600501805460018101825590835291200180546001600160a01b0319166001600160a01b0384161790555b60008381526004602090815260408083206001600160a01b038616808552908352928190208490555183815285917f621b050de0ad08b51d19b48b3e6df75348c4de6bdd93e81b252ca62e28265b1b91015b60405180910390a3505050565b816001600160a01b0316836001600160a01b0316036118285760405162461bcd60e51b815260206004820152601a60248201527f455243333532353a20617070726f766520746f2063616c6c6572000000000000604482015260640161067d565b6001600160a01b0383811660008181526007602090815260408083209487168084526002909501825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3191016117ba565b61189c84848461152e565b6118a884848484611ffd565b610c065760405162461bcd60e51b815260206004820152602760248201527f455243333532353a207472616e7366657220746f206e6f6e204552433732315260448201526632b1b2b4bb32b960c91b606482015260840161067d565b60606105556001600160a01b0383166014612146565b60055460009015801590610555575060008281526006602052604090205460058054849290811061194d5761194d612850565b9060005260206000209060060201600001541492915050565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b83106119a55772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef810000000083106119d1576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc1000083106119ef57662386f26fc10000830492506010015b6305f5e1008310611a07576305f5e100830492506008015b6127108310611a1b57612710830492506004015b60648310611a2d576064830492506002015b600a83106105555760010192915050565b6000611a4e600380546001019055565b5060035490565b6040805160c081018252838152602080820184905260008284018190526001600160a01b038716606084015260808301819052835181815291820190935260a08201529050611aa3816122e2565b611aad8484611ea1565b60405183906001600160a01b038616906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a4816000847fe4f48c240d3b994948aa54f3e2f5fca59263dfe1d52b6e4cf39a5d249b5ccb6560405160405180910390a450505050565b600082815260066020526040902054600580548392908110611b3f57611b3f612850565b90600052602060002090600602016002016000828254611b5f9190612a4d565b909155505060405181815282906000907f0b2aac84f3ec956911fd78eae5311062972ff949f38412e8da39069d9f068cc69060200160405180910390a35050565b600080611bac85610a29565b90506001600160a01b0381163b15158015611c3057506040516301ffc9a760e01b8152629ce20b60e01b60048201526001600160a01b038216906301ffc9a790602401602060405180830381865afa158015611c0c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611c309190612a60565b15611cc957604051629ce20b60e01b81526000906001600160a01b03831690629ce20b90611c6a9033908b908b908b908b90600401612a7d565b6020604051808303816000875af1158015611c89573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611cad9190612abb565b6001600160e01b031916629ce20b60e01b149250611526915050565b50600195945050505050565b600081815260066020526040812054600580549091908110611cf957611cf9612850565b600091825260208220600560069092020190810154909250905b81811015611d71576000836005018281548110611d3257611d32612850565b60009182526020808320909101548783526004825260408084206001600160a01b03909216845291528120555080611d6981612ad8565b915050611d13565b5061071e600583016000612431565b600081815260066020526040812054600580549091908110611da457611da4612850565b6000918252602080832060069290920290910160030180546001600160a01b0319166001600160a01b0394851617905591841681526007909152604081208054909190611df390600190612a3a565b90506000826000018281548110611e0c57611e0c612850565b90600052602060002001549050600083600101600086815260200190815260200160002054905081846000018281548110611e4957611e49612850565b60009182526020808320909101929092558381526001860190915260408082208390558682528120558354849080611e8357611e83612af1565b60019003818190600052602060002001600090559055505050505050565b600081815260066020526040902054600580548492908110611ec557611ec5612850565b6000918252602080832060069290920290910160030180546001600160a01b0319166001600160a01b03948516179055939091168152600780845260408083208054858552600182810188529285208190559286529082018155825292902090910155565b600081815260066020526040812054600580548392908110611f4e57611f4e612850565b6000918252602082206005600690920201015491505b81811015611ff257600084815260066020526040902054600580546001600160a01b03881692908110611f9957611f99612850565b90600052602060002090600602016005018281548110611fbb57611fbb612850565b6000918252602090912001546001600160a01b031603611fe057600192505050610555565b80611fea81612ad8565b915050611f64565b506000949350505050565b60006001600160a01b0384163b1561213e57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290612041903390899088908890600401612b07565b6020604051808303816000875af192505050801561207c575060408051601f3d908101601f1916820190925261207991810190612abb565b60015b612124573d8080156120aa576040519150601f19603f3d011682016040523d82523d6000602084013e6120af565b606091505b50805160000361211c5760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606482015260840161067d565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050611526565b506001611526565b60606000612155836002612b44565b612160906002612a4d565b67ffffffffffffffff811115612178576121786126a6565b6040519080825280601f01601f1916602001820160405280156121a2576020820181803683370190505b509050600360fc1b816000815181106121bd576121bd612850565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106121ec576121ec612850565b60200101906001600160f81b031916908160001a9053506000612210846002612b44565b61221b906001612a4d565b90505b6001811115612293576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061224f5761224f612850565b1a60f81b82828151811061226557612265612850565b60200101906001600160f81b031916908160001a90535060049490941c9361228c81612b5b565b905061221e565b50831561080e5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161067d565b600580548251600090815260066020818152604080842085905560018501865594909252845192027f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db08101928355818501517f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db1820155928401517f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db284015560608401517f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db3840180546001600160a01b039283166001600160a01b03199182161790915560808601517f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db48601805491909316911617905560a084015180518594610c06937f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db590910192019061244f565b5080546000825590600052602060002090810190610ec291906124b4565b8280548282559060005260206000209081019282156124a4579160200282015b828111156124a457825182546001600160a01b0319166001600160a01b0390911617825560209092019160019091019061246f565b506124b09291506124b4565b5090565b5b808211156124b057600081556001016124b5565b6001600160e01b031981168114610ec257600080fd5b6000602082840312156124f157600080fd5b813561080e816124c9565b60005b838110156125175781810151838201526020016124ff565b50506000910152565b600081518084526125388160208601602086016124fc565b601f01601f19169290920160200192915050565b60208152600061080e6020830184612520565b60006020828403121561257157600080fd5b5035919050565b80356001600160a01b0381168114610ac057600080fd5b600080604083850312156125a257600080fd5b6125ab83612578565b946020939093013593505050565b6000806000606084860312156125ce57600080fd5b833592506125de60208501612578565b9150604084013590509250925092565b60008060006060848603121561260357600080fd5b61260c84612578565b92506125de60208501612578565b60008060006060848603121561262f57600080fd5b505081359360208301359350604090920135919050565b60006020828403121561265857600080fd5b61080e82612578565b8015158114610ec257600080fd5b6000806040838503121561268257600080fd5b61268b83612578565b9150602083013561269b81612661565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156126e5576126e56126a6565b604052919050565b600067ffffffffffffffff821115612707576127076126a6565b50601f01601f191660200190565b6000806000806080858703121561272b57600080fd5b61273485612578565b935061274260208601612578565b925060408501359150606085013567ffffffffffffffff81111561276557600080fd5b8501601f8101871361277657600080fd5b8035612789612784826126ed565b6126bc565b81815288602083850101111561279e57600080fd5b8160208401602083013760006020838301015280935050505092959194509250565b600080604083850312156127d357600080fd5b823591506127e360208401612578565b90509250929050565b600080604083850312156127ff57600080fd5b61280883612578565b91506127e360208401612578565b600181811c9082168061282a57607f821691505b60208210810361284a57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052603260045260246000fd5b60208082526022908201527f455243333532353a20617070726f76616c20746f2063757272656e74206f776e60408201526132b960f11b606082015260800190565b600083516128ba8184602088016124fc565b64736c6f742f60d81b90830190815283516128dc8160058401602088016124fc565b01600501949350505050565b6000602082840312156128fa57600080fd5b815167ffffffffffffffff81111561291157600080fd5b8201601f8101841361292257600080fd5b8051612930612784826126ed565b81815285602083850101111561294557600080fd5b6129568260208301602086016124fc565b95945050505050565b60208082526032908201527f455243333532353a207472616e736665722063616c6c6572206973206e6f74206040820152711bdddb995c881b9bdc88185c1c1c9bdd995960721b606082015260800190565b600083516129c38184602088016124fc565b8351908301906129d78183602088016124fc565b01949350505050565b600083516129f28184602088016124fc565b68636f6e74726163742f60b81b9083019081528351612a188160098401602088016124fc565b01600901949350505050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561055557610555612a24565b8082018082111561055557610555612a24565b600060208284031215612a7257600080fd5b815161080e81612661565b60018060a01b038616815284602082015283604082015282606082015260a060808201526000612ab060a0830184612520565b979650505050505050565b600060208284031215612acd57600080fd5b815161080e816124c9565b600060018201612aea57612aea612a24565b5060010190565b634e487b7160e01b600052603160045260246000fd5b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090612b3a90830184612520565b9695505050505050565b808202811582820484141761055557610555612a24565b600081612b6a57612b6a612a24565b50600019019056fea26469706673582212208d8aa0b5b2514fa9d2fb6c69ee1afbea00a63b971e597694c4049044f71f7f5a64736f6c63430008120033";

export class ERC3525__factory extends ContractFactory {
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
    name_: string,
    symbol_: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC3525> {
    return super.deploy(
      name_,
      symbol_,
      decimals_,
      overrides || {}
    ) as Promise<ERC3525>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      name_,
      symbol_,
      decimals_,
      overrides || {}
    );
  }
  attach(address: string): ERC3525 {
    return super.attach(address) as ERC3525;
  }
  connect(signer: Signer): ERC3525__factory {
    return super.connect(signer) as ERC3525__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC3525Interface {
    return new utils.Interface(_abi) as ERC3525Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC3525 {
    return new Contract(address, _abi, signerOrProvider) as ERC3525;
  }
}
