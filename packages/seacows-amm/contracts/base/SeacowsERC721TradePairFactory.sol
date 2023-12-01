// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {SeacowsErrors} from './SeacowsErrors.sol';
import {Clones} from '@openzeppelin/contracts/proxy/Clones.sol';
import {ISeacowsERC721TradePair} from '../interfaces/ISeacowsERC721TradePair.sol';
import {ISeacowsERC721TradePairFactory} from '../interfaces/ISeacowsERC721TradePairFactory.sol';

contract SeacowsERC721TradePairFactory is SeacowsErrors, ISeacowsERC721TradePairFactory {
    address private immutable TEMPLATE;

    // token => collection => fee => pair
    mapping(address => mapping(address => mapping(uint256 => address))) private _pairs;

    constructor(address template_) {
        TEMPLATE = template_;
    }

    function template() public view returns (address) {
        return TEMPLATE;
    }

    function getPair(address _token, address _collection, uint256 _fee) public view returns (address) {
        return _pairs[_token][_collection][_fee];
    }

    function _createPair(address _token, address _collection, uint256 _fee) internal returns (address _pair) {
        if (_pairs[_token][_collection][_fee] != address(0)) {
            revert STPF_PAIR_ALREADY_EXIST();
        }
        _pair = Clones.clone(template());
        ISeacowsERC721TradePair(_pair).initialize(_token, _collection, _fee);
        _pairs[_token][_collection][_fee] = _pair;
    }
}
