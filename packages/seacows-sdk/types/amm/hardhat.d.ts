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
      name: "ReentrancyGuardUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReentrancyGuardUpgradeable__factory>;
    getContractFactory(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContextUpgradeable__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Ownable2Step",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable2Step__factory>;
    getContractFactory(
      name: "IERC2981",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC2981__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "ERC2981",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC2981__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
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
      name: "ERC721Holder",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721Holder__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "ERC3525",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC3525__factory>;
    getContractFactory(
      name: "IERC3525Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525Metadata__factory>;
    getContractFactory(
      name: "IERC721Enumerable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Enumerable__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC3525",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525__factory>;
    getContractFactory(
      name: "IERC3525Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525Receiver__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "IERC3525MetadataDescriptor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525MetadataDescriptor__factory>;
    getContractFactory(
      name: "ISeacowsSwapCallback",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsSwapCallback__factory>;
    getContractFactory(
      name: "FeeManagement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FeeManagement__factory>;
    getContractFactory(
      name: "RoyaltyManagement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RoyaltyManagement__factory>;
    getContractFactory(
      name: "SeacowsComplement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsComplement__factory>;
    getContractFactory(
      name: "SeacowsERC3525",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsERC3525__factory>;
    getContractFactory(
      name: "SeacowsERC721TradePairFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsERC721TradePairFactory__factory>;
    getContractFactory(
      name: "SeacowsErrors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsErrors__factory>;
    getContractFactory(
      name: "SeacowsLimitAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsLimitAccessControl__factory>;
    getContractFactory(
      name: "SeacowsPairMetadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsPairMetadata__factory>;
    getContractFactory(
      name: "SeacowsRewarder",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsRewarder__factory>;
    getContractFactory(
      name: "SpeedBump",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SpeedBump__factory>;
    getContractFactory(
      name: "IFeeManagement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFeeManagement__factory>;
    getContractFactory(
      name: "IRoyaltyManagement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRoyaltyManagement__factory>;
    getContractFactory(
      name: "IRoyaltyRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRoyaltyRegistry__factory>;
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
      name: "IWETH",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWETH__factory>;
    getContractFactory(
      name: "FixidityLib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FixidityLib__factory>;
    getContractFactory(
      name: "NFTRenderer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NFTRenderer__factory>;
    getContractFactory(
      name: "PricingKernel",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PricingKernel__factory>;
    getContractFactory(
      name: "SeacowsERC721TradePair",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsERC721TradePair__factory>;
    getContractFactory(
      name: "SeacowsPositionManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsPositionManager__factory>;
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
      name: "MockSeacowsERC3525",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockSeacowsERC3525__factory>;
    getContractFactory(
      name: "MockSeacowsPairSwap",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockSeacowsPairSwap__factory>;
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
      name: "ReentrancyGuardUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyGuardUpgradeable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Ownable2Step",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable2Step>;
    getContractAt(
      name: "IERC2981",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC2981>;
    getContractAt(
      name: "Pausable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "ERC2981",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC2981>;
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
      name: "IERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
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
      name: "ERC721Holder",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721Holder>;
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
      name: "ERC3525",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC3525>;
    getContractAt(
      name: "IERC3525Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525Metadata>;
    getContractAt(
      name: "IERC721Enumerable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Enumerable>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC3525",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525>;
    getContractAt(
      name: "IERC3525Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525Receiver>;
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
      name: "IERC3525MetadataDescriptor",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525MetadataDescriptor>;
    getContractAt(
      name: "ISeacowsSwapCallback",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsSwapCallback>;
    getContractAt(
      name: "FeeManagement",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.FeeManagement>;
    getContractAt(
      name: "RoyaltyManagement",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RoyaltyManagement>;
    getContractAt(
      name: "SeacowsComplement",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsComplement>;
    getContractAt(
      name: "SeacowsERC3525",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsERC3525>;
    getContractAt(
      name: "SeacowsERC721TradePairFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsERC721TradePairFactory>;
    getContractAt(
      name: "SeacowsErrors",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsErrors>;
    getContractAt(
      name: "SeacowsLimitAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsLimitAccessControl>;
    getContractAt(
      name: "SeacowsPairMetadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsPairMetadata>;
    getContractAt(
      name: "SeacowsRewarder",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsRewarder>;
    getContractAt(
      name: "SpeedBump",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SpeedBump>;
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
      name: "IRoyaltyRegistry",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRoyaltyRegistry>;
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
      name: "IWETH",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWETH>;
    getContractAt(
      name: "FixidityLib",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.FixidityLib>;
    getContractAt(
      name: "NFTRenderer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.NFTRenderer>;
    getContractAt(
      name: "PricingKernel",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PricingKernel>;
    getContractAt(
      name: "SeacowsERC721TradePair",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsERC721TradePair>;
    getContractAt(
      name: "SeacowsPositionManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsPositionManager>;
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
      name: "MockSeacowsERC3525",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockSeacowsERC3525>;
    getContractAt(
      name: "MockSeacowsPairSwap",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockSeacowsPairSwap>;
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
