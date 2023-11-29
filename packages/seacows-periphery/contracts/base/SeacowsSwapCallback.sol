// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {ISeacowsERC721TradePair} from '@yolominds/seacows-amm/contracts/interfaces/ISeacowsERC721TradePair.sol';
import {ISeacowsPositionManager} from '@yolominds/seacows-amm/contracts/interfaces/ISeacowsPositionManager.sol';
import {ISeacowsSwapCallback} from '../interfaces/ISeacowsSwapCallback.sol';
import {PeripheryImmutableState} from './PeripheryImmutableState.sol';
import {SeacowsErrors} from './SeacowsErrors.sol';

contract SeacowsSwapCallback is PeripheryImmutableState, SeacowsErrors, ISeacowsSwapCallback {
    struct SwapCallbackData {
        address payer;
        uint256[] idsIn;
        uint256 tokenAmountIn;
    }

    constructor(address _manager, address _weth) PeripheryImmutableState(_manager, _weth) {}

    function seacowsSwapCallback(bytes calldata _data) public returns (uint256 tokenAmountIn, uint256[] memory idsIn) {
        SwapCallbackData memory callback = abi.decode(_data, (SwapCallbackData));
        tokenAmountIn = callback.tokenAmountIn;
        idsIn = callback.idsIn;

        ISeacowsERC721TradePair _pair = ISeacowsERC721TradePair(msg.sender);
        if (_pair.supportsInterface(type(ISeacowsERC721TradePair).interfaceId) == false) {
            revert SSC_NOT_SEACOWS_PAIR();
        }
        address _token = _pair.token();
        address _collection = _pair.collection();

        if (ISeacowsPositionManager(manager).getPair(_token, _collection, _pair.feePercent()) != msg.sender) {
            revert SSC_PAIR_MISMATCH();
        }
        if (tokenAmountIn > 0) {
            IERC20(_token).transferFrom(callback.payer, msg.sender, tokenAmountIn);
        }
        if (idsIn.length > 0) {
            for (uint256 i = 0; i < idsIn.length; i++) {
                IERC721(_collection).safeTransferFrom(callback.payer, msg.sender, idsIn[i]);
            }
        }
    }
}
