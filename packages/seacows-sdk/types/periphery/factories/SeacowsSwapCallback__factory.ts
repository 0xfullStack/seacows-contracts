/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SeacowsSwapCallback,
  SeacowsSwapCallbackInterface,
} from "../SeacowsSwapCallback";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_manager",
        type: "address",
      },
      {
        internalType: "address",
        name: "_weth",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "manager",
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
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "seacowsSwapCallback",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "idsIn",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "weth",
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
];

const _bytecode =
  "0x60c060405234801561001057600080fd5b5060405161091738038061091783398101604081905261002f91610062565b6001600160a01b0391821660a05216608052610095565b80516001600160a01b038116811461005d57600080fd5b919050565b6000806040838503121561007557600080fd5b61007e83610046565b915061008c60208401610046565b90509250929050565b60805160a0516108586100bf6000396000818160b0015261029501526000604b01526108586000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80633fc8cef31461004657806341bc698d1461008a578063481c6a75146100ab575b600080fd5b61006d7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b61009d61009836600461054d565b6100d2565b6040516100819291906105bf565b61006d7f000000000000000000000000000000000000000000000000000000000000000081565b60006060816100e384860186610695565b604081810151602083015191516301ffc9a760e01b8152636bc0dc1f60e01b6004820152909550909350909150339081906301ffc9a790602401602060405180830381865afa15801561013a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061015e9190610786565b6101bd5760405162461bcd60e51b815260206004820152602560248201527f536561636f77735377617043616c6c6261636b3a204e4f545f534541434f57536044820152642fa820a4a960d91b60648201526084015b60405180910390fd5b6000816001600160a01b031663fc0c546a6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156101fd573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061022191906107af565b90506000826001600160a01b0316637de1e5366040518163ffffffff1660e01b8152600401602060405180830381865afa158015610263573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061028791906107af565b9050336001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316635eced4808484876001600160a01b0316637fd6f15c6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610302573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061032691906107cc565b6040516001600160e01b031960e086901b1681526001600160a01b0393841660048201529290911660248301526044820152606401602060405180830381865afa158015610378573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061039c91906107af565b6001600160a01b0316146103fd5760405162461bcd60e51b815260206004820152602260248201527f536561636f77735377617043616c6c6261636b3a20504149525f4d49534d4154604482015261086960f31b60648201526084016101b4565b85156104815783516040516323b872dd60e01b81526001600160a01b03918216600482015233602482015260448101889052908316906323b872dd906064016020604051808303816000875af115801561045b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061047f9190610786565b505b8451156105425760005b855181101561054057816001600160a01b03166342842e0e8660000151338985815181106104bb576104bb6107e5565b60209081029190910101516040516001600160e01b031960e086901b1681526001600160a01b0393841660048201529290911660248301526044820152606401600060405180830381600087803b15801561051557600080fd5b505af1158015610529573d6000803e3d6000fd5b505050508080610538906107fb565b91505061048b565b505b505050509250929050565b6000806020838503121561056057600080fd5b823567ffffffffffffffff8082111561057857600080fd5b818501915085601f83011261058c57600080fd5b81358181111561059b57600080fd5b8660208285010111156105ad57600080fd5b60209290920196919550909350505050565b6000604082018483526020604081850152818551808452606086019150828701935060005b81811015610600578451835293830193918301916001016105e4565b5090979650505050505050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff811182821017156106465761064661060d565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156106755761067561060d565b604052919050565b6001600160a01b038116811461069257600080fd5b50565b600060208083850312156106a857600080fd5b823567ffffffffffffffff808211156106c057600080fd5b90840190606082870312156106d457600080fd5b6106dc610623565b82356106e78161067d565b815282840135828111156106fa57600080fd5b8301601f8101881361070b57600080fd5b80358381111561071d5761071d61060d565b8060051b935061072e86850161064c565b818152938201860193868101908a86111561074857600080fd5b928701925b858410156107665783358252928701929087019061074d565b808886015250505050604083013560408201528094505050505092915050565b60006020828403121561079857600080fd5b815180151581146107a857600080fd5b9392505050565b6000602082840312156107c157600080fd5b81516107a88161067d565b6000602082840312156107de57600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b60006001820161081b57634e487b7160e01b600052601160045260246000fd5b506001019056fea26469706673582212209c8d87008b8be18a7d5b87cf9aeac364998fe6343d16f85a0d33a109ffce4f2064736f6c63430008120033";

export class SeacowsSwapCallback__factory extends ContractFactory {
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
    _manager: string,
    _weth: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SeacowsSwapCallback> {
    return super.deploy(
      _manager,
      _weth,
      overrides || {}
    ) as Promise<SeacowsSwapCallback>;
  }
  getDeployTransaction(
    _manager: string,
    _weth: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_manager, _weth, overrides || {});
  }
  attach(address: string): SeacowsSwapCallback {
    return super.attach(address) as SeacowsSwapCallback;
  }
  connect(signer: Signer): SeacowsSwapCallback__factory {
    return super.connect(signer) as SeacowsSwapCallback__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SeacowsSwapCallbackInterface {
    return new utils.Interface(_abi) as SeacowsSwapCallbackInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SeacowsSwapCallback {
    return new Contract(address, _abi, signerOrProvider) as SeacowsSwapCallback;
  }
}
