// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// import { IERC3525 } from "@solvprotocol/erc-3525/IERC3525.sol";
import { ISeacowsERC3525 } from "./ISeacowsERC3525.sol";
import { ISeacowsCallback } from "./ISeacowsCallback.sol";

interface ISeacowsPositionManager is ISeacowsERC3525, ISeacowsCallback {
    event PairCreated(address indexed token, address indexed collection, uint112 indexed fee, uint256 slot, address pair);

    function slotOfPair(address _pair) external view returns (uint256);
    function tokenOf(address _pair) external view returns (uint256);
    
    function mintValue(uint256 tokenId, uint256 _value) external;
    function burnValue(uint256 tokenId, uint256 burnValue_) external;
}
