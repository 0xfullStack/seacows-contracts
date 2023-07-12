// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract MockERC721 is ERC721, ERC2981 {
  using Counters for Counters.Counter;

  Counters.Counter private _idGenerator;

  constructor() ERC721('Mock ERC721', 'MERC721') {
    _setDefaultRoyalty(msg.sender, 100);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC2981, ERC721) returns (bool) {
    return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
  }

  function mint(address to) public {
    _mint(to, _idGenerator.current());
    _idGenerator.increment();
  }
}