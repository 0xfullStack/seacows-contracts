// import chai from 'chai';
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

tdly.setup();
dotenv.config();
// chai.use(solidity);

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
    // cache: "./cache_hardhat",
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    mumbai: {
      chainId: SupportedChain.MUMBAI,
      url: process.env.MUMBAI_ALCHEMY_KEY
        ? `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_ALCHEMY_KEY}`
        : '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli: {
      chainId: SupportedChain.GÖRLI,
      url: process.env.GOERLI_ALCHEMY_KEY
        ? `https://eth-goerli.alchemyapi.io/v2/${process.env.GOERLI_ALCHEMY_KEY}`
        : '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  gasReporter: {
    // enabled: process.env.REPORT_GAS !== undefined,
    enabled: false,
    currency: 'USD',
    token: 'MATIC',
    gasPriceApi: 'https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice',
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY : '',
      polygon: process.env.POLYSCAN_API_KEY ? process.env.POLYSCAN_API_KEY : '',
      mumbai: process.env.POLYSCAN_API_KEY ? process.env.POLYSCAN_API_KEY : '',
    },
    customChains: [
      {
        network: 'mumbai',
        chainId: 80001,
        urls: {
          apiURL: 'https://api-testnet.polygonscan.com/api',
          browserURL: 'https://mumbai.polygonscan.com',
        },
      },
    ],
  },
  abiExporter: {
    path: 'abis',
    runOnCompile: true,
    clear: true,
    only: ['Seacows*'],
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
