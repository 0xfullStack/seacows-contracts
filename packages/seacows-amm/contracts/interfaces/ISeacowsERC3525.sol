// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { IERC3525 } from "@solvprotocol/erc-3525/IERC3525.sol";

interface ISeacowsERC3525 is IERC3525 {
    function totalValueSupplyOf(uint256 _slot) external view returns (uint256);
    function tokenOfOwnerInSlot(address _owner, uint256 _slot) external view returns (uint256);
}
