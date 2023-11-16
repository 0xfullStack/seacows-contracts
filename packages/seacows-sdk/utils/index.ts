import { BigNumber, utils, Contract, type Signer } from 'ethers';
import { type Provider } from '@ethersproject/abstract-provider';
import PAIR_ABI from '../abis/amm/ISeacowsERC721TradePair.json';
import ERC721_ABI from '../abis/common/ERC721.json';
import { type SeacowsERC721TradePair } from '../types/amm';
import { BI_ZERO } from '../constants';
import { type ERC721 } from '../types/periphery';

const getTokenInMax = (
  idsOut: number[],
  complement: BigNumber,
  tokenReserve: BigNumber,
  nftReserve: BigNumber,
  royaltyFeePercent: BigNumber,
  protocolFeeNumerator: BigNumber,
  feeNumerator: BigNumber,
  feeDenominator: BigNumber,
  slippageNumerator: number,
  slippageDenominator: number,
): { tokenInMax: BigNumber; tokenInMaxWithSlippage: BigNumber } => {
  const nftsOut = BigNumber.from(idsOut.length).mul(complement);
  const tokenIn = tokenReserve.mul(nftsOut).div(nftReserve.sub(nftsOut));

  // tokenInWithFee = tokenIn * (1 + Protocol Fee Percent + Fee Percent)
  const tokenInWithFee = tokenIn
    .mul(feeDenominator.add(protocolFeeNumerator).add(feeNumerator).add(royaltyFeePercent))
    .div(feeDenominator)
    .add(1);

  return {
    tokenInMax: tokenInWithFee,
    tokenInMaxWithSlippage: tokenInWithFee
      .mul(BigNumber.from(slippageDenominator + slippageNumerator))
      .div(BigNumber.from(slippageDenominator)),
  };
};

const getTokenOutMin = (
  idsIn: number[],
  complement: BigNumber,
  tokenReserve: BigNumber,
  nftReserve: BigNumber,
  royaltyFeePercent: BigNumber,
  protocolFeeNumerator: BigNumber,
  feeNumerator: BigNumber,
  feeDenominator: BigNumber,
  slippageNumerator: number,
  slippageDenominator: number,
): { tokenOutMin: BigNumber; tokenOutMinWithSlippage: BigNumber } => {
  const nftsIn = BigNumber.from(idsIn.length).mul(complement);
  const tokenOut = tokenReserve.mul(nftsIn).div(nftReserve.add(nftsIn));

  // tokenOutWithFee = tokenOut * (1 - Protocol Fee Percent - Fee Percent)
  const tokenOutWithFee = tokenOut
    .mul(feeDenominator.sub(feeNumerator).sub(protocolFeeNumerator).sub(royaltyFeePercent))
    .div(feeDenominator);

  return {
    tokenOutMin: tokenOutWithFee,
    tokenOutMinWithSlippage: tokenOutWithFee
      .mul(BigNumber.from(slippageDenominator - slippageNumerator))
      .div(BigNumber.from(slippageDenominator)),
  };
};

/**
  @notice Calculate the Max. Token input amount when user buy NFT(s) from pool
  @param pair The Pair contract address or the Pair contract interface
  @param idsOut The NFT ids the user wants to buy
  @param slippageNumerator The Slippage Tolerance Numerator. E.g. 3% slipage, use 3. Default: 0
  @param slippageDenominator The Slippage Tolerance Denominator E.g. 3% slipage, use 100. Default: 100
  @param signerOrProvider [Optional] The ethers signer or ether provider
*/
const getSwapTokenInMax = async (
  pair: string | SeacowsERC721TradePair,
  idsOut: number[],
  royaltyFeePercent: BigNumber,
  slippageNumerator: number = 0,
  slippageDenominator: number = 100,
  signerOrProvider?: Signer | Provider,
): Promise<{ tokenInMax: BigNumber; tokenInMaxWithSlippage: BigNumber }> => {
  const pairContract =
    typeof pair === 'string' ? (new Contract(pair, PAIR_ABI, signerOrProvider) as SeacowsERC721TradePair) : pair;

  const complement = await pairContract.COMPLEMENT_PRECISION();
  const [tokenReserve, nftReserve] = await pairContract.getReserves();
  const feeNumerator = await pairContract.feePercent();
  const protocolFeeNumerator = await pairContract.protocolFeePercent();
  const feeDenominator = await pairContract.PERCENTAGE_PRECISION();
  return getTokenInMax(
    idsOut,
    complement,
    tokenReserve,
    nftReserve,
    royaltyFeePercent,
    protocolFeeNumerator,
    feeNumerator,
    feeDenominator,
    slippageNumerator,
    slippageDenominator,
  );
};

