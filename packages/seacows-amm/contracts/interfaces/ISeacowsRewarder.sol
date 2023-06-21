// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ISeacowsRewarder {
  function updateSwapFee() external;
  function updatePositionFee(uint tokenId) external;
  function updatePositionFeeDebt(uint tokenId) external;
}
