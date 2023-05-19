import { BigNumber } from 'ethers';

const getTokenInMax = (
  idsOut: number[],
  complement: BigNumber,
  tokenReserve: BigNumber,
  nftReserve: BigNumber,
  feeNumerator: BigNumber,
  feeDenominator: BigNumber,
  slippageNumerator: number,
  slippageDenominator,
): { tokenInMax: BigNumber; TokenInMaxWithSlippage: BigNumber } => {
  const nftsOut = BigNumber.from(idsOut.length).mul(complement);
  const tokenIn = tokenReserve.mul(nftsOut).div(nftReserve.sub(nftsOut));
  const tokenInWithFee = tokenIn.mul(feeDenominator).div(feeDenominator.sub(feeNumerator));
  return {
    tokenInMax: tokenInWithFee,
    TokenInMaxWithSlippage: tokenInWithFee.mul(slippageDenominator.add(slippageNumerator)).div(slippageDenominator),
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
  slippageDenominator,
): { tokenOutMin: BigNumber; tokenOutMinWithSlippage: BigNumber } => {
  const nftsIn = BigNumber.from(idsIn.length).mul(complement);
  const tokenOut = tokenReserve.mul(nftsIn).div(nftReserve.add(nftsIn));
  const tokenOutWithFee = tokenOut.mul(feeDenominator.sub(feeNumerator)).div(feeDenominator);
  return {
    tokenOutMin: tokenOutWithFee,
    tokenOutMinWithSlippage: tokenOutWithFee.mul(slippageDenominator.sub(slippageNumerator)).div(slippageDenominator),
  };
};

export { getTokenInMax, getTokenOutMin };
