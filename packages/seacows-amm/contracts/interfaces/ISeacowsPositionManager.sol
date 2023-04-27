// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// import { IERC3525 } from "@solvprotocol/erc-3525/IERC3525.sol";
import { ISeacowsERC3525 } from "./ISeacowsERC3525.sol";

interface ISeacowsPositionManager is ISeacowsERC3525 {
    event PairCreated(address indexed token, address indexed collection, uint112 indexed fee, uint256 slot, address pair);

    // function totalValueSupplyOf(uint256 _slot) external view returns (uint256);
    // function tokenOfOwnerInSlot(address _owner, uint256 _slot) external view returns (uint256);
    function slotOfPair(address _pair) external view returns (uint256);
    function tokenOf(address _pair) external view returns (uint256);
    function lockTokenOf(address _pair) external view returns (uint256);
    
    function mintValue(uint256 tokenId, uint256 _value) external;
    function burnValue(uint256 tokenId, uint256 burnValue_) external;
}
