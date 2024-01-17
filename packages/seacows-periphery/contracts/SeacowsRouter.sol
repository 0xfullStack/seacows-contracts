// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {ISeacowsERC721TradePair} from '@yolominds/seacows-amm/contracts/interfaces/ISeacowsERC721TradePair.sol';
import {SeacowsSwapCallback} from './base/SeacowsSwapCallback.sol';
import {PeripheryImmutableState} from './base/PeripheryImmutableState.sol';
import {ISeacowsRouter} from './interfaces/ISeacowsRouter.sol';
import {IWETH} from './interfaces/IWETH.sol';
import {SeacowsLibrary} from './lib/SeacowsLibrary.sol';

contract SeacowsRouter is PeripheryImmutableState, SeacowsSwapCallback, ISeacowsRouter {
    constructor(address _manager, address _weth) SeacowsSwapCallback(_manager, _weth) {}

    modifier checkDeadline(uint256 deadline) {
        if (deadline < block.timestamp) {
            revert SR_EXPIRED();
        }
        _;
    }

    /**
        @notice Swap from ERC20 to ERC721
        @param _pair The pair to swap with
        @param idsOut The NFT ids to swap out
        @param amountInMax The max amount of ERC20 to input
        @param royaltyPercent The Royalty Percentage. The percentage is based on the PERCENTAGE_PRECISION
        @param to The address that receive the NFTs swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function swapTokensForExactNFTs(
        address _pair,
        uint256[] memory idsOut,
        uint256 amountInMax,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) public checkDeadline(deadline) returns (uint256 amountIn) {
        ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(_pair);
        (uint256 tokenReserve, uint256 nftReserve, ) = pair.getReserves();
        amountIn = SeacowsLibrary.getAmountIn(
            idsOut.length * pair.COMPLEMENT_PRECISION(),
            tokenReserve,
            nftReserve,
            pair.feePercent() + pair.protocolFeePercent() + royaltyPercent,
            pair.PERCENTAGE_PRECISION()
        );
        if (amountIn > amountInMax) {
            revert SR_EXCESSIVE_INPUT_AMOUNT();
        }
        SwapCallbackData memory _data = SwapCallbackData({
            payer: msg.sender,
            idsIn: new uint256[](0),
            tokenAmountIn: amountIn
        });
        pair.swap(0, idsOut, to, abi.encode(_data));
    }

    /**
        @notice Swap from ETH to ERC721
        @param _pair The pair to swap with
        @param idsOut The NFT ids to swap out
        @param amountInMax The max amount of ETH to input
        @param royaltyPercent The Royalty Percentage. The percentage is based on the PERCENTAGE_PRECISION
        @param to The address that receive the NFTs swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function swapETHForExactNFTs(
        address _pair,
        uint256[] memory idsOut,
        uint256 amountInMax,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external payable checkDeadline(deadline) returns (uint256 amountIn) {
        IWETH(weth).deposit{value: msg.value}();
        amountIn = this.swapTokensForExactNFTs(_pair, idsOut, amountInMax, royaltyPercent, to, deadline);
        uint256 surplus = msg.value - amountIn;
        if (surplus > 0) {
            IWETH(weth).withdraw(surplus);
            _sendETH(msg.sender, surplus);
        }
    }

    /**
        @notice Swap from ERC721 to ERC20
        @param _pair The pair to swap with
        @param idsIn The NFT ids to swap in
        @param amountOutMin The min amount of ERC20 to swap out
        @param royaltyPercent The Royalty Percentage. The percentage is based on the PERCENTAGE_PRECISION
        @param to The address that receive the ERC20 swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function swapExactNFTsForTokens(
        address _pair,
        uint256[] memory idsIn,
        uint256 amountOutMin,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) public checkDeadline(deadline) returns (uint256 amountOut) {
        ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(_pair);
        (uint256 tokenReserve, uint256 nftReserve, ) = pair.getReserves();
        amountOut = SeacowsLibrary.getAmountOut(
            idsIn.length * pair.COMPLEMENT_PRECISION(),
            tokenReserve,
            nftReserve,
            pair.feePercent() + pair.protocolFeePercent() + royaltyPercent,
            pair.PERCENTAGE_PRECISION()
        );
        if (amountOut < amountOutMin) {
            revert SR_INSUFFICIENT_OUTPUT_AMOUNT();
        }
        SwapCallbackData memory _data = SwapCallbackData({payer: msg.sender, idsIn: idsIn, tokenAmountIn: 0});
        pair.swap(amountOut, new uint256[](0), to, abi.encode(_data));
    }

    /**
        @notice Swap from ERC721 to ETH
        @param _pair The pair to swap with
        @param idsIn The NFT ids to swap in
        @param amountOutMin The min amount of ETH to swap out
        @param royaltyPercent The Royalty Percentage. The percentage is based on the PERCENTAGE_PRECISION
        @param to The address that receive the ETH swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function swapExactNFTsForETH(
        address _pair,
        uint256[] memory idsIn,
        uint256 amountOutMin,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external checkDeadline(deadline) returns (uint256 amountOut) {
        amountOut = swapExactNFTsForTokens(_pair, idsIn, amountOutMin, royaltyPercent, address(this), deadline);
        IWETH(weth).withdraw(amountOut);
        _sendETH(to, amountOut);
    }

    /**
        @notice Swap from ERC20 to ERC721
        @param _pairs The pairs to swap with
        @param idsOuts The array of NFT ids to swap out
        @param amountInMaxs The array of max amount of ERC20 to input
        @param royaltyPercent The Royalty Percentage. The percentage is based on the PERCENTAGE_PRECISION
        @param to The address that receive the NFTs swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function batchSwapTokensForExactNFTs(
        address[] calldata _pairs,
        uint256[][] calldata idsOuts,
        uint256[] calldata amountInMaxs,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external virtual checkDeadline(deadline) returns (uint256 amountIn) {
        if (_pairs.length != idsOuts.length || idsOuts.length != amountInMaxs.length) {
            revert SR_INVALID_PARAMS_LENGTH();
        }
        for (uint256 i = 0; i < _pairs.length; i++) {
            amountIn += swapTokensForExactNFTs(_pairs[i], idsOuts[i], amountInMaxs[i], royaltyPercent, to, deadline);
        }
    }

    /**
        @notice Swap from ERC721 to ERC20
        @param _pairs The pairs to swap with
        @param idsIns The array of NFT ids to swap in for each pair
        @param amountOutMins The array of min amount of ERC20 to swap out
        @param royaltyPercent The Royalty Percentage. The percentage is based on the PERCENTAGE_PRECISION
        @param to The address that receive the ERC20 swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function batchSwapExactNFTsForTokens(
        address[] calldata _pairs,
        uint256[][] calldata idsIns,
        uint256[] calldata amountOutMins,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external virtual checkDeadline(deadline) returns (uint256 amountOut) {
        if (_pairs.length != idsIns.length || idsIns.length != amountOutMins.length) {
            revert SR_INVALID_PARAMS_LENGTH();
        }
        for (uint256 i = 0; i < _pairs.length; i++) {
            amountOut += swapExactNFTsForTokens(_pairs[i], idsIns[i], amountOutMins[i], royaltyPercent, to, deadline);
        }
    }

    /**
        @notice Swap from ETH to ERC721
        @param _pairs The pairs to swap with
        @param idsOuts The array of NFT ids to swap out
        @param amountInMaxs The array of max amount of ETH to input
        @param royaltyPercent The Royalty Percentage. The percentage is based on the PERCENTAGE_PRECISION
        @param to The address that receive the NFTs swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function batchSwapETHForExactNFTs(
        address[] calldata _pairs,
        uint256[][] calldata idsOuts,
        uint256[] calldata amountInMaxs,
        uint256 royaltyPercent,
        address to,
        uint256 deadline
    ) external payable virtual checkDeadline(deadline) returns (uint256 amountIn) {
        if (_pairs.length != idsOuts.length || idsOuts.length != amountInMaxs.length) {
            revert SR_INVALID_PARAMS_LENGTH();
        }
        IWETH(weth).deposit{value: msg.value}();
        for (uint256 i = 0; i < _pairs.length; i++) {
            amountIn += this.swapTokensForExactNFTs(
                _pairs[i],
                idsOuts[i],
                amountInMaxs[i],
                royaltyPercent,
                to,
                deadline
            );
        }
        uint256 surplus = msg.value - amountIn;
        if (surplus > 0) {
            IWETH(weth).withdraw(surplus);
            _sendETH(msg.sender, surplus);
        }
    }

    /**
        @notice Swap from ERC721 to ETH
        @param _pairs The pairs to swap with
        @param idsIns The array of NFT ids to swap in for each pair
        @param amountOutMins The array of min amount of ETH to swap out
        @param to The address that receive the ETH swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function batchSwapExactNFTsForETH(
        address[] calldata _pairs,
        uint256[][] calldata idsIns,
        uint256[] calldata amountOutMins,
        uint256[] calldata royaltyPercent,
        address to,
        uint256 deadline
    ) external virtual checkDeadline(deadline) returns (uint256 amountOut) {
        if (_pairs.length != idsIns.length || idsIns.length != amountOutMins.length) {
            revert SR_INVALID_PARAMS_LENGTH();
        }
        for (uint256 i = 0; i < _pairs.length; i++) {
            amountOut += swapExactNFTsForTokens(
                _pairs[i],
                idsIns[i],
                amountOutMins[i],
                royaltyPercent[i],
                address(this),
                deadline
            );
        }

        IWETH(weth).withdraw(amountOut);
        _sendETH(to, amountOut);
    }

    function _sendETH(address to, uint256 amount) internal {
        (bool sent, ) = to.call{value: amount}('');
        if (sent == false) {
            revert SR_ETH_TRANSFER_FAILED();
        }
    }

    receive() external payable {}
}
