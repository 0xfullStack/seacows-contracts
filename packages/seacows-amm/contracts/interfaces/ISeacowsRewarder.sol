// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ISeacowsRewarder {
    event CollectFee(uint256 indexed tokenId, uint256 fee);

    function updateSwapFee() external;

    function updatePositionFee(uint tokenId) external;

    function updatePositionFeeDebt(uint tokenId) external;
}
