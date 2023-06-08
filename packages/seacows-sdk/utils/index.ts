import { BigNumber, Contract, type Signer } from 'ethers';
import { type Provider } from '@ethersproject/abstract-provider';
import PAIR_ABI from '../abis/amm/ISeacowsERC721TradePair.json';
import { type SeacowsERC721TradePair } from '../types/amm';
import { BI_ZERO } from '../constants';

const getTokenInMax = (
  idsOut: number[],
  complement: BigNumber,
  tokenReserve: BigNumber,
  nftReserve: BigNumber,
  feeNumerator: BigNumber,
  feeDenominator: BigNumber,
  slippageNumerator: number,
  slippageDenominator: number,
): { tokenInMax: BigNumber; tokenInMaxWithSlippage: BigNumber } => {
  const nftsOut = BigNumber.from(idsOut.length).mul(complement);
  const tokenIn = tokenReserve.mul(nftsOut).div(nftReserve.sub(nftsOut));
  const tokenInWithFee = tokenIn.mul(feeDenominator).div(feeDenominator.sub(feeNumerator)).add(1);
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
  feeNumerator: BigNumber,
  feeDenominator: BigNumber,
  slippageNumerator: number,
  slippageDenominator: number,
): { tokenOutMin: BigNumber; tokenOutMinWithSlippage: BigNumber } => {
  const nftsIn = BigNumber.from(idsIn.length).mul(complement);
  const tokenOut = tokenReserve.mul(nftsIn).div(nftReserve.add(nftsIn));
  const tokenOutWithFee = tokenOut.mul(feeDenominator.sub(feeNumerator)).div(feeDenominator);
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
  slippageNumerator: number = 0,
  slippageDenominator: number = 100,
  signerOrProvider?: Signer | Provider,
): Promise<{ tokenInMax: BigNumber; tokenInMaxWithSlippage: BigNumber }> => {
  const pairContract =
    typeof pair === 'string' ? (new Contract(pair, PAIR_ABI, signerOrProvider) as SeacowsERC721TradePair) : pair;

  const complement = await pairContract.COMPLEMENT_PRECISION();
  const [tokenReserve, nftReserve] = await pairContract.getReserves();
  const feeNumerator = await pairContract.fee();
  const feeDenominator = await pairContract.PERCENTAGE_PRECISION();
  return getTokenInMax(
    idsOut,
    complement,
    tokenReserve,
    nftReserve,
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
  slippageNumerator: number = 0,
  slippageDenominator: number = 100,
  signerOrProvider?: Signer | Provider,
): Promise<{ tokenOutMin: BigNumber; tokenOutMinWithSlippage: BigNumber }> => {
  const pairContract =
    typeof pair === 'string' ? (new Contract(pair, PAIR_ABI, signerOrProvider) as SeacowsERC721TradePair) : pair;

  const complement = await pairContract.COMPLEMENT_PRECISION();
  const [tokenReserve, nftReserve] = await pairContract.getReserves();
  const feeNumerator = await pairContract.fee();
  const feeDenominator = await pairContract.PERCENTAGE_PRECISION();

  return getTokenOutMin(
    idsIn,
    complement,
    tokenReserve,
    nftReserve,
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

const getAssetsInOutRange = (
  tokenOut: BigNumber,
  nftOut: BigNumber,
  complement: BigNumber,
): {
  tokenInRange: [BigNumber, BigNumber];
  tokenOutRange: [BigNumber, BigNumber];
  nftOutRange: [number, number];
} => {
  const quotient = tokenOut.div(complement).mul(complement);
  const remainder = tokenOut.sub(quotient);

  // Calculate for NFT out Min, Token out Max
  const tokenOutMax = tokenOut.mul(remainder.add(nftOut).div(nftOut));

  // Calculatefor NFT out Max, Token out Min
  let tokenOutMin;
  let tokenInMax;
  const extraNft = complement.sub(remainder);
  if (tokenOut.gte(complement.div(2))) {
    tokenInMax = tokenOut.mul(extraNft.sub(nftOut).div(nftOut));
    tokenOutMin = BI_ZERO;
  } else {
    tokenInMax = BI_ZERO;
    tokenOutMin = tokenOut.mul(nftOut.sub(extraNft).div(nftOut));
  }

  return {
    tokenInRange: [BI_ZERO, tokenInMax],
    tokenOutRange: [tokenOutMin, tokenOutMax],
    nftOutRange: [quotient.div(complement).toNumber(), quotient.div(complement).toNumber() + 1],
  };
};

/**
  @notice Calculate the Max. Token input amount when user add liquidity to pool
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
  tokenInMax: BigNumber;
}> => {
  const pairContract =
    typeof pair === 'string' ? (new Contract(pair, PAIR_ABI, signerOrProvider) as SeacowsERC721TradePair) : pair;
  const [tokenBalance, nftBalance] = await pairContract.getComplementedBalance();
  const totalSupply = await pairContract.totalSupply();
  const complement = await pairContract.COMPLEMENT_PRECISION();

  const tokenAmount = liquidity.mul(tokenBalance).div(totalSupply);
  const nftAmount = liquidity.mul(nftBalance).div(totalSupply);

  // const [tokenOutMin, nftOutMin] = await pairContract.getComplemenetedAssetsOut(tokenAmount, nftAmount);
  const cTokenOutMin = tokenAmount
    .mul(BigNumber.from(slippageDenominator - slippageNumerator))
    .div(BigNumber.from(slippageDenominator));
  const cNftOutMin = nftAmount
    .mul(BigNumber.from(slippageDenominator - slippageNumerator))
    .div(BigNumber.from(slippageDenominator));

  const tokenInMax = cNftOutMin.lt(complement.div(2))
    ? complement.sub(cNftOutMin.sub(cNftOutMin.div(complement).mul(complement)))
    : BI_ZERO;

  return {
    cTokenOutMin,
    cNftOutMin,
    tokenInMax,
  };
  // const complement = await pairContract.COMPLEMENT_PRECISION();

  // const tokenOutAmount = liquidity.mul(tokenBalance).div(totalSupply);
  // const nftOutAmount = liquidity.mul(nftBalance).div(totalSupply);

  // const tokenOutSlippage = liquidity.mul(tokenBalance).mul(slippageNumerator).div(totalSupply).div(slippageDenominator);
  // const nftOutSlippage = liquidity.mul(nftBalance).mul(slippageNumerator).div(totalSupply).div(slippageDenominator);

  // // Calculate NFT out Min, Token out Max
  // const nftOutMin = nftOutAmount.sub(nftOutSlippage);
  // const nftOutMinQuotient = nftOutMin.div(complement).mul(complement);
  // const nftOutMinRemainder = nftOutMin.sub(nftOutMinQuotient);
  // const tokenOutMax = nftOutMinRemainder.mul(tokenOutAmount).div(nftOutAmount);

  // // Calculate NFT out Max, Token out Min
  // const nftOutMax = nftOutAmount.add(nftOutSlippage);
  // const nftOutMaxQuotient = nftOutMax.div(complement).mul(complement);
  // const nftOutMaxRemainder = nftOutMax.sub(nftOutMaxQuotient);

  // return {
  //   tokenInRange,
  //   tokenOutRange: [, tokenOutAmount.add()],
  //   nftOutRange: [nftOutMinQuotient.div(complement).toNumber(), nftOutMaxQuotient.div(complement).toNumber() + 1],
  // };
};

export {
  getTokenInMax,
  getTokenOutMin,
  getSwapTokenInMax,
  getSwapTokenOutMin,
  getDepositTokenInMax,
  getWithdrawAssetsOutMin,
};
