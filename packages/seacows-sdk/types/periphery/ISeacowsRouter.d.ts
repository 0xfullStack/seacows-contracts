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

interface ISeacowsRouterInterface extends ethers.utils.Interface {
  functions: {
    "batchSwapExactNFTsForTokens(address[],uint256[][],uint256[],address,uint256)": FunctionFragment;
    "batchSwapTokensForExactNFTs(address[],uint256[][],uint256[],address,uint256)": FunctionFragment;
    "swapExactNFTsForTokens(address,uint256[],uint256,address,uint256)": FunctionFragment;
    "swapTokensForExactNFTs(address,uint256[],uint256,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "batchSwapExactNFTsForTokens",
    values: [string[], BigNumberish[][], BigNumberish[], string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "batchSwapTokensForExactNFTs",
    values: [string[], BigNumberish[][], BigNumberish[], string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapExactNFTsForTokens",
    values: [string, BigNumberish[], BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapTokensForExactNFTs",
    values: [string, BigNumberish[], BigNumberish, string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "batchSwapExactNFTsForTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "batchSwapTokensForExactNFTs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapExactNFTsForTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapTokensForExactNFTs",
    data: BytesLike
  ): Result;

  events: {};
}

export class ISeacowsRouter extends BaseContract {
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

  interface: ISeacowsRouterInterface;

  functions: {
    batchSwapExactNFTsForTokens(
      _pairs: string[],
      idsIns: BigNumberish[][],
      amountOutMins: BigNumberish[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    batchSwapTokensForExactNFTs(
      _pairs: string[],
      idsOut: BigNumberish[][],
      amountInMaxs: BigNumberish[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapExactNFTsForTokens(
      _pair: string,
      idsIn: BigNumberish[],
      amountOutMin: BigNumberish,
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapTokensForExactNFTs(
      _pair: string,
      idsOut: BigNumberish[],
      amountInMax: BigNumberish,
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  batchSwapExactNFTsForTokens(
    _pairs: string[],
    idsIns: BigNumberish[][],
    amountOutMins: BigNumberish[],
    to: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  batchSwapTokensForExactNFTs(
    _pairs: string[],
    idsOut: BigNumberish[][],
    amountInMaxs: BigNumberish[],
    to: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapExactNFTsForTokens(
    _pair: string,
    idsIn: BigNumberish[],
    amountOutMin: BigNumberish,
    to: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapTokensForExactNFTs(
    _pair: string,
    idsOut: BigNumberish[],
    amountInMax: BigNumberish,
    to: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    batchSwapExactNFTsForTokens(
      _pairs: string[],
      idsIns: BigNumberish[][],
      amountOutMins: BigNumberish[],
      to: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    batchSwapTokensForExactNFTs(
      _pairs: string[],
      idsOut: BigNumberish[][],
      amountInMaxs: BigNumberish[],
      to: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    swapExactNFTsForTokens(
      _pair: string,
      idsIn: BigNumberish[],
      amountOutMin: BigNumberish,
      to: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    swapTokensForExactNFTs(
      _pair: string,
      idsOut: BigNumberish[],
      amountInMax: BigNumberish,
      to: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    batchSwapExactNFTsForTokens(
      _pairs: string[],
      idsIns: BigNumberish[][],
      amountOutMins: BigNumberish[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    batchSwapTokensForExactNFTs(
      _pairs: string[],
      idsOut: BigNumberish[][],
      amountInMaxs: BigNumberish[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapExactNFTsForTokens(
      _pair: string,
      idsIn: BigNumberish[],
      amountOutMin: BigNumberish,
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapTokensForExactNFTs(
      _pair: string,
      idsOut: BigNumberish[],
      amountInMax: BigNumberish,
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    batchSwapExactNFTsForTokens(
      _pairs: string[],
      idsIns: BigNumberish[][],
      amountOutMins: BigNumberish[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    batchSwapTokensForExactNFTs(
      _pairs: string[],
      idsOut: BigNumberish[][],
      amountInMaxs: BigNumberish[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapExactNFTsForTokens(
      _pair: string,
      idsIn: BigNumberish[],
      amountOutMin: BigNumberish,
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapTokensForExactNFTs(
      _pair: string,
      idsOut: BigNumberish[],
      amountInMax: BigNumberish,
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
