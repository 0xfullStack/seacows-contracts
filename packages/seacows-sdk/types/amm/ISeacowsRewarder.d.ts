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

interface ISeacowsRewarderInterface extends ethers.utils.Interface {
  functions: {
    "updatePositionFee(uint256)": FunctionFragment;
    "updatePositionFeeDebt(uint256)": FunctionFragment;
    "updateSwapFee()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "updatePositionFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePositionFeeDebt",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSwapFee",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "updatePositionFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updatePositionFeeDebt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSwapFee",
    data: BytesLike
  ): Result;

  events: {
    "CollectFee(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CollectFee"): EventFragment;
}

export type CollectFeeEvent = TypedEvent<
  [BigNumber, BigNumber] & { tokenId: BigNumber; fee: BigNumber }
>;

export class ISeacowsRewarder extends BaseContract {
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

  interface: ISeacowsRewarderInterface;

  functions: {
    updatePositionFee(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updatePositionFeeDebt(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateSwapFee(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  updatePositionFee(
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updatePositionFeeDebt(
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateSwapFee(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    updatePositionFee(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    updatePositionFeeDebt(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    updateSwapFee(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "CollectFee(uint256,uint256)"(
      tokenId?: BigNumberish | null,
      fee?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { tokenId: BigNumber; fee: BigNumber }
    >;

    CollectFee(
      tokenId?: BigNumberish | null,
      fee?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { tokenId: BigNumber; fee: BigNumber }
    >;
  };

  estimateGas: {
    updatePositionFee(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updatePositionFeeDebt(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateSwapFee(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    updatePositionFee(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updatePositionFeeDebt(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateSwapFee(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
