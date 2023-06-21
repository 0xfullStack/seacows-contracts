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

interface SeacowsRewarderInterface extends ethers.utils.Interface {
  functions: {
    "ACC_REWARD_PER_SHARE_PRECISION()": FunctionFragment;
    "accRewardPerShare()": FunctionFragment;
    "balanceOf(uint256)": FunctionFragment;
    "collect(uint256)": FunctionFragment;
    "collection()": FunctionFragment;
    "getPendingReward(uint256)": FunctionFragment;
    "lastRewardBalance()": FunctionFragment;
    "onERC3525Received(address,uint256,uint256,uint256,bytes)": FunctionFragment;
    "onERC721Received(address,address,uint256,bytes)": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "positionInfos(uint256)": FunctionFragment;
    "positionManager()": FunctionFragment;
    "rewardBalance()": FunctionFragment;
    "slot()": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "token()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "updateReward()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "ACC_REWARD_PER_SHARE_PRECISION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "accRewardPerShare",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collect",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collection",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPendingReward",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "lastRewardBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "onERC3525Received",
    values: [string, BigNumberish, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [string, string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "positionInfos",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "positionManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardBalance",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "slot", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "updateReward",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "ACC_REWARD_PER_SHARE_PRECISION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "accRewardPerShare",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "collect", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "collection", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPendingReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastRewardBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC3525Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "positionInfos",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "positionManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "slot", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateReward",
    data: BytesLike
  ): Result;

  events: {
    "Initialized(uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}

export type InitializedEvent = TypedEvent<[number] & { version: number }>;

export class SeacowsRewarder extends BaseContract {
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

  interface: SeacowsRewarderInterface;

  functions: {
    ACC_REWARD_PER_SHARE_PRECISION(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    accRewardPerShare(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    collect(
      _tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    collection(overrides?: CallOverrides): Promise<[string]>;

    getPendingReward(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    lastRewardBalance(overrides?: CallOverrides): Promise<[BigNumber]>;

    onERC3525Received(
      _operator: string,
      _fromTokenId: BigNumberish,
      _toTokenId: BigNumberish,
      _value: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ownerOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    positionInfos(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        rewardDebt: BigNumber;
        unclaimedReward: BigNumber;
      }
    >;

    positionManager(overrides?: CallOverrides): Promise<[string]>;

    rewardBalance(overrides?: CallOverrides): Promise<[BigNumber]>;

    slot(overrides?: CallOverrides): Promise<[BigNumber]>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    token(overrides?: CallOverrides): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    updateReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  ACC_REWARD_PER_SHARE_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  accRewardPerShare(overrides?: CallOverrides): Promise<BigNumber>;

  balanceOf(
    _tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  collect(
    _tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  collection(overrides?: CallOverrides): Promise<string>;

  getPendingReward(
    _tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  lastRewardBalance(overrides?: CallOverrides): Promise<BigNumber>;

  onERC3525Received(
    _operator: string,
    _fromTokenId: BigNumberish,
    _toTokenId: BigNumberish,
    _value: BigNumberish,
    _data: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  onERC721Received(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    arg3: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ownerOf(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  positionInfos(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & {
      rewardDebt: BigNumber;
      unclaimedReward: BigNumber;
    }
  >;

  positionManager(overrides?: CallOverrides): Promise<string>;

  rewardBalance(overrides?: CallOverrides): Promise<BigNumber>;

  slot(overrides?: CallOverrides): Promise<BigNumber>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  token(overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  updateReward(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    ACC_REWARD_PER_SHARE_PRECISION(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    accRewardPerShare(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collect(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    collection(overrides?: CallOverrides): Promise<string>;

    getPendingReward(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lastRewardBalance(overrides?: CallOverrides): Promise<BigNumber>;

    onERC3525Received(
      _operator: string,
      _fromTokenId: BigNumberish,
      _toTokenId: BigNumberish,
      _value: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    ownerOf(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    positionInfos(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        rewardDebt: BigNumber;
        unclaimedReward: BigNumber;
      }
    >;

    positionManager(overrides?: CallOverrides): Promise<string>;

    rewardBalance(overrides?: CallOverrides): Promise<BigNumber>;

    slot(overrides?: CallOverrides): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    token(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    updateReward(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "Initialized(uint8)"(
      version?: null
    ): TypedEventFilter<[number], { version: number }>;

    Initialized(
      version?: null
    ): TypedEventFilter<[number], { version: number }>;
  };

  estimateGas: {
    ACC_REWARD_PER_SHARE_PRECISION(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    accRewardPerShare(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collect(
      _tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    collection(overrides?: CallOverrides): Promise<BigNumber>;

    getPendingReward(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lastRewardBalance(overrides?: CallOverrides): Promise<BigNumber>;

    onERC3525Received(
      _operator: string,
      _fromTokenId: BigNumberish,
      _toTokenId: BigNumberish,
      _value: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ownerOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    positionInfos(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    positionManager(overrides?: CallOverrides): Promise<BigNumber>;

    rewardBalance(overrides?: CallOverrides): Promise<BigNumber>;

    slot(overrides?: CallOverrides): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    updateReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ACC_REWARD_PER_SHARE_PRECISION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    accRewardPerShare(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    collect(
      _tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    collection(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPendingReward(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lastRewardBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    onERC3525Received(
      _operator: string,
      _fromTokenId: BigNumberish,
      _toTokenId: BigNumberish,
      _value: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ownerOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    positionInfos(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    positionManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    slot(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    updateReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
