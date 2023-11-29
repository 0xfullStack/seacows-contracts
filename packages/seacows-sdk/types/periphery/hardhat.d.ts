/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IAdminControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAdminControl__factory>;
    getContractFactory(
      name: "IAccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControlUpgradeable__factory>;
    getContractFactory(
      name: "OwnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableUpgradeable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContextUpgradeable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "IERC3525",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IFeeManagement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFeeManagement__factory>;
    getContractFactory(
      name: "IRoyaltyManagement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRoyaltyManagement__factory>;
    getContractFactory(
      name: "ISeacowsComplement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsComplement__factory>;
    getContractFactory(
      name: "ISeacowsERC3525",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsERC3525__factory>;
    getContractFactory(
      name: "ISeacowsERC721TradePair",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsERC721TradePair__factory>;
    getContractFactory(
      name: "ISeacowsERC721TradePairFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsERC721TradePairFactory__factory>;
    getContractFactory(
      name: "ISeacowsPairMetadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsPairMetadata__factory>;
    getContractFactory(
      name: "ISeacowsPositionManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsPositionManager__factory>;
    getContractFactory(
      name: "ISeacowsRewarder",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsRewarder__factory>;
    getContractFactory(
      name: "PeripheryImmutableState",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PeripheryImmutableState__factory>;
    getContractFactory(
      name: "SeacowsErrors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsErrors__factory>;
    getContractFactory(
      name: "SeacowsSwapCallback",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsSwapCallback__factory>;
    getContractFactory(
      name: "IPeripheryImmutableState",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPeripheryImmutableState__factory>;
    getContractFactory(
      name: "IRoyaltyRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRoyaltyRegistry__factory>;
    getContractFactory(
      name: "ISeacowsRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsRouter__factory>;
    getContractFactory(
      name: "ISeacowsSwapCallback",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsSwapCallback__factory>;
    getContractFactory(
      name: "IWETH",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWETH__factory>;
    getContractFactory(
      name: "SeacowsRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsRouter__factory>;
    getContractFactory(
      name: "MockERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockERC20__factory>;
    getContractFactory(
      name: "MockERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockERC721__factory>;
    getContractFactory(
      name: "MockRoyaltyRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockRoyaltyRegistry__factory>;
    getContractFactory(
      name: "WETH",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WETH__factory>;

    getContractAt(
      name: "IAdminControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAdminControl>;
    getContractAt(
      name: "IAccessControlUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlUpgradeable>;
    getContractAt(
      name: "OwnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "IERC3525",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IFeeManagement",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFeeManagement>;
    getContractAt(
      name: "IRoyaltyManagement",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRoyaltyManagement>;
    getContractAt(
      name: "ISeacowsComplement",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsComplement>;
    getContractAt(
      name: "ISeacowsERC3525",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsERC3525>;
    getContractAt(
      name: "ISeacowsERC721TradePair",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsERC721TradePair>;
    getContractAt(
      name: "ISeacowsERC721TradePairFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsERC721TradePairFactory>;
    getContractAt(
      name: "ISeacowsPairMetadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsPairMetadata>;
    getContractAt(
      name: "ISeacowsPositionManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsPositionManager>;
    getContractAt(
      name: "ISeacowsRewarder",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsRewarder>;
    getContractAt(
      name: "PeripheryImmutableState",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PeripheryImmutableState>;
    getContractAt(
      name: "SeacowsErrors",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsErrors>;
    getContractAt(
      name: "SeacowsSwapCallback",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsSwapCallback>;
    getContractAt(
      name: "IPeripheryImmutableState",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPeripheryImmutableState>;
    getContractAt(
      name: "IRoyaltyRegistry",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRoyaltyRegistry>;
    getContractAt(
      name: "ISeacowsRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsRouter>;
    getContractAt(
      name: "ISeacowsSwapCallback",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsSwapCallback>;
    getContractAt(
      name: "IWETH",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWETH>;
    getContractAt(
      name: "SeacowsRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsRouter>;
    getContractAt(
      name: "MockERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockERC20>;
    getContractAt(
      name: "MockERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockERC721>;
    getContractAt(
      name: "MockRoyaltyRegistry",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockRoyaltyRegistry>;
    getContractAt(
      name: "WETH",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WETH>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
