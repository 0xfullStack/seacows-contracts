#!/bin/bash

echo "############################## Choose The Network ##############################"

networks=("mainnet" "goerli" "sepolia")

select network in "${networks[@]}"; do
  case $network in
    "mainnet")
      environment="prod"
      break
      ;;
    "sepolia"|"goerli")
      environment="dev"
      break
      ;;
    *)
      echo "Invalid option. Please select a valid network."
      ;;
  esac
done

echo "You choose the $network network..."
echo "Environment set to: $environment"

# directories
seacows_amm_directory="./packages/seacows-amm"
seacows_periphery_directory="./packages/seacows-periphery"
seacows_sdk_directory="./packages/seacows-sdk"

echo "############################## Start AMM Deploy Tasks ##############################"

# 1. Execute AMM Tasks
cd "$seacows_amm_directory"

# - clean：
npx rimraf cache out \n npx hardhat clean

# - print size
npx hardhat size-contracts

# - test 
npx hardhat test

# - coverage
npx hardhat coverage

# - compile
npx hardhat compile

# - deploy
npx hardhat deploy:seacows --env $environment --network $network


echo "############################## Update Seacows SDK Once ##############################"
# 3 Execute SDK Tasks
cd "../../"
cd "$seacows_sdk_directory"

# - copy from amm repo
npx copyfiles -u 3 ../seacows-amm/types/**/*.d.ts ../seacows-amm/types/*.ts ../seacows-amm/types/**/*.ts ./types/amm && npx copyfiles -u 3 ../seacows-amm/abis/**/* ./abis/amm

# - copy from periphery repo
npx copyfiles -u 3 ../seacows-periphery/types/**/*.d.ts ../seacows-periphery/types/*.ts ../seacows-periphery/types/**/*.ts ./types/periphery && npx copyfiles -u 3 ../seacows-periphery/abis/**/* ./abis/periphery

# - build
rm -rf dist && npx tsc && npx copyfiles -u 1 types/**/*.d.ts dist/types

echo "############################## Update Seacows SDK Once Finish ##############################"


echo "############################## Start Periphery Deploy Tasks ##############################"
# 2. Execute Periphery Tasks
cd "../../"
cd "$seacows_periphery_directory"

# - clean：
npx rimraf cache out \n npx hardhat clean

# - print size
npx hardhat size-contracts

# - test 
npx hardhat test

# - coverage
npx hardhat coverage

# - compile
npx hardhat compile

# - deploy
npx hardhat deploy:seacows --env $environment --network $network


echo "############################## Update Seacows SDK Twice ##############################"
# 3 Execute SDK Tasks
cd "../../"
cd "$seacows_sdk_directory"

# - copy from amm repo
npx copyfiles -u 3 ../seacows-amm/types/**/*.d.ts ../seacows-amm/types/*.ts ../seacows-amm/types/**/*.ts ./types/amm && npx copyfiles -u 3 ../seacows-amm/abis/**/* ./abis/amm

# - copy from periphery repo
npx copyfiles -u 3 ../seacows-periphery/types/**/*.d.ts ../seacows-periphery/types/*.ts ../seacows-periphery/types/**/*.ts ./types/periphery && npx copyfiles -u 3 ../seacows-periphery/abis/**/* ./abis/periphery

# - build
rm -rf dist && npx tsc && npx copyfiles -u 1 types/**/*.d.ts dist/types

echo "############################## Update Seacows SDK Twice Finish ##############################"