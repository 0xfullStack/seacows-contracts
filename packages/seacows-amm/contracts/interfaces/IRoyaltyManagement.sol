// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

interface IRoyaltyManagement {
    function minRoyaltyFeePercent() external view returns (uint256);

    function royaltyRegistry() external view returns (address);

    function royaltyFeeManager() external view returns (address);

    function isRoyaltySupported() external view returns (bool);

    function getRoyaltyRecipient(uint256 _tokenId) external view returns (address recipient);

    function setMinRoyaltyFeePercent(uint256 _percent) external;
}
