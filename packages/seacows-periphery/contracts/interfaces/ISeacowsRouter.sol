// SPDX-License-Identifier: MIT
pragma solidity =0.8.13;

import {ISeacowsSwapCallback} from './ISeacowsSwapCallback.sol';

interface ISeacowsRouter is ISeacowsSwapCallback {
    function swapExactNFTsForTokens(
        address _pair,
        uint256[] memory idsIn,
        uint256 amountOutMin,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external returns (uint256 amountOut);

    function swapTokensForExactNFTs(
        address _pair,
        uint256[] memory idsOut,
        uint256 amountInMax,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external returns (uint256 amountIn);

    function batchSwapTokensForExactNFTs(
        address[] calldata _pairs,
        uint256[][] calldata idsOut,
        uint256[] calldata amountInMaxs,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external returns (uint256 amountIn);

    function batchSwapExactNFTsForTokens(
        address[] calldata _pairs,
        uint256[][] calldata idsIns,
        uint256[] calldata amountOutMins,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external returns (uint256 amountOut);

    function swapETHForExactNFTs(
        address _pair,
        uint256[] memory idsOut,
        uint256 amountInMax,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external payable returns (uint256 amountIn);

    function swapExactNFTsForETH(
        address _pair,
        uint256[] memory idsIn,
        uint256 amountOutMin,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external returns (uint256 amountOut);
}
