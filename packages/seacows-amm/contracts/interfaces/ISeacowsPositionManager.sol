// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// import { IERC3525 } from "@solvprotocol/erc-3525/IERC3525.sol";
import { ISeacowsERC3525 } from "./ISeacowsERC3525.sol";

interface ISeacowsPositionManager is ISeacowsERC3525 {
    // function totalValueSupplyOf(uint256 _slot) external view returns (uint256);
    // function tokenOfOwnerInSlot(address _owner, uint256 _slot) external view returns (uint256);
    function slotOfPair(address _pair) external view returns (uint256);
    function mintValue(address _to, uint256 _slot, uint256 _value) external;
    function burnValue(address _to, uint256 _slot, uint256 _value) external;
}
