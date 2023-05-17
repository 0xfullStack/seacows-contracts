// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import { IERC3525Receiver } from "@solvprotocol/erc-3525/IERC3525Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import { ERC3525 } from "@solvprotocol/erc-3525/ERC3525.sol";
import { IERC3525 } from "@solvprotocol/erc-3525/IERC3525.sol";
import { ISeacowsERC3525 } from "../interfaces/ISeacowsERC3525.sol";

contract SeacowsPairMetadata is ERC165, ERC721Holder, IERC3525Receiver {
  
  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return super.supportsInterface(interfaceId) || interfaceId == type(IERC721Receiver).interfaceId || interfaceId == type(IERC3525Receiver).interfaceId;
  }


  function onERC3525Received(address _operator, uint256 _fromTokenId, uint256 _toTokenId, uint256 _value, bytes calldata _data) external pure returns (bytes4) {
    return IERC3525Receiver.onERC3525Received.selector;
  }
}
