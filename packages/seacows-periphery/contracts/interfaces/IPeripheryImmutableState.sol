// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

interface IPeripheryImmutableState {
    function manager() external view returns (address);

    function weth() external view returns (address);
}
