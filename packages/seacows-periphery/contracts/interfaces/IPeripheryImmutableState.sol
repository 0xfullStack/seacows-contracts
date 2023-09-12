// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IPeripheryImmutableState {
    /// @return Returns the address of the Position Manager
    function manager() external view returns (address);

    /// @return Returns the address of WETH
    function weth() external view returns (address);
}
