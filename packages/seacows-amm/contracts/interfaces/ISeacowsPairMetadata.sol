// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ISeacowsPairMetadata {
  function token() external view returns (address);
  function collection() external view returns (address);

  function totalSupply() external view returns (uint256);
  function balanceOf(uint _tokenId) external view returns (uint256);
  function ownerOf(uint _tokenId) external view returns (address);
}
