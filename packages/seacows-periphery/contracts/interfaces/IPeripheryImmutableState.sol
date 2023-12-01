// SPDX-License-Identifier: MIT
pragma solidity =0.8.13;

interface IPeripheryImmutableState {    
    function manager() external view returns (address);

    function weth() external view returns (address);
}
