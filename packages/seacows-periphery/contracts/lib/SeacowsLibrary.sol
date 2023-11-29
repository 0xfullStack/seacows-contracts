// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

library SeacowsLibrary {
    // given some amount of an asset and pair reserves, returns an equivalent amount of the other asset
    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) internal pure returns (uint256 amountB) {
        require(amountA > 0, 'SeacowsLibrary: INSUFFICIENT_AMOUNT');
        require(reserveA > 0 && reserveB > 0, 'SeacowsLibrary: INSUFFICIENT_LIQUIDITY');
        amountB = (amountA * reserveB) / reserveA;
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(
        uint256 nftIn,
        uint256 tokenReserve,
        uint256 nftReserve,
        uint256 feeNumerator,
        uint256 feeDenominator
    ) internal pure returns (uint256 tokenOut) {
        require(nftIn > 0, 'SeacowsLibrary: INSUFFICIENT_INPUT_AMOUNT');
        require(tokenReserve > 0 && nftReserve > 0, 'SeacowsLibrary: INSUFFICIENT_LIQUIDITY');
        uint256 numerator = nftIn * tokenReserve * (feeDenominator - feeNumerator);
        uint256 denominator = (nftReserve + nftIn) * feeDenominator;
        tokenOut = numerator / denominator;
    }

    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut,
        uint256 feeNumerator,
        uint256 feeDenominator
    ) internal pure returns (uint256 tokenIn) {
        require(amountOut > 0, 'SeacowsLibrary: INSUFFICIENT_OUTPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'SeacowsLibrary: INSUFFICIENT_LIQUIDITY');
        uint256 numerator = reserveIn * amountOut * (feeDenominator + feeNumerator);
        uint256 denominator = (reserveOut - amountOut) * (feeDenominator);
        tokenIn = (numerator / denominator) + 1;
    }
}
