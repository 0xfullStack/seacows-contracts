// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@yolominds/seacows-amm/contracts/interfaces/ISeacowsERC721TradePair.sol';
import '@yolominds/seacows-amm/contracts/interfaces/ISeacowsPositionManager.sol';
import {ISeacowsSwapCallback} from '../interfaces/ISeacowsSwapCallback.sol';
import './PeripheryImmutableState.sol';

contract SeacowsSwapCallback is PeripheryImmutableState, ISeacowsSwapCallback {

    struct SwapCallbackData {
        address payer;
        uint[] idsIn;
        uint tokenAmountIn;
    }

    constructor(address _manager, address _weth) PeripheryImmutableState(_manager, _weth) {}

    function seacowsSwapCallback(bytes calldata _data) public returns (uint tokenAmountIn, uint[] memory idsIn) {
        SwapCallbackData memory callback = abi.decode(_data, (SwapCallbackData));
        tokenAmountIn = callback.tokenAmountIn;
        idsIn = callback.idsIn;

        ISeacowsERC721TradePair _pair = ISeacowsERC721TradePair(msg.sender);
        require(_pair.supportsInterface(type(ISeacowsERC721TradePair).interfaceId), "SeacowsSwapCallback: NOT_SEACOWS_PAIR");
        address _token = _pair.token();
        address _collection = _pair.collection();

        require(ISeacowsPositionManager(manager).getPair(_token, _collection, _pair.feePercent()) == msg.sender, "SeacowsSwapCallback: PAIR_MISMATCH");

        if (tokenAmountIn > 0) IERC20(_token).transferFrom(callback.payer, msg.sender, tokenAmountIn);
        if (idsIn.length > 0) {
            for (uint i = 0; i < idsIn.length; i++) {
                IERC721(_collection).safeTransferFrom(callback.payer, msg.sender, idsIn[i]);
            }
        }
    }
}
