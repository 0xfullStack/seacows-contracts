// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

library SeacowsLibrary {
    using SafeMath for uint;

    // given some amount of an asset and pair reserves, returns an equivalent amount of the other asset
    function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB) {
        require(amountA > 0, "SeacowsLibrary: INSUFFICIENT_AMOUNT");
        require(reserveA > 0 && reserveB > 0, "SeacowsLibrary: INSUFFICIENT_LIQUIDITY");
        amountB = amountA.mul(reserveB) / reserveA;
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(uint nftIn, uint tokenReserve, uint nftReserve, uint feeNumerator, uint feeDenominator) internal pure returns (uint tokenOut) {
        require(nftIn > 0, "SeacowsLibrary: INSUFFICIENT_INPUT_AMOUNT");
        require(tokenReserve > 0 && nftReserve > 0, "SeacowsLibrary: INSUFFICIENT_LIQUIDITY");
        uint numerator = nftIn.mul(tokenReserve).mul(feeDenominator.sub(feeNumerator));
        uint denominator = (nftReserve.add(nftIn)).mul(feeDenominator);
        tokenOut = (numerator / denominator).sub(1);
    }

    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut, uint feeNumerator, uint feeDenominator) internal pure returns (uint tokenIn) {
        require(amountOut > 0, "SeacowsLibrary: INSUFFICIENT_OUTPUT_AMOUNT");
        require(reserveIn > 0 && reserveOut > 0, "SeacowsLibrary: INSUFFICIENT_LIQUIDITY");
        uint numerator = reserveIn.mul(amountOut).mul(feeDenominator);
        uint denominator = reserveOut.sub(amountOut).mul(feeDenominator.sub(feeNumerator));
        if (denominator == 0) {
            tokenIn = ~uint(0);
        } else {
            tokenIn = (numerator / denominator).add(1);
        }
    }
}