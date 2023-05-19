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
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "ISeacowsComplement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsComplement__factory>;
    getContractFactory(
      name: "ISeacowsERC721TradePair",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsERC721TradePair__factory>;
    getContractFactory(
      name: "ISeacowsRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISeacowsRouter__factory>;
    getContractFactory(
      name: "SeacowsRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SeacowsRouter__factory>;

    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "ISeacowsComplement",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsComplement>;
    getContractAt(
      name: "ISeacowsERC721TradePair",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsERC721TradePair>;
    getContractAt(
      name: "ISeacowsRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISeacowsRouter>;
    getContractAt(
      name: "SeacowsRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SeacowsRouter>;

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
