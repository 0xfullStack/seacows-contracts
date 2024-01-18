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
    "MAX_PROTOCOL_FEE_PERCENT()": FunctionFragment;
    "ONE_PERCENT()": FunctionFragment;
    "PERCENTAGE_PRECISION()": FunctionFragment;
    "POINT_FIVE_PERCENT()": FunctionFragment;
    "balanceOf(uint256)": FunctionFragment;
    "burn(address,address,uint256[])": FunctionFragment;
    "caculateAssetsOutAfterComplemented(uint256,uint256,uint256,uint256)": FunctionFragment;
    "collection()": FunctionFragment;
    "feePercent()": FunctionFragment;
    "getBalances()": FunctionFragment;
    "getReserves()": FunctionFragment;
    "getRoyaltyRecipient(uint256)": FunctionFragment;
    "initialize(address,address,uint256)": FunctionFragment;
    "isRoyaltySupported()": FunctionFragment;
    "minRoyaltyFeePercent()": FunctionFragment;
    "mint(uint256)": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "protocolFeePercent()": FunctionFragment;
    "royaltyFeeManager()": FunctionFragment;
    "royaltyRegistry()": FunctionFragment;
    "setMinRoyaltyFeePercent(uint256)": FunctionFragment;
    "setProtocolFeePercent(uint256)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "swap(uint256,uint256[],address,bytes)": FunctionFragment;
    "token()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "updatePositionFee(uint256)": FunctionFragment;
    "updatePositionFeeDebt(uint256)": FunctionFragment;
    "updateSwapFee()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "COMPLEMENT_PRECISION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MAX_PROTOCOL_FEE_PERCENT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ONE_PERCENT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "PERCENTAGE_PRECISION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "POINT_FIVE_PERCENT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "burn",
    values: [string, string, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "caculateAssetsOutAfterComplemented",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collection",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "feePercent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getBalances",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getReserves",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRoyaltyRecipient",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isRoyaltySupported",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minRoyaltyFeePercent",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "mint", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "protocolFeePercent",
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
  encodeFunctionData(
    functionFragment: "setProtocolFeePercent",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "swap",
    values: [BigNumberish, BigNumberish[], string, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
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
    functionFragment: "COMPLEMENT_PRECISION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MAX_PROTOCOL_FEE_PERCENT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ONE_PERCENT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "PERCENTAGE_PRECISION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "POINT_FIVE_PERCENT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "caculateAssetsOutAfterComplemented",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "collection", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feePercent", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getBalances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReserves",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoyaltyRecipient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isRoyaltySupported",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minRoyaltyFeePercent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "protocolFeePercent",
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
  decodeFunctionResult(
    functionFragment: "setProtocolFeePercent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
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
    "Burn(address,uint256,uint256,uint256,uint256[],address)": EventFragment;
    "CollectFee(uint256,uint256)": EventFragment;
    "Mint(address,uint256,uint256)": EventFragment;
    "Swap(address,uint256,uint256,uint256,uint256,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Burn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CollectFee"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Mint"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Swap"): EventFragment;
}

export type BurnEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, BigNumber[], string] & {
    sender: string;
    cTokenOut: BigNumber;
    cNftOut: BigNumber;
    tokenAmountOut: BigNumber;
    idsOut: BigNumber[];
    to: string;
  }
>;

export type CollectFeeEvent = TypedEvent<
  [BigNumber, BigNumber] & { tokenId: BigNumber; fee: BigNumber }
>;

export type MintEvent = TypedEvent<
  [string, BigNumber, BigNumber] & {
    sender: string;
    tokenAmount: BigNumber;
    nftAmount: BigNumber;
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

    MAX_PROTOCOL_FEE_PERCENT(overrides?: CallOverrides): Promise<[BigNumber]>;

    ONE_PERCENT(overrides?: CallOverrides): Promise<[BigNumber]>;

    PERCENTAGE_PRECISION(overrides?: CallOverrides): Promise<[BigNumber]>;

    POINT_FIVE_PERCENT(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    burn(
      from: string,
      to: string,
      ids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    caculateAssetsOutAfterComplemented(
      _tokenBalance: BigNumberish,
      _nftBalance: BigNumberish,
      _tokenExpectedOut: BigNumberish,
      _nftExpectedOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    collection(overrides?: CallOverrides): Promise<[string]>;

    feePercent(overrides?: CallOverrides): Promise<[BigNumber]>;

    getBalances(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _balance0: BigNumber; _balance1: BigNumber }
    >;

    getReserves(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _reserve0: BigNumber; _reserve1: BigNumber }
    >;

    getRoyaltyRecipient(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { recipient: string }>;

    initialize(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isRoyaltySupported(overrides?: CallOverrides): Promise<[boolean]>;

    minRoyaltyFeePercent(overrides?: CallOverrides): Promise<[BigNumber]>;

    mint(
      toTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ownerOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    protocolFeePercent(overrides?: CallOverrides): Promise<[BigNumber]>;

    royaltyFeeManager(overrides?: CallOverrides): Promise<[string]>;

    royaltyRegistry(overrides?: CallOverrides): Promise<[string]>;

    setMinRoyaltyFeePercent(
      _percent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setProtocolFeePercent(
      _protocolFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    swap(
      tokenAmountOut: BigNumberish,
      idsOut: BigNumberish[],
      to: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

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

  COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  MAX_PROTOCOL_FEE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

  ONE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

  PERCENTAGE_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  POINT_FIVE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

  balanceOf(
    _tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  burn(
    from: string,
    to: string,
    ids: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  caculateAssetsOutAfterComplemented(
    _tokenBalance: BigNumberish,
    _nftBalance: BigNumberish,
    _tokenExpectedOut: BigNumberish,
    _nftExpectedOut: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  collection(overrides?: CallOverrides): Promise<string>;

  feePercent(overrides?: CallOverrides): Promise<BigNumber>;

  getBalances(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { _balance0: BigNumber; _balance1: BigNumber }
  >;

  getReserves(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { _reserve0: BigNumber; _reserve1: BigNumber }
  >;

  getRoyaltyRecipient(
    _tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  initialize(
    _collection: string,
    _token: string,
    _fee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isRoyaltySupported(overrides?: CallOverrides): Promise<boolean>;

  minRoyaltyFeePercent(overrides?: CallOverrides): Promise<BigNumber>;

  mint(
    toTokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ownerOf(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  protocolFeePercent(overrides?: CallOverrides): Promise<BigNumber>;

  royaltyFeeManager(overrides?: CallOverrides): Promise<string>;

  royaltyRegistry(overrides?: CallOverrides): Promise<string>;

  setMinRoyaltyFeePercent(
    _percent: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setProtocolFeePercent(
    _protocolFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  swap(
    tokenAmountOut: BigNumberish,
    idsOut: BigNumberish[],
    to: string,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

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
    COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    MAX_PROTOCOL_FEE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    ONE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    PERCENTAGE_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    POINT_FIVE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      from: string,
      to: string,
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber[]] & {
        cTokenOut: BigNumber;
        cNftOut: BigNumber;
        tokenOut: BigNumber;
        idsOut: BigNumber[];
      }
    >;

    caculateAssetsOutAfterComplemented(
      _tokenBalance: BigNumberish,
      _nftBalance: BigNumberish,
      _tokenExpectedOut: BigNumberish,
      _nftExpectedOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    collection(overrides?: CallOverrides): Promise<string>;

    feePercent(overrides?: CallOverrides): Promise<BigNumber>;

    getBalances(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _balance0: BigNumber; _balance1: BigNumber }
    >;

    getReserves(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _reserve0: BigNumber; _reserve1: BigNumber }
    >;

    getRoyaltyRecipient(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    initialize(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    isRoyaltySupported(overrides?: CallOverrides): Promise<boolean>;

    minRoyaltyFeePercent(overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      toTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ownerOf(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    protocolFeePercent(overrides?: CallOverrides): Promise<BigNumber>;

    royaltyFeeManager(overrides?: CallOverrides): Promise<string>;

    royaltyRegistry(overrides?: CallOverrides): Promise<string>;

    setMinRoyaltyFeePercent(
      _percent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setProtocolFeePercent(
      _protocolFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    swap(
      tokenAmountOut: BigNumberish,
      idsOut: BigNumberish[],
      to: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

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
    "Burn(address,uint256,uint256,uint256,uint256[],address)"(
      sender?: string | null,
      cTokenOut?: null,
      cNftOut?: null,
      tokenAmountOut?: null,
      idsOut?: null,
      to?: string | null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber, BigNumber[], string],
      {
        sender: string;
        cTokenOut: BigNumber;
        cNftOut: BigNumber;
        tokenAmountOut: BigNumber;
        idsOut: BigNumber[];
        to: string;
      }
    >;

    Burn(
      sender?: string | null,
      cTokenOut?: null,
      cNftOut?: null,
      tokenAmountOut?: null,
      idsOut?: null,
      to?: string | null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber, BigNumber[], string],
      {
        sender: string;
        cTokenOut: BigNumber;
        cNftOut: BigNumber;
        tokenAmountOut: BigNumber;
        idsOut: BigNumber[];
        to: string;
      }
    >;

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

    "Mint(address,uint256,uint256)"(
      sender?: string | null,
      tokenAmount?: null,
      nftAmount?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { sender: string; tokenAmount: BigNumber; nftAmount: BigNumber }
    >;

    Mint(
      sender?: string | null,
      tokenAmount?: null,
      nftAmount?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { sender: string; tokenAmount: BigNumber; nftAmount: BigNumber }
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
  };

  estimateGas: {
    COMPLEMENT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    MAX_PROTOCOL_FEE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    ONE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    PERCENTAGE_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    POINT_FIVE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      from: string,
      to: string,
      ids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    caculateAssetsOutAfterComplemented(
      _tokenBalance: BigNumberish,
      _nftBalance: BigNumberish,
      _tokenExpectedOut: BigNumberish,
      _nftExpectedOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collection(overrides?: CallOverrides): Promise<BigNumber>;

    feePercent(overrides?: CallOverrides): Promise<BigNumber>;

    getBalances(overrides?: CallOverrides): Promise<BigNumber>;

    getReserves(overrides?: CallOverrides): Promise<BigNumber>;

    getRoyaltyRecipient(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isRoyaltySupported(overrides?: CallOverrides): Promise<BigNumber>;

    minRoyaltyFeePercent(overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      toTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ownerOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    protocolFeePercent(overrides?: CallOverrides): Promise<BigNumber>;

    royaltyFeeManager(overrides?: CallOverrides): Promise<BigNumber>;

    royaltyRegistry(overrides?: CallOverrides): Promise<BigNumber>;

    setMinRoyaltyFeePercent(
      _percent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setProtocolFeePercent(
      _protocolFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    swap(
      tokenAmountOut: BigNumberish,
      idsOut: BigNumberish[],
      to: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

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
    COMPLEMENT_PRECISION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    MAX_PROTOCOL_FEE_PERCENT(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ONE_PERCENT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    PERCENTAGE_PRECISION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    POINT_FIVE_PERCENT(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burn(
      from: string,
      to: string,
      ids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    caculateAssetsOutAfterComplemented(
      _tokenBalance: BigNumberish,
      _nftBalance: BigNumberish,
      _tokenExpectedOut: BigNumberish,
      _nftExpectedOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    collection(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feePercent(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getBalances(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getReserves(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRoyaltyRecipient(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _collection: string,
      _token: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isRoyaltySupported(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    minRoyaltyFeePercent(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mint(
      toTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ownerOf(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    protocolFeePercent(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    royaltyFeeManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    royaltyRegistry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setMinRoyaltyFeePercent(
      _percent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setProtocolFeePercent(
      _protocolFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    swap(
      tokenAmountOut: BigNumberish,
      idsOut: BigNumberish[],
      to: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

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
