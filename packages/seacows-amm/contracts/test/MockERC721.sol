// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {
  using Counters for Counters.Counter;

  Counters.Counter private _idGenerator;

  constructor() ERC721('Mock ERC721', 'MERC721') {}

  function mint(address to) public {
    _mint(to, _idGenerator.current());
    _idGenerator.increment();
  }
}