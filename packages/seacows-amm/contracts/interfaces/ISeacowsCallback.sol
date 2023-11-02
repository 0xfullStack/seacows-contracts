// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ISeacowsCallback {
    function seacowsBurnCallback(address _token, address from, uint256 _amount) external;
}
