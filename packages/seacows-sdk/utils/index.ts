import { BigNumber, Contract, type Signer } from 'ethers';
import { type Provider } from '@ethersproject/abstract-provider';
import PAIR_ABI from '../abis/amm/ISeacowsERC721TradePair.json';
import { type SeacowsERC721TradePair } from '../types/amm';

const getSwapTokenInMax = async (
  pair: string | SeacowsERC721TradePair,
  idsOut: number[],
  slippageNumerator: number,
  slippageDenominator: number,
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

const getSwapTokenOutMin = async (
  pair: string | SeacowsERC721TradePair,
  idsIn: number[],
  slippageNumerator: number,
  slippageDenominator: number,
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

const getDepositTokenInMax = async (
  pair: string | SeacowsERC721TradePair,
  idsIn: number[],
  signerOrProvider?: Signer | Provider,
): Promise<BigNumber> => {
  const pairContract =
    typeof pair === 'string' ? (new Contract(pair, PAIR_ABI, signerOrProvider) as SeacowsERC721TradePair) : pair;
  const complement = await pairContract.COMPLEMENT_PRECISION();
  const [tokenReserve, nftReserve] = await pairContract.getReserves();
  return tokenReserve.mul(idsIn.length).mul(complement).div(nftReserve);
};

const getWithdrawAssetsOutMin = async (
  pair: string | SeacowsERC721TradePair,
  liquidity: BigNumber,
  signerOrProvider?: Signer | Provider,
): Promise<{ tokenOutMin: BigNumber; nftOutMin: BigNumber }> => {
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
  };
};

export { getSwapTokenInMax, getSwapTokenOutMin, getDepositTokenInMax, getWithdrawAssetsOutMin };
