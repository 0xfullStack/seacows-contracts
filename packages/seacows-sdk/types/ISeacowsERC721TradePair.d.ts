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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ISeacowsERC721TradePairInterface extends ethers.utils.Interface {
  functions: {
    "COMPLEMENT_PRECISION()": FunctionFragment;
    "PERCENTAGE_PRECISION()": FunctionFragment;
    "burn(address,uint256[])": FunctionFragment;
    "collection()": FunctionFragment;
    "fee()": FunctionFragment;
    "getReserves()": FunctionFragment;
    "initialize(address,address,uint112)": FunctionFragment;
    "mint(uint256)": FunctionFragment;
    "swap(uint256,uint256[],address)": FunctionFragment;
    "token()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "COMPLEMENT_PRECISION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "PERCENTAGE_PRECISION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "burn",
    values: [string, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "collection",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "fee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getReserves",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "mint", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "swap",
    values: [BigNumberish, BigNumberish[], string]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "COMPLEMENT_PRECISION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "PERCENTAGE_PRECISION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "collection", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getReserves",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;

  events: {
    "Burn(address,uint256,uint256,address)": EventFragment;
    "Mint(address,uint256,uint256)": EventFragment;
    "Swap(address,uint256,uint256,uint256,uint256,address)": EventFragment;
    "Sync(uint112,uint112)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Burn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Mint"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Swap"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Sync"): EventFragment;
}

export type BurnEvent = TypedEvent<
  [string, BigNumber, BigNumber, string] & {
    sender: string;
    amount0: BigNumber;
    amount1: BigNumber;
    to: string;
  }
>;

export type MintEvent = TypedEvent<
  [string, BigNumber, BigNumber] & {
    sender: string;
    amount0: BigNumber;
    amount1: BigNumber;
  }
>;

export type SwapEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, BigNumber, string] & {
    sender: string;
    tokenIn: BigNumber;
    nftIn: BigNumber;
    tokenOut: BigNumber;
    nftOut: BigNumber;
    to: string;
  }
>;

export type SyncEvent = TypedEvent<
  [BigNumber, BigNumber] & { reserve0: BigNumber; reserve1: BigNumber }
>;

export class ISeacowsERC721TradePair extends BaseContract {
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

  interface: ISeacowsERC721TradePairInterface;

  functions: {
    COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<[BigNumber]>;

    PERCENTAGE_PRECISION(overrides?: CallOverrides): Promise<[BigNumber]>;

    burn(
      to: string,
      ids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    collection(overrides?: CallOverrides): Promise<[string]>;

    fee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getReserves(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, number] & {
        _reserve0: BigNumber;
        _reserve1: BigNumber;
        _blockTimestampLast: number;
      }
    >;

    initialize(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    mint(
      toTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swap(
      tokenAmountOut: BigNumberish,
      idsOut: BigNumberish[],
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;
  };

  COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  PERCENTAGE_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  burn(
    to: string,
    ids: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  collection(overrides?: CallOverrides): Promise<string>;

  fee(overrides?: CallOverrides): Promise<BigNumber>;

  getReserves(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, number] & {
      _reserve0: BigNumber;
      _reserve1: BigNumber;
      _blockTimestampLast: number;
    }
  >;

  initialize(
    _collection: string,
    _token: string,
    _fee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  mint(
    toTokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swap(
    tokenAmountOut: BigNumberish,
    idsOut: BigNumberish[],
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    PERCENTAGE_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    burn(
      to: string,
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount0: BigNumber; amount1: BigNumber }
    >;

    collection(overrides?: CallOverrides): Promise<string>;

    fee(overrides?: CallOverrides): Promise<BigNumber>;

    getReserves(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, number] & {
        _reserve0: BigNumber;
        _reserve1: BigNumber;
        _blockTimestampLast: number;
      }
    >;

    initialize(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    mint(
      toTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    swap(
      tokenAmountOut: BigNumberish,
      idsOut: BigNumberish[],
      to: string,
      overrides?: CallOverrides
    ): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "Burn(address,uint256,uint256,address)"(
      sender?: string | null,
      amount0?: null,
      amount1?: null,
      to?: string | null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, string],
      { sender: string; amount0: BigNumber; amount1: BigNumber; to: string }
    >;

    Burn(
      sender?: string | null,
      amount0?: null,
      amount1?: null,
      to?: string | null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, string],
      { sender: string; amount0: BigNumber; amount1: BigNumber; to: string }
    >;

    "Mint(address,uint256,uint256)"(
      sender?: string | null,
      amount0?: null,
      amount1?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { sender: string; amount0: BigNumber; amount1: BigNumber }
    >;

    Mint(
      sender?: string | null,
      amount0?: null,
      amount1?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { sender: string; amount0: BigNumber; amount1: BigNumber }
    >;

    "Swap(address,uint256,uint256,uint256,uint256,address)"(
      sender?: string | null,
      tokenIn?: null,
      nftIn?: null,
      tokenOut?: null,
      nftOut?: null,
      to?: string | null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber, BigNumber, string],
      {
        sender: string;
        tokenIn: BigNumber;
        nftIn: BigNumber;
        tokenOut: BigNumber;
        nftOut: BigNumber;
        to: string;
      }
    >;

    Swap(
      sender?: string | null,
      tokenIn?: null,
      nftIn?: null,
      tokenOut?: null,
      nftOut?: null,
      to?: string | null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber, BigNumber, string],
      {
        sender: string;
        tokenIn: BigNumber;
        nftIn: BigNumber;
        tokenOut: BigNumber;
        nftOut: BigNumber;
        to: string;
      }
    >;

    "Sync(uint112,uint112)"(
      reserve0?: null,
      reserve1?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { reserve0: BigNumber; reserve1: BigNumber }
    >;

    Sync(
      reserve0?: null,
      reserve1?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { reserve0: BigNumber; reserve1: BigNumber }
    >;
  };

  estimateGas: {
    COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    PERCENTAGE_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    burn(
      to: string,
      ids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    collection(overrides?: CallOverrides): Promise<BigNumber>;

    fee(overrides?: CallOverrides): Promise<BigNumber>;

    getReserves(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    mint(
      toTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swap(
      tokenAmountOut: BigNumberish,
      idsOut: BigNumberish[],
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    COMPLEMENT_PRECISION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    PERCENTAGE_PRECISION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burn(
      to: string,
      ids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    collection(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getReserves(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    mint(
      toTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swap(
      tokenAmountOut: BigNumberish,
      idsOut: BigNumberish[],
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
