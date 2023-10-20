# Seacows Contracts

This repository contains the smart contracts for the Seacows Protocol.

## Get Started

```
yarn install
yarn workspace @yolominds/seacows-periphery run compile
yarn workspace @yolominds/seacows-amm run compile
```

## Linter
```
cd seacows-amm
solhint 'contracts/**/*.sol'

cd seacows-periphery
solhint 'contracts/**/*.sol'
```

## Formatter
```
cd seacows-amm
npx prettier --write --plugin=prettier-plugin-solidity 'contracts/**/*.sol'

cd seacows-periphery
npx prettier --write --plugin=prettier-plugin-solidity 'contracts/**/*.sol'
```

## Unit Test Coverage
```
cd seacows-amm
npx hardhat coverage

cd seacows-periphery
npx hardhat coverage
```

## Static analysis 
```
// if slither not found
// 1. pip3 install slither-analyzer
// 2. search slither install location: find / -name slither 2>/dev/null
// 3. write location folder into ~/.zshrc, example: 'export PATH=$PATH:$HOME/Library/Python/3.9/bin' 

cd seacows-amm
slither .

cd seacows-periphery
slither .
```

## Contract packages

- [Seacows AMM](./packages/seacows-amm/)

## IMPORTANT NOTES
