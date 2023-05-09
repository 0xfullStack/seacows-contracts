/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface SeacowsERC3525Interface extends ethers.utils.Interface {
  functions: {
    "allowance(uint256,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "contractURI()": FunctionFragment;
    "getApproved(uint256)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "metadataDescriptor()": FunctionFragment;
    "name()": FunctionFragment;
    "onERC721Received(address,address,uint256,bytes)": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "safeTransferFrom(address,address,uint256)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "slotOf(uint256)": FunctionFragment;
    "slotURI(uint256)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "symbol()": FunctionFragment;
    "tokenByIndex(uint256)": FunctionFragment;
    "tokenOfOwnerByIndex(address,uint256)": FunctionFragment;
    "tokenURI(uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "totalValueSupplyOf(uint256)": FunctionFragment;
    "transferFrom(uint256,address,uint256)": FunctionFragment;
    "valueDecimals()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "allowance",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "contractURI",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "metadataDescriptor",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [string, string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "slotOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "slotURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenByIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenOfOwnerByIndex",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalValueSupplyOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "valueDecimals",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contractURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "metadataDescriptor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "slotOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "slotURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenOfOwnerByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalValueSupplyOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "valueDecimals",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "ApprovalForAll(address,address,bool)": EventFragment;
    "ApprovalValue(uint256,address,uint256)": EventFragment;
    "SetMetadataDescriptor(address)": EventFragment;
    "SlotChanged(uint256,uint256,uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
    "TransferValue(uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalValue"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetMetadataDescriptor"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SlotChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferValue"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber] & {
    _owner: string;
    _approved: string;
    _tokenId: BigNumber;
  }
>;

export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean] & {
    _owner: string;
    _operator: string;
    _approved: boolean;
  }
>;

export type ApprovalValueEvent = TypedEvent<
  [BigNumber, string, BigNumber] & {
    _tokenId: BigNumber;
    _operator: string;
    _value: BigNumber;
  }
>;

export type SetMetadataDescriptorEvent = TypedEvent<
  [string] & { metadataDescriptor: string }
>;

export type SlotChangedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber] & {
    _tokenId: BigNumber;
    _oldSlot: BigNumber;
    _newSlot: BigNumber;
  }
>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber] & {
    _from: string;
    _to: string;
    _tokenId: BigNumber;
  }
>;

export type TransferValueEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber] & {
    _fromTokenId: BigNumber;
    _toTokenId: BigNumber;
    _value: BigNumber;
  }
>;

