// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {ISeacowsERC721TradePairFactory} from './ISeacowsERC721TradePairFactory.sol';
import {ISeacowsERC3525} from './ISeacowsERC3525.sol';
import {IFeeManagement} from './IFeeManagement.sol';

interface ISeacowsPositionManager is ISeacowsERC3525, IFeeManagement, ISeacowsERC721TradePairFactory {
    event PairCreated(
        address indexed token,
        address indexed collection,
        uint256 indexed fee,
        uint256 slot,
        address pair
    );

    function slotOfPair(address _pair) external view returns (uint256);

    function tokenOf(address _pair) external view returns (uint256);

    function mintValue(uint256 tokenId, uint256 _value) external;

    function burnValue(uint256 tokenId, uint256 burnValue_) external;
}
