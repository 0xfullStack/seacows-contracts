// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/proxy/Clones.sol";
import { ISeacowsERC721TradePair } from "../interfaces/ISeacowsERC721TradePair.sol";
import { ISeacowsERC721TradePairFactory } from "../interfaces/ISeacowsERC721TradePairFactory.sol";

/// @title The base contract for an NFT/TOKEN AMM pair
/// Inspired by 0xmons; Modified from https://github.com/sudoswap/lssvm
/// @notice This implements the core swap logic from NFT to TOKEN
contract SeacowsERC721TradePairFactory is ISeacowsERC721TradePairFactory {
    address private immutable _template;

    // token => collection => fee => pair
    mapping(address => mapping(address => mapping(uint112 => address))) private _pairs;

    constructor(address template_) {
        _template = template_;
    }

    function template() public view returns (address) {
        return _template;
    }

    function getPair(address _token, address _collection, uint112 _fee) public view returns (address) {
        return _pairs[_token][_collection][_fee];
    }

    function _createPair(address _token, address _collection, uint112 _fee) internal returns (address _pair) {
        require(_pairs[_token][_collection][_fee] == address(0), "Factory: Pair already exists");
        _pair = Clones.clone(template());
        ISeacowsERC721TradePair(_pair).initialize(_token, _collection, _fee);
        _pairs[_token][_collection][_fee] = _pair;
    }
}
