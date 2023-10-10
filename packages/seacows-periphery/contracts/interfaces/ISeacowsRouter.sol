// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { ISeacowsSwapCallback } from "./ISeacowsSwapCallback.sol";

interface ISeacowsRouter is ISeacowsSwapCallback{

    // =============== Buy ===============
    function swapTokensForExactNFTs(
        address _pair,
        uint[] memory idsOut,
        uint amountInMax,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external returns (uint amountIn);

    function swapETHForExactNFTs(
        address _pair,
        uint[] memory idsOut,
        uint amountInMax,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external payable returns (uint amountIn);

    function batchSwapTokensForExactNFTs(
        address[] calldata _pairs,
        uint[][] calldata idsOut,
        uint[] calldata amountInMaxs,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external returns (uint amountIn);



    // =============== Sell ===============
    function swapExactNFTsForTokens(
        address _pair,
        uint[] memory idsIn,
        uint amountOutMin,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external returns (uint amountOut);

    function swapExactNFTsForETH(
        address _pair,
        uint[] memory idsIn,
        uint amountOutMin,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external returns (uint amountOut);

    function batchSwapExactNFTsForTokens(
        address[] calldata _pairs,
        uint[][] calldata idsIns,
        uint[] calldata amountOutMins,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external returns (uint amountOut);
}
