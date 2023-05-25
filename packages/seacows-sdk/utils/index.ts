import { BigNumber, Contract, type Signer } from 'ethers';
import { type Provider } from '@ethersproject/abstract-provider';
import PAIR_ABI from '../abis/amm/ISeacowsERC721TradePair.json';
import { type SeacowsERC721TradePair } from '../types/amm';

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
  @notice Calculate the Max. Token input amount when user add liquidity to pool
  @param pair The Pair contract address or the Pair contract interface
  @param idsIn The NFT ids the user wants to sell
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
  tokenOutMin: BigNumber;
  nftOutMin: BigNumber;
  tokenOutMinWithSlippage: BigNumber;
  nftOutMinWithSlippage: BigNumber;
}> => {
  const pairContract =
    typeof pair === 'string' ? (new Contract(pair, PAIR_ABI, signerOrProvider) as SeacowsERC721TradePair) : pair;
  const [tokenBalance, nftBalance] = await pairContract.getComplementedBalance();
  const totalSupply = await pairContract.totalSupply();

  const tokenAmount = liquidity.mul(tokenBalance).div(totalSupply);
  const nftAmount = liquidity.mul(nftBalance).div(totalSupply);

  const [tokenOutMin, nftOutMin] = await pairContract.getComplemenetedAssetsOut(tokenAmount, nftAmount);
  return {
    tokenOutMin,
    nftOutMin,
    tokenOutMinWithSlippage: tokenOutMin
      .mul(BigNumber.from(slippageDenominator - slippageNumerator))
      .div(BigNumber.from(slippageDenominator)),
    nftOutMinWithSlippage: nftOutMin
      .mul(BigNumber.from(slippageDenominator - slippageNumerator))
      .div(BigNumber.from(slippageDenominator)),
  };
};

export { getSwapTokenInMax, getSwapTokenOutMin, getDepositTokenInMax, getWithdrawAssetsOutMin };
