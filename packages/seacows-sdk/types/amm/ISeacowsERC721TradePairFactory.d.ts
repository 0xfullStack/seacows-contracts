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

interface ISeacowsERC721TradePairFactoryInterface
  extends ethers.utils.Interface {
  functions: {
    "getPair(address,address,uint112)": FunctionFragment;
    "template()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getPair",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "template", values?: undefined): string;

  decodeFunctionResult(functionFragment: "getPair", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "template", data: BytesLike): Result;

  events: {};
}

export class ISeacowsERC721TradePairFactory extends BaseContract {
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

  interface: ISeacowsERC721TradePairFactoryInterface;

  functions: {
    getPair(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    template(overrides?: CallOverrides): Promise<[string]>;
  };

  getPair(
    _collection: string,
    _token: string,
    _fee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  template(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    getPair(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    template(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    getPair(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    template(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getPair(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    template(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
