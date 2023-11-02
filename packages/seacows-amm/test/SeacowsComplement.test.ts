import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { type SeacowsComplement } from 'types';

describe('SeacowsComplement', () => {
  let SeacowsComplement: SeacowsComplement;
  let COMPLEMENT_PRECISION: BigNumber;
  let COMPLEMENT_PRECISION_DIGITS: BigNumber;

  beforeEach(async () => {
    const FixidityLibFC = await ethers.getContractFactory('FixidityLib');
    const fixidityLib = await FixidityLibFC.deploy();

    const PricingKernelLibraryFC = await ethers.getContractFactory('PricingKernel', {
      libraries: {
        FixidityLib: fixidityLib.address,
      },
    });
    const pricingKernelLib = await PricingKernelLibraryFC.deploy();

    const SeacowsComplementFC = await ethers.getContractFactory('SeacowsComplement', {
      libraries: {
        PricingKernel: pricingKernelLib.address,
      },
    });
    SeacowsComplement = await SeacowsComplementFC.deploy();
    COMPLEMENT_PRECISION = await SeacowsComplement.COMPLEMENT_PRECISION();
    COMPLEMENT_PRECISION_DIGITS = BigNumber.from(await SeacowsComplement.COMPLEMENT_PRECISION_DIGITS());
  });

  describe('When Pool is initialized', () => {
    it('it should have correct constants', async () => {
      expect(COMPLEMENT_PRECISION).to.equal(ethers.utils.parseEther('1'));
      expect(COMPLEMENT_PRECISION_DIGITS).to.equal(18);
    });
  });

  describe('When Pool is initialized with 10 token, 10 NFT', () => {
    let POOL_INITIAL_TOKEN_AMOUNT: BigNumber;
    let POOL_INITIAL_NFT_AMOUNT: BigNumber;

    before(async () => {
      POOL_INITIAL_TOKEN_AMOUNT = ethers.utils.parseEther('10');
      POOL_INITIAL_NFT_AMOUNT = ethers.utils.parseEther('10');
    });

    it('it should output 2 NFT and 2 tokens when NFT amount is not fractional equal to 2', async () => {
      const [tokenAmountOut, nftAmountOut] = await SeacowsComplement.caculateAssetsOutAfterComplemented(
        POOL_INITIAL_TOKEN_AMOUNT,
        POOL_INITIAL_NFT_AMOUNT,
        ethers.utils.parseEther('2'),
        ethers.utils.parseEther('2'),
      );

      expect(nftAmountOut).to.equal(ethers.utils.parseEther('2'));
      expect(tokenAmountOut).to.equal(ethers.utils.parseEther('2'));
    });

    it('it should output 10 NFT and 10 tokens when NFT amount is not fractional equal to 10', async () => {
      const [tokenAmountOut, nftAmountOut] = await SeacowsComplement.caculateAssetsOutAfterComplemented(
        POOL_INITIAL_TOKEN_AMOUNT,
        POOL_INITIAL_NFT_AMOUNT,
        ethers.utils.parseEther('10'),
        ethers.utils.parseEther('10'),
      );

      expect(nftAmountOut).to.equal(ethers.utils.parseEther('10'));
      expect(tokenAmountOut).to.equal(ethers.utils.parseEther('10'));
    });

    it('it should output 0 NFT but more tokens when NFT amount is fractional equal to 0.2', async () => {
      const [tokenAmountOut, nftAmountOut] = await SeacowsComplement.caculateAssetsOutAfterComplemented(
        POOL_INITIAL_TOKEN_AMOUNT,
        POOL_INITIAL_NFT_AMOUNT,
        ethers.utils.parseEther('0.2'),
        ethers.utils.parseEther('0.2'),
      );

      // tokenComplement = 195999999999978775 ≈ 0.195999 <= 0.2 tokenAmountOut ≈ 0.2 + 0.2
      expect(nftAmountOut).to.equal(ethers.utils.parseEther('0'));
      expect(tokenAmountOut).to.lessThanOrEqual(ethers.utils.parseEther('0.4'));
    });

    it('it should output 2 NFT but more tokens when NFT amount is fractional equal to 2.2', async () => {
      const [tokenAmountOut, nftAmountOut] = await SeacowsComplement.caculateAssetsOutAfterComplemented(
        POOL_INITIAL_TOKEN_AMOUNT,
        POOL_INITIAL_NFT_AMOUNT,
        ethers.utils.parseEther('2.2'),
        ethers.utils.parseEther('2.2'),
      );

      // tokenComplement =194999999999642307 ≈ 0.194999 <= 0.2  tokenAmountOut ≈ 2.4 + 0.2
      expect(nftAmountOut).to.equal(ethers.utils.parseEther('2'));
      expect(tokenAmountOut).to.lessThanOrEqual(ethers.utils.parseEther('2.4'));
    });

    it('it should output 2 NFT but more tokens when NFT amount is fractional equal to 2.6', async () => {
      const [tokenAmountOut, nftAmountOut] = await SeacowsComplement.caculateAssetsOutAfterComplemented(
        POOL_INITIAL_TOKEN_AMOUNT,
        POOL_INITIAL_NFT_AMOUNT,
        ethers.utils.parseEther('2.6'),
        ethers.utils.parseEther('2.6'),
      );

      // tokenComplement =554999999999647297 ≈ 0.55499 <= 0.6 tokenAmountOut ≈ 2.6 + 0.6
      expect(nftAmountOut).to.equal(ethers.utils.parseEther('2'));
      expect(tokenAmountOut).to.lessThanOrEqual(ethers.utils.parseEther('3.2'));
    });

    it('it should output 2 NFT but more tokens when NFT amount is fractional equal to 2.9', async () => {
      const [tokenAmountOut, nftAmountOut] = await SeacowsComplement.caculateAssetsOutAfterComplemented(
        POOL_INITIAL_TOKEN_AMOUNT,
        POOL_INITIAL_NFT_AMOUNT,
        ethers.utils.parseEther('2.9'),
        ethers.utils.parseEther('2.9'),
      );

      // tokenComplement =798749999999530563 ≈ 0.7987 <= 0.9  tokenAmountOut ≈ 2.9 + 0.9
      expect(nftAmountOut).to.equal(ethers.utils.parseEther('2'));
      expect(tokenAmountOut).to.lessThanOrEqual(ethers.utils.parseEther('3.8'));
    });
  });
});
