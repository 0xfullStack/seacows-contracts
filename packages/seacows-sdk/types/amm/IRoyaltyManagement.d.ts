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

interface IRoyaltyManagementInterface extends ethers.utils.Interface {
  functions: {
    "getRoyaltyRecipient(uint256)": FunctionFragment;
    "isRoyaltySupported()": FunctionFragment;
    "minRoyaltyFeePercent()": FunctionFragment;
    "royaltyFeeManager()": FunctionFragment;
    "royaltyRegistry()": FunctionFragment;
    "setMinRoyaltyFeePercent(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getRoyaltyRecipient",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isRoyaltySupported",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minRoyaltyFeePercent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "royaltyFeeManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "royaltyRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setMinRoyaltyFeePercent",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getRoyaltyRecipient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isRoyaltySupported",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minRoyaltyFeePercent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "royaltyFeeManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "royaltyRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMinRoyaltyFeePercent",
    data: BytesLike
  ): Result;

  events: {};
}

export class IRoyaltyManagement extends BaseContract {
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

  interface: IRoyaltyManagementInterface;

  functions: {
    getRoyaltyRecipient(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { recipient: string }>;

    isRoyaltySupported(overrides?: CallOverrides): Promise<[boolean]>;

    minRoyaltyFeePercent(overrides?: CallOverrides): Promise<[BigNumber]>;

    royaltyFeeManager(overrides?: CallOverrides): Promise<[string]>;

    royaltyRegistry(overrides?: CallOverrides): Promise<[string]>;

    setMinRoyaltyFeePercent(
      _percent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getRoyaltyRecipient(
    _tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  isRoyaltySupported(overrides?: CallOverrides): Promise<boolean>;

  minRoyaltyFeePercent(overrides?: CallOverrides): Promise<BigNumber>;

  royaltyFeeManager(overrides?: CallOverrides): Promise<string>;

  royaltyRegistry(overrides?: CallOverrides): Promise<string>;

  setMinRoyaltyFeePercent(
    _percent: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getRoyaltyRecipient(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    isRoyaltySupported(overrides?: CallOverrides): Promise<boolean>;

    minRoyaltyFeePercent(overrides?: CallOverrides): Promise<BigNumber>;

    royaltyFeeManager(overrides?: CallOverrides): Promise<string>;

    royaltyRegistry(overrides?: CallOverrides): Promise<string>;

    setMinRoyaltyFeePercent(
      _percent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getRoyaltyRecipient(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isRoyaltySupported(overrides?: CallOverrides): Promise<BigNumber>;

    minRoyaltyFeePercent(overrides?: CallOverrides): Promise<BigNumber>;

    royaltyFeeManager(overrides?: CallOverrides): Promise<BigNumber>;

    royaltyRegistry(overrides?: CallOverrides): Promise<BigNumber>;

    setMinRoyaltyFeePercent(
      _percent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getRoyaltyRecipient(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isRoyaltySupported(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    minRoyaltyFeePercent(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    royaltyFeeManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    royaltyRegistry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setMinRoyaltyFeePercent(
      _percent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
