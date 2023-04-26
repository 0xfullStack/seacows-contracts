// import chai from 'chai';
import * as dotenv from 'dotenv';
// import { solidity } from 'ethereum-waffle';

import { type HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-chai-matchers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-abi-exporter';
import 'hardhat-gas-reporter';

dotenv.config();
// chai.use(solidity);

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
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
    goerli: {
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
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  abiExporter: {
    path: 'abis',
    runOnCompile: true,
    clear: true,
    // flat: true,
    except: [':@solvprotocol/erc-3525/IERC*'],
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
};

export default config;
