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
      name: "IERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165Upgradeable__factory>;
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
      name: "ERC3525Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC3525Upgradeable__factory>;
    getContractFactory(
      name: "IERC3525Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525Metadata__factory>;
    getContractFactory(
      name: "IERC3525MetadataUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525MetadataUpgradeable__factory>;
    getContractFactory(
      name: "IERC721Enumerable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Enumerable__factory>;
    getContractFactory(
      name: "IERC721EnumerableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721EnumerableUpgradeable__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721MetadataUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721MetadataUpgradeable__factory>;
    getContractFactory(
      name: "IERC3525",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525__factory>;
    getContractFactory(
      name: "IERC3525Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525Receiver__factory>;
    getContractFactory(
      name: "IERC3525ReceiverUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525ReceiverUpgradeable__factory>;
    getContractFactory(
      name: "IERC3525Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525Upgradeable__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "IERC721ReceiverUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721ReceiverUpgradeable__factory>;
    getContractFactory(
      name: "IERC721Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Upgradeable__factory>;
    getContractFactory(
      name: "IERC3525MetadataDescriptor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525MetadataDescriptor__factory>;
    getContractFactory(
      name: "IERC3525MetadataDescriptorUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC3525MetadataDescriptorUpgradeable__factory>;
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
      name: "SeacowsPairMetadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsPairMetadata__factory>;
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
      name: "ISeacowsPositionManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsPositionManager__factory>;
    getContractFactory(
      name: "IWETH",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWETH__factory>;
    getContractFactory(
      name: "NFTRenderer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NFTRenderer__factory>;
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
      name: "MockSeacowsComplement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockSeacowsComplement__factory>;
    getContractFactory(
      name: "MockSeacowsERC3525",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockSeacowsERC3525__factory>;
    getContractFactory(
      name: "WETH",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WETH__factory>;

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
      name: "IERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165Upgradeable>;
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
      name: "ERC3525Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC3525Upgradeable>;
    getContractAt(
      name: "IERC3525Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525Metadata>;
    getContractAt(
      name: "IERC3525MetadataUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525MetadataUpgradeable>;
    getContractAt(
      name: "IERC721Enumerable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Enumerable>;
    getContractAt(
      name: "IERC721EnumerableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721EnumerableUpgradeable>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721MetadataUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721MetadataUpgradeable>;
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
      name: "IERC3525ReceiverUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525ReceiverUpgradeable>;
    getContractAt(
      name: "IERC3525Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525Upgradeable>;
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
      name: "IERC721ReceiverUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721ReceiverUpgradeable>;
    getContractAt(
      name: "IERC721Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Upgradeable>;
    getContractAt(
      name: "IERC3525MetadataDescriptor",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525MetadataDescriptor>;
    getContractAt(
      name: "IERC3525MetadataDescriptorUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC3525MetadataDescriptorUpgradeable>;
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
      name: "SeacowsPairMetadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsPairMetadata>;
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
      name: "ISeacowsPositionManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsPositionManager>;
    getContractAt(
      name: "IWETH",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWETH>;
    getContractAt(
      name: "NFTRenderer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.NFTRenderer>;
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
      name: "MockSeacowsComplement",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockSeacowsComplement>;
    getContractAt(
      name: "MockSeacowsERC3525",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockSeacowsERC3525>;
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
