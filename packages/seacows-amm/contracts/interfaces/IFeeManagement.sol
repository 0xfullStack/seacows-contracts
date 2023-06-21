// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


interface IFeeManagement {
    function feeManager() external view returns (address feeManager);
    function feeTo() external view returns (address feeTo);

    function setFeeManager(address _to) external;
    function setFeeTo(address _to) external;
}
