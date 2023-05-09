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

interface IERC3525MetadataDescriptorInterface extends ethers.utils.Interface {
  functions: {
    "constructContractURI()": FunctionFragment;
    "constructSlotURI(uint256)": FunctionFragment;
    "constructTokenURI(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "constructContractURI",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "constructSlotURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "constructTokenURI",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "constructContractURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "constructSlotURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "constructTokenURI",
    data: BytesLike
  ): Result;

  events: {};
}

export class IERC3525MetadataDescriptor extends BaseContract {
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

  interface: IERC3525MetadataDescriptorInterface;

  functions: {
    constructContractURI(overrides?: CallOverrides): Promise<[string]>;

    constructSlotURI(
      slot: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    constructTokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  constructContractURI(overrides?: CallOverrides): Promise<string>;

  constructSlotURI(
    slot: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  constructTokenURI(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    constructContractURI(overrides?: CallOverrides): Promise<string>;

    constructSlotURI(
      slot: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    constructTokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    constructContractURI(overrides?: CallOverrides): Promise<BigNumber>;

    constructSlotURI(
      slot: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    constructTokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    constructContractURI(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    constructSlotURI(
      slot: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    constructTokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
