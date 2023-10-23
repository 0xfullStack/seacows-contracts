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
solhint 'contracts/**/*.sol'
solhint 'contracts/**/*.sol'
```

## Formatter
```
npx prettier --write --plugin=prettier-plugin-solidity 'contracts/**/*.sol'
npx prettier --write --plugin=prettier-plugin-solidity 'contracts/**/*.sol'
```

## Unit Test Coverage
```
npx hardhat coverage
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
