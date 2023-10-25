// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

library SeacowsLibrary {
    // given some amount of an asset and pair reserves, returns an equivalent amount of the other asset
    function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB) {
        require(amountA > 0, 'SeacowsLibrary: INSUFFICIENT_AMOUNT');
        require(reserveA > 0 && reserveB > 0, 'SeacowsLibrary: INSUFFICIENT_LIQUIDITY');
        amountB = (amountA * reserveB) / reserveA;
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(
        uint nftIn,
        uint tokenReserve,
        uint nftReserve,
        uint feeNumerator,
        uint feeDenominator
    ) internal pure returns (uint tokenOut) {
        require(nftIn > 0, 'SeacowsLibrary: INSUFFICIENT_INPUT_AMOUNT');
        require(tokenReserve > 0 && nftReserve > 0, 'SeacowsLibrary: INSUFFICIENT_LIQUIDITY');
        uint numerator = nftIn * tokenReserve * (feeDenominator - feeNumerator);
        uint denominator = (nftReserve + nftIn) * feeDenominator;
        tokenOut = numerator / denominator;
    }

    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(
        uint amountOut,
        uint reserveIn,
        uint reserveOut,
        uint feeNumerator,
        uint feeDenominator
    ) internal pure returns (uint tokenIn) {
        require(amountOut > 0, 'SeacowsLibrary: INSUFFICIENT_OUTPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'SeacowsLibrary: INSUFFICIENT_LIQUIDITY');
        uint numerator = reserveIn * amountOut * (feeDenominator + feeNumerator);
        uint denominator = (reserveOut - amountOut) * (feeDenominator);
        tokenIn = (numerator / denominator) + 1;
    }
}
