// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

library SeacowsLibrary {

    /**
        @notice Calculate another asset amount, based on an asset amount and pair reserves
        @param amountA One asset amount
        @param reserveA Pair reserveA
        @param reserveB Pair reserveB
        @return amountB An equivalent amount of another asset
     */
    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) internal pure returns (uint256 amountB) {
        require(amountA > 0, 'SeacowsLibrary: INSUFFICIENT_AMOUNT');
        require(reserveA > 0 && reserveB > 0, 'SeacowsLibrary: INSUFFICIENT_LIQUIDITY');
        amountB = (amountA * reserveB) / reserveA;
    }

    /**
        @notice Given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
        @param nftIn NFT input amount
        @param tokenReserve The token reserve of pair
        @param nftReserve The nft reserve of pair
        @param feeNumerator The fee numerator
        @param feeDenominator The fee denominator
        @return tokenOut An equivalent amount of token output
     */
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

    /**
        @notice Given an output amount of an asset and pair reserves, returns a required input amount of the other asset
        @param amountOut NFT input amount
        @param reserveIn The token reserve of pair
        @param reserveOut The nft reserve of pair
        @param feeNumerator The fee numerator
        @param feeDenominator The fee denominator
        @return tokenIn An equivalent required amount of token input
     */
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
