// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ISeacowsSwapCallback {
    function seacowsSwapCallback(bytes calldata data) external returns (uint256 tokenAmountIn, uint256[] memory idsIn);
}