export class SeacowsERC3525 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: SeacowsERC3525Interface;

  functions: {
    allowance(
      tokenId_: BigNumberish,
      operator_: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "approve(address,uint256)"(
      to_: string,
      tokenId_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "approve(uint256,address,uint256)"(
      tokenId_: BigNumberish,
      to_: string,
      value_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "balanceOf(address)"(
      owner_: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { balance: BigNumber }>;

    "balanceOf(uint256)"(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    contractURI(overrides?: CallOverrides): Promise<[string]>;

    getApproved(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isApprovedForAll(
      owner_: string,
      operator_: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    metadataDescriptor(overrides?: CallOverrides): Promise<[string]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ownerOf(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { owner_: string }>;

    "safeTransferFrom(address,address,uint256)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      data_: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator_: string,
      approved_: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    slotOf(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    slotURI(slot_: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    tokenByIndex(
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenOfOwnerByIndex(
      owner_: string,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalValueSupplyOf(
      _slot: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "transferFrom(uint256,address,uint256)"(
      fromTokenId_: BigNumberish,
      to_: string,
      value_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "transferFrom(address,address,uint256)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "transferFrom(uint256,uint256,uint256)"(
      fromTokenId_: BigNumberish,
      toTokenId_: BigNumberish,
      value_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    valueDecimals(overrides?: CallOverrides): Promise<[number]>;
  };

  allowance(
    tokenId_: BigNumberish,
    operator_: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "approve(address,uint256)"(
    to_: string,
    tokenId_: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "approve(uint256,address,uint256)"(
    tokenId_: BigNumberish,
    to_: string,
    value_: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "balanceOf(address)"(
    owner_: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "balanceOf(uint256)"(
    tokenId_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  contractURI(overrides?: CallOverrides): Promise<string>;

  getApproved(
    tokenId_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  isApprovedForAll(
    owner_: string,
    operator_: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  metadataDescriptor(overrides?: CallOverrides): Promise<string>;

  name(overrides?: CallOverrides): Promise<string>;

  onERC721Received(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    arg3: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ownerOf(tokenId_: BigNumberish, overrides?: CallOverrides): Promise<string>;

  "safeTransferFrom(address,address,uint256)"(
    from_: string,
    to_: string,
    tokenId_: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256,bytes)"(
    from_: string,
    to_: string,
    tokenId_: BigNumberish,
    data_: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator_: string,
    approved_: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  slotOf(tokenId_: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  slotURI(slot_: BigNumberish, overrides?: CallOverrides): Promise<string>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  symbol(overrides?: CallOverrides): Promise<string>;

  tokenByIndex(
    index_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenOfOwnerByIndex(
    owner_: string,
    index_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  totalValueSupplyOf(
    _slot: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "transferFrom(uint256,address,uint256)"(
    fromTokenId_: BigNumberish,
    to_: string,
    value_: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "transferFrom(address,address,uint256)"(
    from_: string,
    to_: string,
    tokenId_: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "transferFrom(uint256,uint256,uint256)"(
    fromTokenId_: BigNumberish,
    toTokenId_: BigNumberish,
    value_: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  valueDecimals(overrides?: CallOverrides): Promise<number>;

  callStatic: {
    allowance(
      tokenId_: BigNumberish,
      operator_: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "approve(address,uint256)"(
      to_: string,
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "approve(uint256,address,uint256)"(
      tokenId_: BigNumberish,
      to_: string,
      value_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "balanceOf(address)"(
      owner_: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "balanceOf(uint256)"(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    contractURI(overrides?: CallOverrides): Promise<string>;

    getApproved(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    isApprovedForAll(
      owner_: string,
      operator_: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    metadataDescriptor(overrides?: CallOverrides): Promise<string>;

    name(overrides?: CallOverrides): Promise<string>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    ownerOf(tokenId_: BigNumberish, overrides?: CallOverrides): Promise<string>;

    "safeTransferFrom(address,address,uint256)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      data_: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator_: string,
      approved_: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    slotOf(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    slotURI(slot_: BigNumberish, overrides?: CallOverrides): Promise<string>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    symbol(overrides?: CallOverrides): Promise<string>;

    tokenByIndex(
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner_: string,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    totalValueSupplyOf(
      _slot: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "transferFrom(uint256,address,uint256)"(
      fromTokenId_: BigNumberish,
      to_: string,
      value_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "transferFrom(address,address,uint256)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "transferFrom(uint256,uint256,uint256)"(
      fromTokenId_: BigNumberish,
      toTokenId_: BigNumberish,
      value_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    valueDecimals(overrides?: CallOverrides): Promise<number>;
  };

  filters: {
    "Approval(address,address,uint256)"(
      _owner?: string | null,
      _approved?: string | null,
      _tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { _owner: string; _approved: string; _tokenId: BigNumber }
    >;

    Approval(
      _owner?: string | null,
      _approved?: string | null,
      _tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { _owner: string; _approved: string; _tokenId: BigNumber }
    >;

    "ApprovalForAll(address,address,bool)"(
      _owner?: string | null,
      _operator?: string | null,
      _approved?: null
    ): TypedEventFilter<
      [string, string, boolean],
      { _owner: string; _operator: string; _approved: boolean }
    >;

    ApprovalForAll(
      _owner?: string | null,
      _operator?: string | null,
      _approved?: null
    ): TypedEventFilter<
      [string, string, boolean],
      { _owner: string; _operator: string; _approved: boolean }
    >;

    "ApprovalValue(uint256,address,uint256)"(
      _tokenId?: BigNumberish | null,
      _operator?: string | null,
      _value?: null
    ): TypedEventFilter<
      [BigNumber, string, BigNumber],
      { _tokenId: BigNumber; _operator: string; _value: BigNumber }
    >;

    ApprovalValue(
      _tokenId?: BigNumberish | null,
      _operator?: string | null,
      _value?: null
    ): TypedEventFilter<
      [BigNumber, string, BigNumber],
      { _tokenId: BigNumber; _operator: string; _value: BigNumber }
    >;

    "SetMetadataDescriptor(address)"(
      metadataDescriptor?: string | null
    ): TypedEventFilter<[string], { metadataDescriptor: string }>;

    SetMetadataDescriptor(
      metadataDescriptor?: string | null
    ): TypedEventFilter<[string], { metadataDescriptor: string }>;

    "SlotChanged(uint256,uint256,uint256)"(
      _tokenId?: BigNumberish | null,
      _oldSlot?: BigNumberish | null,
      _newSlot?: BigNumberish | null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      { _tokenId: BigNumber; _oldSlot: BigNumber; _newSlot: BigNumber }
    >;

    SlotChanged(
      _tokenId?: BigNumberish | null,
      _oldSlot?: BigNumberish | null,
      _newSlot?: BigNumberish | null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      { _tokenId: BigNumber; _oldSlot: BigNumber; _newSlot: BigNumber }
    >;

    "Transfer(address,address,uint256)"(
      _from?: string | null,
      _to?: string | null,
      _tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { _from: string; _to: string; _tokenId: BigNumber }
    >;

    Transfer(
      _from?: string | null,
      _to?: string | null,
      _tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { _from: string; _to: string; _tokenId: BigNumber }
    >;

    "TransferValue(uint256,uint256,uint256)"(
      _fromTokenId?: BigNumberish | null,
      _toTokenId?: BigNumberish | null,
      _value?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      { _fromTokenId: BigNumber; _toTokenId: BigNumber; _value: BigNumber }
    >;

    TransferValue(
      _fromTokenId?: BigNumberish | null,
      _toTokenId?: BigNumberish | null,
      _value?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      { _fromTokenId: BigNumber; _toTokenId: BigNumber; _value: BigNumber }
    >;
  };

  estimateGas: {
    allowance(
      tokenId_: BigNumberish,
      operator_: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "approve(address,uint256)"(
      to_: string,
      tokenId_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "approve(uint256,address,uint256)"(
      tokenId_: BigNumberish,
      to_: string,
      value_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "balanceOf(address)"(
      owner_: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "balanceOf(uint256)"(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    contractURI(overrides?: CallOverrides): Promise<BigNumber>;

    getApproved(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      owner_: string,
      operator_: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    metadataDescriptor(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ownerOf(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      data_: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator_: string,
      approved_: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    slotOf(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    slotURI(slot_: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    tokenByIndex(
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner_: string,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    totalValueSupplyOf(
      _slot: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "transferFrom(uint256,address,uint256)"(
      fromTokenId_: BigNumberish,
      to_: string,
      value_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "transferFrom(address,address,uint256)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "transferFrom(uint256,uint256,uint256)"(
      fromTokenId_: BigNumberish,
      toTokenId_: BigNumberish,
      value_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    valueDecimals(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    allowance(
      tokenId_: BigNumberish,
      operator_: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "approve(address,uint256)"(
      to_: string,
      tokenId_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "approve(uint256,address,uint256)"(
      tokenId_: BigNumberish,
      to_: string,
      value_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "balanceOf(address)"(
      owner_: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "balanceOf(uint256)"(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    contractURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getApproved(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      owner_: string,
      operator_: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    metadataDescriptor(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ownerOf(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      data_: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator_: string,
      approved_: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    slotOf(
      tokenId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    slotURI(
      slot_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenByIndex(
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenOfOwnerByIndex(
      owner_: string,
      index_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalValueSupplyOf(
      _slot: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "transferFrom(uint256,address,uint256)"(
      fromTokenId_: BigNumberish,
      to_: string,
      value_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "transferFrom(address,address,uint256)"(
      from_: string,
      to_: string,
      tokenId_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "transferFrom(uint256,uint256,uint256)"(
      fromTokenId_: BigNumberish,
      toTokenId_: BigNumberish,
      value_: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    valueDecimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
