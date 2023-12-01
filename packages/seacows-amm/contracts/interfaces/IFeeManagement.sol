// SPDX-License-Identifier: MIT
pragma solidity =0.8.13;

interface IFeeManagement {
    function royaltyRegistry() external view returns (address royaltyRegistry);

    function feeManager() external view returns (address feeManager);

    function royaltyFeeManager() external view returns (address royaltyFeeManager);

    function feeTo() external view returns (address feeTo);

    function setFeeManager(address _to) external;

    function setRoyaltyFeeManager(address _to) external;

    function setRoyaltyRegistry(address _to) external;

    function setFeeTo(address _to) external;
}
