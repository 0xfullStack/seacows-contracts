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
    "COMPLEMENT_PRECISION_DIGITS()": FunctionFragment;
    "caculateAssetsOutAfterComplemented(uint256,uint256,uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "COMPLEMENT_PRECISION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "COMPLEMENT_PRECISION_DIGITS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "caculateAssetsOutAfterComplemented",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "COMPLEMENT_PRECISION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "COMPLEMENT_PRECISION_DIGITS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "caculateAssetsOutAfterComplemented",
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

    COMPLEMENT_PRECISION_DIGITS(overrides?: CallOverrides): Promise<[number]>;

    caculateAssetsOutAfterComplemented(
      _tokenBalance: BigNumberish,
      _nftBalance: BigNumberish,
      _tokenExpectedOut: BigNumberish,
      _nftExpectedOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;
  };

  COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  COMPLEMENT_PRECISION_DIGITS(overrides?: CallOverrides): Promise<number>;

  caculateAssetsOutAfterComplemented(
    _tokenBalance: BigNumberish,
    _nftBalance: BigNumberish,
    _tokenExpectedOut: BigNumberish,
    _nftExpectedOut: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  callStatic: {
    COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    COMPLEMENT_PRECISION_DIGITS(overrides?: CallOverrides): Promise<number>;

    caculateAssetsOutAfterComplemented(
      _tokenBalance: BigNumberish,
      _nftBalance: BigNumberish,
      _tokenExpectedOut: BigNumberish,
      _nftExpectedOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;
  };

  filters: {};

  estimateGas: {
    COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    COMPLEMENT_PRECISION_DIGITS(overrides?: CallOverrides): Promise<BigNumber>;

    caculateAssetsOutAfterComplemented(
      _tokenBalance: BigNumberish,
      _nftBalance: BigNumberish,
      _tokenExpectedOut: BigNumberish,
      _nftExpectedOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    COMPLEMENT_PRECISION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    COMPLEMENT_PRECISION_DIGITS(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    caculateAssetsOutAfterComplemented(
      _tokenBalance: BigNumberish,
      _nftBalance: BigNumberish,
      _tokenExpectedOut: BigNumberish,
      _nftExpectedOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
