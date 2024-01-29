import { type BigNumber, type BigNumberish } from 'ethers';
import { ethers } from 'hardhat';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZERO = ethers.BigNumber.from(0);
export const ONE = ethers.BigNumber.from(1);
export const TWO = ethers.BigNumber.from(2);

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
