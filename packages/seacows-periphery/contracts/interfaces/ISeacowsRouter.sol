// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


interface ISeacowsRouter {
    function swapExactNFTsForTokens(
        address _pair,
        uint[] memory idsIn,
        uint amountOutMin,
        address to,
        uint deadline
    ) external returns (uint amountOut);

    function swapTokensForExactNFTs(
        address _pair,
        uint[] memory idsOut,
        uint amountInMax,
        address to,
        uint deadline
    ) external returns (uint amountIn);

    function batchSwapTokensForExactNFTs(
        address[] calldata _pairs,
        uint[][] calldata idsOut,
        uint[] calldata amountInMaxs,
        address to,
        uint deadline
    ) external returns (uint amountIn);

    function batchSwapExactNFTsForTokens(
        address[] calldata _pairs,
        uint[][] calldata idsIns,
        uint[] calldata amountOutMins,
        address to,
        uint deadline
    ) external returns (uint amountOut);
}
