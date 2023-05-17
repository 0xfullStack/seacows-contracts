import { type BigNumber, type BigNumberish } from 'ethers';
import { ethers } from 'hardhat';

const ONE = ethers.BigNumber.from(1);
const TWO = ethers.BigNumber.from(2);

export const sqrt = (value: BigNumberish): BigNumber => {
  const x = ethers.BigNumber.from(value);
  let z = x.add(ONE).div(TWO);
  let y = x;
  while (z.sub(y).isNegative()) {
    y = z;
    z = x.div(z).add(z).div(TWO);
  }
  return y;
};

export const getTokenIn = (nftsOut: BigNumber, tokenReserve: BigNumber, nftReserve: BigNumber): BigNumber => {
  return tokenReserve.mul(nftsOut).div(nftReserve.sub(nftsOut));
};

export const getTokenOut = (nftsIn: BigNumber, tokenReserve: BigNumber, nftReserve: BigNumber): BigNumber => {
  return tokenReserve.mul(nftsIn).div(nftReserve.add(nftsIn));
};

export const calculateTokenChange = (
  tokenReserveBefore: BigNumber,
  nftReserveBefore: BigNumber,
  nftReserveAfter: BigNumber,
): BigNumber => {
  const k = tokenReserveBefore.mul(nftReserveBefore);
  if (nftReserveBefore.gte(nftReserveAfter)) {
    return k.div(nftReserveAfter).sub(tokenReserveBefore);
  }

  return tokenReserveBefore.sub(k.div(nftReserveAfter));
};