/**
  @notice Calculate the Min. Token output amount when user sell NFT(s) to pool
  @param pair The Pair contract address or the Pair contract interface
  @param idsIn The NFT ids the user wants to sell
  @param slippageNumerator The Slippage Tolerance Numerator. E.g. 3% slipage, use 3. Default: 0
  @param slippageDenominator The Slippage Tolerance Denominator E.g. 3% slipage, use 100. Default: 100
  @param signerOrProvider [Optional] The ethers signer or ether provider
*/
const getSwapTokenOutMin = async (
  pair: string | SeacowsERC721TradePair,
  idsIn: number[],
  royaltyFeePercent: BigNumber,
  slippageNumerator: number = 0,
  slippageDenominator: number = 100,
  signerOrProvider?: Signer | Provider,
): Promise<{ tokenOutMin: BigNumber; tokenOutMinWithSlippage: BigNumber }> => {
  const pairContract =
    typeof pair === 'string' ? (new Contract(pair, PAIR_ABI, signerOrProvider) as SeacowsERC721TradePair) : pair;

  const complement = await pairContract.COMPLEMENT_PRECISION();
  const [tokenReserve, nftReserve] = await pairContract.getReserves();
  const feeNumerator = await pairContract.feePercent();
  const protocolFeeNumerator = await pairContract.protocolFeePercent();
  const feeDenominator = await pairContract.PERCENTAGE_PRECISION();

  return getTokenOutMin(
    idsIn,
    complement,
    tokenReserve,
    nftReserve,
    royaltyFeePercent,
    protocolFeeNumerator,
    feeNumerator,
    feeDenominator,
    slippageNumerator,
    slippageDenominator,
  );
};

/**
  @notice Calculate the Max. Token input amount when user add liquidity to pool
  @param pair The Pair contract address or the Pair contract interface
  @param idsIn The NFT ids the user wants to sell
  @param slippageNumerator The Slippage Tolerance Numerator. E.g. 3% slipage, use 3. Default: 0
  @param slippageDenominator The Slippage Tolerance Denominator E.g. 3% slipage, use 100. Default: 100
  @param signerOrProvider [Optional] The ethers signer or ether provider
*/
const getDepositTokenInMax = async (
  pair: string | SeacowsERC721TradePair,
  idsIn: number[],
  slippageNumerator: number = 0,
  slippageDenominator: number = 100,
  signerOrProvider?: Signer | Provider,
): Promise<{ tokenInMax: BigNumber; tokenInMaxWithSlippage: BigNumber }> => {
  const pairContract =
    typeof pair === 'string' ? (new Contract(pair, PAIR_ABI, signerOrProvider) as SeacowsERC721TradePair) : pair;

  const complement = await pairContract.COMPLEMENT_PRECISION();
  const [tokenReserve, nftReserve] = await pairContract.getReserves();
  const tokenInMax = tokenReserve.mul(idsIn.length).mul(complement).div(nftReserve);
  return {
    tokenInMax,
    tokenInMaxWithSlippage: tokenInMax
      .mul(BigNumber.from(slippageDenominator + slippageNumerator))
      .div(BigNumber.from(slippageDenominator)),
  };
};

/**
  @notice Calculate the min token and nft when user want to remove liquidity from pool
  @param pair The Pair contract address or the Pair contract interface
  @param liquidity The amount of liquidity to be burnt
  @param slippageNumerator The Slippage Tolerance Numerator. E.g. 3% slipage, use 3. Default: 0
  @param slippageDenominator The Slippage Tolerance Denominator E.g. 3% slipage, use 100. Default: 100
  @param signerOrProvider [Optional] The ethers signer or ether provider
*/
const getWithdrawAssetsOutMin = async (
  pair: string | SeacowsERC721TradePair,
  liquidity: BigNumber,
  slippageNumerator: number = 0,
  slippageDenominator: number = 100,
  signerOrProvider?: Signer | Provider,
): Promise<{
  cTokenOutMin: BigNumber;
  cNftOutMin: BigNumber;
  tokenOut: BigNumber;
  nftOut: BigNumber;
}> => {
  const pairContract =
    typeof pair === 'string' ? (new Contract(pair, PAIR_ABI, signerOrProvider) as SeacowsERC721TradePair) : pair;

  const [tokenBalance, nftBalance] = await pairContract.getComplementedBalance();

  const totalSupply = await pairContract.totalSupply();

  const tokenExpectedOut = liquidity.mul(tokenBalance).div(totalSupply);
  const nftExpectedOut = liquidity.mul(nftBalance).div(totalSupply);

  const tokenExpectedOutMin = tokenExpectedOut
    .mul(BigNumber.from(slippageDenominator - slippageNumerator))
    .div(BigNumber.from(slippageDenominator));
  const nftExpectedOutMin = nftExpectedOut
    .mul(BigNumber.from(slippageDenominator - slippageNumerator))
    .div(BigNumber.from(slippageDenominator));

  const [tokenOut, nftOut] = await pairContract.caculateAssetsOutAfterComplemented(
    tokenBalance,
    nftBalance,
    tokenExpectedOut,
    nftExpectedOut,
  );

  return {
    cTokenOutMin: tokenExpectedOutMin,
    cNftOutMin: nftExpectedOutMin,
    tokenOut,
    nftOut,
  };
};

export {
  getTokenInMax,
  getTokenOutMin,
  getSwapTokenInMax,
  getSwapTokenOutMin,
  getDepositTokenInMax,
  getWithdrawAssetsOutMin,
};
