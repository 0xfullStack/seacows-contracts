import * as dotenv from 'dotenv';
import { SupportedChain } from '@yolominds/seacows-sdk';

import { type HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-chai-matchers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-abi-exporter';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import * as tdly from '@tenderly/hardhat-tenderly';
import './tasks';
import 'solidity-coverage';

tdly.setup();
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      mining: {
        auto: true,
        interval: 5000,
      },
    },
    goerli: {
      chainId: SupportedChain.GÖRLI,
      url: process.env.GOERLI_ALCHEMY_KEY
        ? `https://eth-goerli.g.alchemy.com/v2/${process.env.GOERLI_ALCHEMY_KEY}`
        : '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      chainId: SupportedChain.SEPOLIA,
      url: process.env.SEPOLIA_ALCHEMY_KEY
        ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_ALCHEMY_KEY}`
        : '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      chainId: SupportedChain.MAINNET,
      url: process.env.MAINNET_ALCHEMY_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.MAINNET_ALCHEMY_KEY}`
        : '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY : '',
      sepolia: process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY : '',
      mainnet: process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY : '',
    },
  },
  abiExporter: {
    path: 'abis',
    runOnCompile: true,
    clear: true,
    only: ['Seacows*', 'NFT*', 'SpeedBump'],
    rename: (sourceName: string, contractName: string) => {
      if (sourceName.match(/^@solvprotocol\/erc-3525/) != null) {
        return 'ERC3525/' + contractName;
      } else {
        return contractName;
      }
    },
    spacing: 2,
    pretty: false,
  },
  tenderly: {
    username: 'seacows-tech',
    project: 'seacows',
    privateVerification: false, // if true, contracts will be verified privately, if false, contracts will be verified publicly
  },
};

export default config;
