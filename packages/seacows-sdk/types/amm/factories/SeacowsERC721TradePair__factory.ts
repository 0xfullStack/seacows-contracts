/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SeacowsERC721TradePair,
  SeacowsERC721TradePairInterface,
} from "../SeacowsERC721TradePair";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nftIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenOut",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nftOut",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "Swap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve0",
        type: "uint112",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve1",
        type: "uint112",
      },
    ],
    name: "Sync",
    type: "event",
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
    name: "ONE_PERCENT",
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
    name: "PERCENTAGE_PRECISION",
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
    name: "POINT_FIVE_PERCENT",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "collection",
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
    name: "fee",
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
    inputs: [],
    name: "getComplementedBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nftBalance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint112",
        name: "_reserve0",
        type: "uint112",
      },
      {
        internalType: "uint112",
        name: "_reserve1",
        type: "uint112",
      },
      {
        internalType: "uint32",
        name: "_blockTimestampLast",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "address",
        name: "collection_",
        type: "address",
      },
      {
        internalType: "uint112",
        name: "fee_",
        type: "uint112",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "toTokenId",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "onERC3525Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
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
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "positionManager",
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
    name: "price0CumulativeLast",
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
    name: "price1CumulativeLast",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "skim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "slot",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenAmountOut",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "idsOut",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sync",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061226f806100206000396000f3fe608060405234801561001057600080fd5b506004361061018d5760003560e01c80639a2fe1bd116100de578063bb2eb4d211610097578063e5d4088e11610071578063e5d4088e14610383578063f78db9b814610396578063fc0c546a1461039e578063fff6cae9146103b157600080fd5b8063bb2eb4d214610369578063ddca3f4314610371578063e256888f1461037a57600080fd5b80639a2fe1bd146103075780639e75baa71461030f578063a0712d681461031e578063a4ac5c1d14610331578063a7439ac414610339578063ba36b92d1461035657600080fd5b80634b9bbb141161014b57806369eedcde1161012557806369eedcde14610289578063791b98bc146102bc5780637de1e536146102e157806393f0b340146102f457600080fd5b80634b9bbb14146102625780635909c0d5146102775780635a3d54931461028057600080fd5b80629ce20b1461019257806301ffc9a7146101cf5780630902f1ac146101f2578063150b7a021461022657806318160ddd146102445780631a88bc661461025a575b600080fd5b6101b16101a0366004611bb9565b629ce20b60e01b9695505050505050565b6040516001600160e01b031990911681526020015b60405180910390f35b6101e26101dd366004611c58565b6103b9565b60405190151581526020016101c6565b6101fa61040a565b604080516001600160701b03948516815293909216602084015263ffffffff16908201526060016101c6565b6101b1610234366004611cc9565b630a85bd0160e11b949350505050565b61024c610434565b6040519081526020016101c6565b61024c6104c2565b610275610270366004611e09565b610504565b005b61024c603a5481565b61024c603b5481565b61029c610297366004611e60565b610a08565b6040805194855260208501939093529183015260608201526080016101c6565b6035546001600160a01b03165b6040516001600160a01b0390911681526020016101c6565b6036546102c9906001600160a01b031681565b610275610302366004611e82565b610b10565b60345461024c565b61024c670de0b6b3a764000081565b61024c61032c366004611ed5565b610cc7565b60335461024c565b610341610e85565b604080519283526020830191909152016101c6565b610341610364366004611eee565b610eae565b61024c606481565b61024c60385481565b61024c61271081565b610275610391366004611eee565b6112d9565b61024c603281565b6037546102c9906001600160a01b031681565b6102756114fd565b60006301ffc9a760e01b6001600160e01b0319831614806103ea57506001600160e01b03198216630a85bd0160e11b145b8061040457506001600160e01b03198216629ce20b60e01b145b92915050565b6039546001600160701b0380821692600160701b830490911691600160e01b900463ffffffff1690565b60006104486035546001600160a01b031690565b6001600160a01b03166388200bb961045e6104c2565b6040518263ffffffff1660e01b815260040161047c91815260200190565b602060405180830381865afa158015610499573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104bd9190611f3c565b905090565b60006104d66035546001600160a01b031690565b60405163add21d2560e01b81523060048201526001600160a01b03919091169063add21d259060240161047c565b61050c611546565b600083118061051c575060008251115b6105795760405162461bcd60e51b815260206004820152602360248201527f536561636f77733a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b60648201526084015b60405180910390fd5b60008061058461040a565b5091509150816001600160701b0316851080156105aa5750806001600160701b03168451105b6105f65760405162461bcd60e51b815260206004820152601f60248201527f536561636f77733a20494e53554646494349454e545f4c4951554944495459006044820152606401610570565b60375460365460009182916001600160a01b039182169190811690871682148015906106345750806001600160a01b0316876001600160a01b031614155b6106765760405162461bcd60e51b8152602060048201526013602482015272536561636f77733a20494e56414c49445f544f60681b6044820152606401610570565b88156106f15760405163a9059cbb60e01b81526001600160a01b038881166004830152602482018b905283169063a9059cbb906044016020604051808303816000875af11580156106cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ef9190611f55565b505b8751156107ae5760005b88518110156107ac57816001600160a01b03166342842e0e308a8c858151811061072757610727611f77565b60209081029190910101516040516001600160e01b031960e086901b1681526001600160a01b0393841660048201529290911660248301526044820152606401600060405180830381600087803b15801561078157600080fd5b505af1158015610795573d6000803e3d6000fd5b5050505080806107a490611fa3565b9150506106fb565b505b6107b6610e85565b9094509250600091506107d49050886001600160701b038716611fbc565b83116107e15760006107fe565b6107f4886001600160701b038716611fbc565b6107fe9084611fbc565b90506000670de0b6b3a764000088516108179190611fcf565b61082a906001600160701b038716611fbc565b8311610837576000610869565b670de0b6b3a7640000885161084c9190611fcf565b61085f906001600160701b038716611fbc565b6108699084611fbc565b9050600082118061087a5750600081115b6108d15760405162461bcd60e51b815260206004820152602260248201527f536561636f77733a20494e53554646494349454e545f494e5055545f414d4f55604482015261139560f21b6064820152608401610570565b60006108fd6108eb6038548561159f90919063ffffffff16565b6108f78761271061159f565b906115b2565b9050600061090d8561271061159f565b905061093b61091f60026127106120ca565b6109356001600160701b038b8116908b1661159f565b9061159f565b610945838361159f565b10156109805760405162461bcd60e51b815260206004820152600a602482015269536561636f77733a204b60b01b6044820152606401610570565b505061098e848488886115be565b6001600160a01b038716337fd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822846109cd85670de0b6b3a76400006117b4565b8c516040805193845260208401929092529082018e9052606082015260800160405180910390a3505050505050610a0360018055565b505050565b600080808080610a1887876117b4565b9050600086603454610a2a91906120d9565b9050670de0b6b3a76400008110610ac657610a51670de0b6b3a764000061093583826117b4565b9450610a5d8582611fbc565b9250868510610a9a576000610a76836109358a89611fbc565b9050610a82818a611fbc565b965080603354610a9291906120ec565b945050610b05565b6000610aaa83610935888b611fbc565b9050610ab6818a6120d9565b965080603354610a929190612114565b86603454610ad491906120d9565b60009550925084610ae5888461159f565b9050610af1818a6120d9565b965080603354610b019190612114565b9450505b505092959194509250565b600054610100900460ff1615808015610b305750600054600160ff909116105b80610b4a5750303b158015610b4a575060005460ff166001145b610bad5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610570565b6000805460ff191660011790558015610bd0576000805461ff0019166101001790555b6064826001600160701b03161480610bf157506032826001600160701b0316145b610c2c5760405162461bcd60e51b815260206004820152600c60248201526b496e76616c6964205f66656560a01b6044820152606401610570565b60358054336001600160a01b0319918216179091556037805482166001600160a01b0387811691909117909155603680549092169085161790556001600160701b038216603855610c7b6117c6565b8015610cc1576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b6000610cd1611546565b600080610cdc61040a565b5091509150600080610cec610e85565b90925090506000610d06836001600160701b0387166115b2565b90506000610d1d836001600160701b0387166115b2565b90506000610d29610434565b905080600003610d5857610d51610d4c6001600160701b0385811690851661159f565b6117f5565b9750610da7565b610da46001600160701b0380891690610d739086168461159f565b610d7d9190612151565b6001600160701b0380891690610d959086168561159f565b610d9f9190612151565b6118d9565b97505b60008811610e155760405162461bcd60e51b815260206004820152603560248201527f536561636f77734552433732315472616465506169723a20494e5355464649436044820152741251539517d3125455525112551657d35253951151605a1b6064820152608401610570565b610e1f89896118ef565b610e2b858589896115be565b604080516001600160701b0380861682528416602082015233917f4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f910160405180910390a250505050505050610e8060018055565b919050565b6037546036546000918291610ea6916001600160a01b039081169116611959565b915091509091565b600080610eb9611546565b600080610ec461040a565b506037546036549294509092506001600160a01b039081169116600080610ee9610e85565b915091506000610f016035546001600160a01b031690565b6040516321761c7160e11b81523060048201526001600160a01b0391909116906342ec38e290602401602060405180830381865afa158015610f47573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f6b9190611f3c565b90506000610f816035546001600160a01b031690565b6001600160a01b0316639cc7f708836040518263ffffffff1660e01b8152600401610fae91815260200190565b602060405180830381865afa158015610fcb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fef9190611f3c565b90506000610ffb610434565b905080611008838761159f565b6110129190612151565b9a508061101f838661159f565b6110299190612151565b995060008b11801561103b575060008a115b6110a55760405162461bcd60e51b815260206004820152603560248201527f536561636f77734552433732315472616465506169723a20494e5355464649436044820152741251539517d3125455525112551657d09554939151605a1b6064820152608401610570565b6110af8b8b611a63565b8d51919c509a508a906110cb90670de0b6b3a764000090611fcf565b1461112e5760405162461bcd60e51b815260206004820152602d60248201527f536561636f77734552433732315472616465506169723a20494e56414c49445f60448201526c4944535f544f5f52454d4f564560981b6064820152608401610570565b6111388383611a81565b5060405163a9059cbb60e01b81526001600160a01b038d81166004830152602482018c905287169063a9059cbb906044016020604051808303816000875af1158015611188573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111ac9190611f55565b5060005b8b5181101561126157856001600160a01b03166342842e0e308f8f85815181106111dc576111dc611f77565b60209081029190910101516040516001600160e01b031960e086901b1681526001600160a01b0393841660048201529290911660248301526044820152606401600060405180830381600087803b15801561123657600080fd5b505af115801561124a573d6000803e3d6000fd5b50505050808061125990611fa3565b9150506111b0565b5061126a610e85565b909450925061127b84848a8a6115be565b604080518b8152602081018b90526001600160a01b038e169133917fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496910160405180910390a350505050505050506112d260018055565b9250929050565b6112e1611546565b6037546036546001600160a01b0391821691166000806112ff610e85565b86516039549294509092509061133a90670de0b6b3a764000090611334908590600160701b90046001600160701b03166115b2565b906117b4565b1461139d5760405162461bcd60e51b815260206004820152602d60248201527f536561636f77734552433732315472616465506169723a20534b494d5f51554160448201526c09ca892a8b2beaa9c9a82a8869609b1b6064820152608401610570565b6039546001600160a01b0385169063a9059cbb9088906113c79086906001600160701b03166115b2565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303816000875af1158015611412573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114369190611f55565b5060005b85518110156114eb57836001600160a01b03166342842e0e308989858151811061146657611466611f77565b60209081029190910101516040516001600160e01b031960e086901b1681526001600160a01b0393841660048201529290911660248301526044820152606401600060405180830381600087803b1580156114c057600080fd5b505af11580156114d4573d6000803e3d6000fd5b5050505080806114e390611fa3565b91505061143a565b50505050506114f960018055565b5050565b611505611546565b600080611510610e85565b603954919350915061153990839083906001600160701b0380821691600160701b9004166115be565b505061154460018055565b565b6002600154036115985760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610570565b6002600155565b60006115ab8284611fcf565b9392505050565b60006115ab8284611fbc565b6001600160701b0384118015906115dc57506001600160701b038311155b6116285760405162461bcd60e51b815260206004820181905260248201527f536561636f77734552433732315472616465506169723a204f564552464c4f576044820152606401610570565b600061163964010000000042612165565b60395490915060009061165990600160e01b900463ffffffff1683612179565b905060008163ffffffff1611801561167957506001600160701b03841615155b801561168d57506001600160701b03831615155b1561171c578063ffffffff166116b5856116a686611ab9565b6001600160e01b031690611ad2565b6001600160e01b03166116c89190611fcf565b603a60008282546116d991906120d9565b909155505063ffffffff81166116f2846116a687611ab9565b6001600160e01b03166117059190611fcf565b603b600082825461171691906120d9565b90915550505b6039805463ffffffff8416600160e01b026001600160e01b036001600160701b03898116600160701b9081026001600160e01b03199095168c83161794909417918216831794859055604080519382169282169290921783529290930490911660208201527f1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1910160405180910390a1505050505050565b60006115ab8284612151565b60018055565b600054610100900460ff166117ed5760405162461bcd60e51b815260040161057090612196565b611544611ae7565b60008160000361180757506000919050565b6000600161181484611b0e565b901c6001901b9050600181848161182d5761182d61213b565b048201901c905060018184816118455761184561213b565b048201901c9050600181848161185d5761185d61213b565b048201901c905060018184816118755761187561213b565b048201901c9050600181848161188d5761188d61213b565b048201901c905060018184816118a5576118a561213b565b048201901c905060018184816118bd576118bd61213b565b048201901c90506115ab818285816118d7576118d761213b565b045b60008183106118e857816115ab565b5090919050565b60355460405163f0e88e7f60e01b815260048101849052602481018390526001600160a01b039091169063f0e88e7f906044015b600060405180830381600087803b15801561193d57600080fd5b505af1158015611951573d6000803e3d6000fd5b505050505050565b6033546040516370a0823160e01b815230600482015260009182916001600160a01b038616906370a0823190602401602060405180830381865afa1580156119a5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119c99190611f3c565b6119d39190612114565b6034546040516370a0823160e01b815230600482015291935090611a5090670de0b6b3a7640000906001600160a01b038716906370a0823190602401602060405180830381865afa158015611a2c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109359190611f3c565b611a5a9190611fbc565b90509250929050565b600080611a708484610a08565b603455603355909590945092505050565b6035546040516387fe861160e01b815260048101849052602481018390526001600160a01b03909116906387fe861190604401611923565b6000610404600160701b6001600160701b0384166121e1565b60006115ab6001600160701b03831684612213565b600054610100900460ff166117c05760405162461bcd60e51b815260040161057090612196565b600080608083901c15611b2357608092831c92015b604083901c15611b3557604092831c92015b602083901c15611b4757602092831c92015b601083901c15611b5957601092831c92015b600883901c15611b6b57600892831c92015b600483901c15611b7d57600492831c92015b600283901c15611b8f57600292831c92015b600183901c156104045760010192915050565b80356001600160a01b0381168114610e8057600080fd5b60008060008060008060a08789031215611bd257600080fd5b611bdb87611ba2565b9550602087013594506040870135935060608701359250608087013567ffffffffffffffff80821115611c0d57600080fd5b818901915089601f830112611c2157600080fd5b813581811115611c3057600080fd5b8a6020828501011115611c4257600080fd5b6020830194508093505050509295509295509295565b600060208284031215611c6a57600080fd5b81356001600160e01b0319811681146115ab57600080fd5b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff81118282101715611cc157611cc1611c82565b604052919050565b60008060008060808587031215611cdf57600080fd5b611ce885611ba2565b93506020611cf7818701611ba2565b935060408601359250606086013567ffffffffffffffff80821115611d1b57600080fd5b818801915088601f830112611d2f57600080fd5b813581811115611d4157611d41611c82565b611d53601f8201601f19168501611c98565b91508082528984828501011115611d6957600080fd5b808484018584013760008482840101525080935050505092959194509250565b600082601f830112611d9a57600080fd5b8135602067ffffffffffffffff821115611db657611db6611c82565b8160051b611dc5828201611c98565b9283528481018201928281019087851115611ddf57600080fd5b83870192505b84831015611dfe57823582529183019190830190611de5565b979650505050505050565b600080600060608486031215611e1e57600080fd5b83359250602084013567ffffffffffffffff811115611e3c57600080fd5b611e4886828701611d89565b925050611e5760408501611ba2565b90509250925092565b60008060408385031215611e7357600080fd5b50508035926020909101359150565b600080600060608486031215611e9757600080fd5b611ea084611ba2565b9250611eae60208501611ba2565b915060408401356001600160701b0381168114611eca57600080fd5b809150509250925092565b600060208284031215611ee757600080fd5b5035919050565b60008060408385031215611f0157600080fd5b611f0a83611ba2565b9150602083013567ffffffffffffffff811115611f2657600080fd5b611f3285828601611d89565b9150509250929050565b600060208284031215611f4e57600080fd5b5051919050565b600060208284031215611f6757600080fd5b815180151581146115ab57600080fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060018201611fb557611fb5611f8d565b5060010190565b8181038181111561040457610404611f8d565b808202811582820484141761040457610404611f8d565b600181815b8085111561202157816000190482111561200757612007611f8d565b8085161561201457918102915b93841c9390800290611feb565b509250929050565b60008261203857506001610404565b8161204557506000610404565b816001811461205b576002811461206557612081565b6001915050610404565b60ff84111561207657612076611f8d565b50506001821b610404565b5060208310610133831016604e8410600b84101617156120a4575081810a610404565b6120ae8383611fe6565b80600019048211156120c2576120c2611f8d565b029392505050565b60006115ab60ff841683612029565b8082018082111561040457610404611f8d565b808201828112600083128015821682158216171561210c5761210c611f8d565b505092915050565b818103600083128015838313168383128216171561213457612134611f8d565b5092915050565b634e487b7160e01b600052601260045260246000fd5b6000826121605761216061213b565b500490565b6000826121745761217461213b565b500690565b63ffffffff82811682821603908082111561213457612134611f8d565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b6001600160e01b0382811682821681810283169291811582850482141761220a5761220a611f8d565b50505092915050565b60006001600160e01b038381168061222d5761222d61213b565b9216919091049291505056fea264697066735822122009535a283df8757d08f2c00e8d7ec25ffa8c6be19a5ed583ce6417dfa660343864736f6c63430008120033";

export class SeacowsERC721TradePair__factory extends ContractFactory {
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
  ): Promise<SeacowsERC721TradePair> {
    return super.deploy(overrides || {}) as Promise<SeacowsERC721TradePair>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): SeacowsERC721TradePair {
    return super.attach(address) as SeacowsERC721TradePair;
  }
  connect(signer: Signer): SeacowsERC721TradePair__factory {
    return super.connect(signer) as SeacowsERC721TradePair__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SeacowsERC721TradePairInterface {
    return new utils.Interface(_abi) as SeacowsERC721TradePairInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SeacowsERC721TradePair {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as SeacowsERC721TradePair;
  }
}
