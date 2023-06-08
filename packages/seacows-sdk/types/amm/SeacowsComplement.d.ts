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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface SeacowsComplementInterface extends ethers.utils.Interface {
  functions: {
    "COMPLEMENT_PRECISION()": FunctionFragment;
    "COMPLEMENT_THRESHOLD()": FunctionFragment;
    "getComplemenetedAssetsOut(int256,int256)": FunctionFragment;
    "nftComplement()": FunctionFragment;
    "tokenComplement()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "COMPLEMENT_PRECISION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "COMPLEMENT_THRESHOLD",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getComplemenetedAssetsOut",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "nftComplement",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tokenComplement",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "COMPLEMENT_PRECISION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "COMPLEMENT_THRESHOLD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComplemenetedAssetsOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nftComplement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenComplement",
    data: BytesLike
  ): Result;

  events: {};
}

export class SeacowsComplement extends BaseContract {
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

  interface: SeacowsComplementInterface;

  functions: {
    COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<[BigNumber]>;

    COMPLEMENT_THRESHOLD(overrides?: CallOverrides): Promise<[BigNumber]>;

    getComplemenetedAssetsOut(
      _tokenAmountOut: BigNumberish,
      _nftAmountOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        tokenAmountOut: BigNumber;
        nftAmountOut: BigNumber;
        newTokenComplement: BigNumber;
        newNftComplement: BigNumber;
      }
    >;

    nftComplement(overrides?: CallOverrides): Promise<[BigNumber]>;

    tokenComplement(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  COMPLEMENT_THRESHOLD(overrides?: CallOverrides): Promise<BigNumber>;

  getComplemenetedAssetsOut(
    _tokenAmountOut: BigNumberish,
    _nftAmountOut: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      tokenAmountOut: BigNumber;
      nftAmountOut: BigNumber;
      newTokenComplement: BigNumber;
      newNftComplement: BigNumber;
    }
  >;

  nftComplement(overrides?: CallOverrides): Promise<BigNumber>;

  tokenComplement(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    COMPLEMENT_THRESHOLD(overrides?: CallOverrides): Promise<BigNumber>;

    getComplemenetedAssetsOut(
      _tokenAmountOut: BigNumberish,
      _nftAmountOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        tokenAmountOut: BigNumber;
        nftAmountOut: BigNumber;
        newTokenComplement: BigNumber;
        newNftComplement: BigNumber;
      }
    >;

    nftComplement(overrides?: CallOverrides): Promise<BigNumber>;

    tokenComplement(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    COMPLEMENT_THRESHOLD(overrides?: CallOverrides): Promise<BigNumber>;

    getComplemenetedAssetsOut(
      _tokenAmountOut: BigNumberish,
      _nftAmountOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nftComplement(overrides?: CallOverrides): Promise<BigNumber>;

    tokenComplement(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    COMPLEMENT_PRECISION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    COMPLEMENT_THRESHOLD(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getComplemenetedAssetsOut(
      _tokenAmountOut: BigNumberish,
      _nftAmountOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nftComplement(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenComplement(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
