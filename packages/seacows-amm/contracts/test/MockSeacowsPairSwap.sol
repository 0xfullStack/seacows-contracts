// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.13;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {ISeacowsSwapCallback} from '@yolominds/seacows-periphery/contracts/interfaces/ISeacowsSwapCallback.sol';
import {ISeacowsERC721TradePair} from '../interfaces/ISeacowsERC721TradePair.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MockSeacowsPairSwap is ISeacowsSwapCallback {
    function swap(
        address pair,
        uint tokenAmountOut,
        uint[] memory idsOut,
        address to,
        uint tokenAmountIn,
        uint[] memory idsIn
    ) public {
        ISeacowsERC721TradePair(pair).swap(tokenAmountOut, idsOut, to, abi.encode(msg.sender, tokenAmountIn, idsIn));
    }

    function seacowsSwapCallback(bytes calldata data) public returns (uint tokenAmountIn, uint[] memory idsIn) {
        address sender;
        (sender, tokenAmountIn, idsIn) = abi.decode(data, (address, uint256, uint256[]));
        address _token = ISeacowsERC721TradePair(msg.sender).token();
        address _collection = ISeacowsERC721TradePair(msg.sender).collection();

        if (tokenAmountIn > 0) IERC20(_token).transferFrom(sender, msg.sender, tokenAmountIn);
        if (idsIn.length > 0) {
            for (uint i = 0; i < idsIn.length; i++) {
                IERC721(_collection).safeTransferFrom(sender, msg.sender, idsIn[i]);
            }
        }
    }
}
