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

interface IRoyaltyRegistryInterface extends ethers.utils.Interface {
  functions: {
    "getRoyaltyLookupAddress(address)": FunctionFragment;
    "overrideAllowed(address)": FunctionFragment;
    "setRoyaltyLookupAddress(address,address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getRoyaltyLookupAddress",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "overrideAllowed",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setRoyaltyLookupAddress",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getRoyaltyLookupAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "overrideAllowed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRoyaltyLookupAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {
    "RoyaltyOverride(address,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "RoyaltyOverride"): EventFragment;
}

export type RoyaltyOverrideEvent = TypedEvent<
  [string, string, string] & {
    owner: string;
    tokenAddress: string;
    royaltyAddress: string;
  }
>;

export class IRoyaltyRegistry extends BaseContract {
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

  interface: IRoyaltyRegistryInterface;

  functions: {
    getRoyaltyLookupAddress(
      tokenAddress: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    overrideAllowed(
      tokenAddress: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    setRoyaltyLookupAddress(
      tokenAddress: string,
      royaltyAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  getRoyaltyLookupAddress(
    tokenAddress: string,
    overrides?: CallOverrides
  ): Promise<string>;

  overrideAllowed(
    tokenAddress: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  setRoyaltyLookupAddress(
    tokenAddress: string,
    royaltyAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    getRoyaltyLookupAddress(
      tokenAddress: string,
      overrides?: CallOverrides
    ): Promise<string>;

    overrideAllowed(
      tokenAddress: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    setRoyaltyLookupAddress(
      tokenAddress: string,
      royaltyAddress: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "RoyaltyOverride(address,address,address)"(
      owner?: null,
      tokenAddress?: null,
      royaltyAddress?: null
    ): TypedEventFilter<
      [string, string, string],
      { owner: string; tokenAddress: string; royaltyAddress: string }
    >;

    RoyaltyOverride(
      owner?: null,
      tokenAddress?: null,
      royaltyAddress?: null
    ): TypedEventFilter<
      [string, string, string],
      { owner: string; tokenAddress: string; royaltyAddress: string }
    >;
  };

  estimateGas: {
    getRoyaltyLookupAddress(
      tokenAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    overrideAllowed(
      tokenAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setRoyaltyLookupAddress(
      tokenAddress: string,
      royaltyAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getRoyaltyLookupAddress(
      tokenAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    overrideAllowed(
      tokenAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setRoyaltyLookupAddress(
      tokenAddress: string,
      royaltyAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
