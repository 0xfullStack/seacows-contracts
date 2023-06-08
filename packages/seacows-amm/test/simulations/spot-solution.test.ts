import { MaxUint256, Zero } from '@ethersproject/constants';
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  getSwapTokenInMax,
  getSwapTokenOutMin,
  getDepositTokenInMax,
  getWithdrawAssetsOutMin,
} from '@yolominds/seacows-sdk';
import { expect } from 'chai';
import { type Address } from 'cluster';
import { type BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import {
  type SeacowsERC721TradePair,
  type SeacowsPositionManager,
  type WETH,
  type MockERC721,
  type MockERC20,
} from 'types';
import { ONE_PERCENT, POINT_FIVE_PERCENT } from '../constants';
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
    // const spot = token.mul(this.decimals).div(nft).add(1).div(this.decimals);
    // const spot = token.mul(this.decimals).div(nft).add(5).div(this.decimals);
    // const spot = token.div(nft).add(1);
    const _token = token.mul(_liquidity).div(this.totalSupply);
    const _nft = nft.mul(_liquidity).div(this.totalSupply);
    const complementedNft = this.nftComplement.add(_nft); // .add(this.complement.mul(3).div(4));

    // console.log('============================');
    // console.log('SPOT', spot.toString());
    // console.log('Token', token.toString());
    // console.log('NFT', nft.toString());
    // console.log('============================');

    let nftOut: BigNumber;
    let tokenOut: BigNumber;

    let quotient = complementedNft.div(this.complement).mul(this.complement);
    const remainder = complementedNft.sub(quotient);
    if (remainder.gte(this.complement.div(2))) {
      quotient = quotient.add(this.complement);
    }
    if (quotient.gte(this.complement)) {
      nftOut = quotient;
      if (nftOut.gte(_nft)) {
        const nftExtra = nftOut.sub(_nft);
        let tokenAdjusted = nftExtra.mul(token).div(nft).add(1);

        tokenOut = _token.sub(tokenAdjusted);
        if (tokenOut.gt(this.token)) {
          tokenOut = this.token;
          tokenAdjusted = tokenOut.sub(_token);
        }
        this.tokenComplement = this.tokenComplement.add(tokenAdjusted);
        this.nftComplement = this.nftComplement.sub(nftExtra);
      } else {
        const nftLess = _nft.sub(nftOut);
        let tokenAdjusted = nftLess.mul(token).div(nft);
        tokenOut = _token.add(tokenAdjusted);
        if (tokenOut.gt(this.token)) {
          tokenOut = this.token;
          tokenAdjusted = tokenOut.sub(_token);
        }
        this.tokenComplement = this.tokenComplement.sub(tokenAdjusted);
        this.nftComplement = this.nftComplement.add(nftLess);
      }
    } else {
      this.nftComplement = this.nftComplement.add(_nft);
      nftOut = Zero;

      let increasedTokenAmount = _nft.mul(token).div(nft);
      tokenOut = _token.add(increasedTokenAmount);

      if (tokenOut.gt(this.token)) {
        tokenOut = this.token;
        increasedTokenAmount = tokenOut.sub(_token);
      }
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
