import { Zero } from '@ethersproject/constants';
import { expect } from 'chai';
import { type Address } from 'cluster';
import { type BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { sqrt } from '../utils';

class Pool {
  token = Zero;
  nft = Zero;
  totalSupply = Zero;

  complement = ethers.utils.parseEther('1');
  rounding = ethers.utils.parseEther('0.5');

  tokenComplement = Zero;
  nftComplement = Zero;

  owners: Record<string, BigNumber> = {};

  addLiquidity = (_owner: string, _token: BigNumber, _nft: BigNumber): void => {
    if (this.totalSupply.eq(Zero)) {
      const liquidity = sqrt(_token.mul(_nft));
      this.owners[_owner] = !this.owners[_owner] ? liquidity : this.owners[_owner].add(liquidity);
      this.totalSupply = liquidity;
    } else {
      const amount0 = _token.mul(this.totalSupply).div(this.token);
      const amount1 = _nft.mul(this.totalSupply).div(this.nft);
      const liquidity = amount0.lte(amount1) ? amount0 : amount1;
      this.owners[_owner] = !this.owners[_owner] ? liquidity : this.owners[_owner].add(liquidity);
      this.totalSupply = this.totalSupply.add(liquidity);
    }

    this.token = this.token.add(_token);
    this.nft = this.nft.add(_nft);
    this.log(_owner, 'Add', _token, _nft);
  };

  getComplementedReserve = (): { token: BigNumber; nft: BigNumber } => {
    return {
      token: this.token.sub(this.tokenComplement),
      nft: this.nft.sub(this.nftComplement),
    };
  };

  removeLiquidity = (_owner: string, _liquidity: BigNumber): void => {
    const { token, nft } = this.getComplementedReserve();
    const spot = token.div(nft);
    const _token = token.mul(_liquidity).div(this.totalSupply);
    const _nft = nft.mul(_liquidity).div(this.totalSupply);
    const complementedNft = this.nftComplement.add(_nft);

    let nftOut: BigNumber;
    let tokenOut: BigNumber;

    if (complementedNft.gte(this.complement)) {
      nftOut = complementedNft.div(this.complement).mul(this.complement);
      this.nftComplement = complementedNft.sub(nftOut);

      if (nftOut.gte(_nft)) {
        const tokenAdjusted = nftOut.sub(_nft).mul(spot);
        tokenOut = _token.sub(tokenAdjusted);
        this.tokenComplement = this.tokenComplement.add(tokenAdjusted);
      } else {
        const tokenAdjusted = _nft.sub(nftOut).mul(spot);
        tokenOut = _token.add(tokenAdjusted);
        this.tokenComplement = this.tokenComplement.sub(tokenAdjusted);
      }
    } else {
      this.nftComplement = this.nftComplement.add(_nft);
      nftOut = Zero;

      const increasedTokenAmount = _nft.mul(spot);
      tokenOut = _token.add(increasedTokenAmount);
      // console.log(_nft.toString(), spot.toString(), increasedTokenAmount.toString());
      // console.log(_token.toString(), increasedTokenAmount.toString(), tokenOut.toString());
      this.tokenComplement = this.tokenComplement.sub(increasedTokenAmount);
    }
    this.owners[_owner] = this.owners[_owner].sub(_liquidity);
    this.nft = this.nft.sub(nftOut);
    this.token = this.token.sub(tokenOut);
    this.totalSupply = this.totalSupply.sub(_liquidity);
    this.log(_owner, 'Remove', tokenOut, nftOut);
  };

  swap = (_owner: string, tokenIn: BigNumber, nftIn: BigNumber, tokenOut: BigNumber, nftOut: BigNumber): void => {
    this.token = this.token.add(tokenIn);
    this.token = this.token.sub(tokenOut);
    this.nft = this.nft.sub(nftIn);
    this.nft = this.nft.sub(nftOut);
    this.log(_owner, 'Swap', tokenIn.sub(tokenOut), nftIn.sub(nftOut));
  };

  log = (owner: string, operation: string, tokenChange: BigNumber, nftChange: BigNumber): void => {
    const { token, nft } = this.getComplementedReserve();
    console.log(
      `| ${owner} | ${operation} | ${tokenChange.toString()} | ${nftChange.toString()} | ${this.tokenComplement.toString()} | ${this.nftComplement.toString()} | ${token.toString()} | ${nft.toString()} | ${this.token.toString()} | ${this.nft.toString()} |`,
    );
  };

  getNftAmount = (): string => {
    const { nft } = this.getComplementedReserve();
    return nft.div(this.complement).toString();
  };
}

describe('SeacowsPositionManager - Advanced Testing', () => {
  const pool = new Pool();
  it('', async () => {
    console.log(
      `| Owner | Swap | Token Change | NFT Change | Token Complement | NFT Complement | Token Reserve | NFT Reserve | Token Balance | NFT Balance |`,
    );
    console.log(
      `|-------|------|--------------|------------|---------------|---------------|---------------|-------------|-------------|-------------|`,
    );
    const owners = ['A', 'B', 'C', 'D', 'E', 'F'];
    owners.forEach((owner) => {
      pool.addLiquidity(owner, ethers.utils.parseEther('10'), ethers.utils.parseEther('1'));
    });
    const tokenIn = pool.nft.mul(pool.token).div(ethers.utils.parseEther('2')).sub(pool.token);
    pool.swap('A', tokenIn, Zero, Zero, ethers.utils.parseEther('4'));

    owners.forEach((owner) => {
      // console.log(pool.owners[owner]);
      const liquidity = pool.owners[owner];
      pool.removeLiquidity(owner, liquidity);
    });
  });
});
