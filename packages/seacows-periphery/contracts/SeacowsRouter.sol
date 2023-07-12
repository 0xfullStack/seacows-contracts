// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@yolominds/seacows-amm/contracts/interfaces/ISeacowsERC721TradePair.sol';
import './base/SeacowsSwapCallback.sol';
import './base/PeripheryImmutableState.sol';
import './interfaces/ISeacowsRouter.sol';
import './interfaces/IWETH.sol';
import './lib/SeacowsLibrary.sol';

contract SeacowsRouter is PeripheryImmutableState, SeacowsSwapCallback, ISeacowsRouter {

    constructor(address _manager, address _weth) SeacowsSwapCallback(_manager, _weth) {}

    modifier checkDeadline(uint deadline) {
        require(deadline >= block.timestamp, 'SeacowsRouter: EXPIRED');
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
        uint[] memory idsOut,
        uint amountInMax,
        uint royaltyPercent,
        address to,
        uint deadline
    ) public checkDeadline(deadline) returns (uint amountIn) {
        ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(_pair);
        (uint tokenReserve, uint nftReserve, ) = pair.getReserves();
        amountIn = SeacowsLibrary.getAmountIn(
            idsOut.length * pair.COMPLEMENT_PRECISION(),
            tokenReserve,
            nftReserve,
            pair.feePercent() + pair.protocolFeePercent() + royaltyPercent,
            pair.PERCENTAGE_PRECISION()
        );
        require(amountIn <= amountInMax, 'SeacowsRouter: EXCESSIVE_INPUT_AMOUNT');
        SwapCallbackData memory _data = SwapCallbackData({ payer: msg.sender, idsIn: new uint[](0), tokenAmountIn: amountIn });
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
        uint[] memory idsOut,
        uint amountInMax,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external payable checkDeadline(deadline) returns (uint amountIn) {
        // convert eth to weth
        IWETH(weth).deposit{value: amountIn}();
        IWETH(weth).transfer(_pair, amountIn);

        amountIn = this.swapTokensForExactNFTs(_pair, idsOut, amountInMax, royaltyPercent, to, deadline);

        // refund remaining eth
        _sendETH(msg.sender, msg.value - amountIn);
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
        uint[] memory idsIn,
        uint amountOutMin,
        uint royaltyPercent,
        address to,
        uint deadline
    ) public checkDeadline(deadline) returns (uint amountOut) {
        ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(_pair);
        (uint tokenReserve, uint nftReserve, ) = pair.getReserves();
        amountOut = SeacowsLibrary.getAmountOut(
            idsIn.length * pair.COMPLEMENT_PRECISION(),
            tokenReserve,
            nftReserve,
            pair.feePercent() + pair.protocolFeePercent() + royaltyPercent,
            pair.PERCENTAGE_PRECISION()
        );
        require(amountOut >= amountOutMin, 'SeacowsRouter: INSUFFICIENT_OUTPUT_AMOUNT');
        SwapCallbackData memory _data = SwapCallbackData({ payer: msg.sender, idsIn: idsIn, tokenAmountIn: 0 });
        pair.swap(amountOut, new uint[](0), to, abi.encode(_data));
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
        uint[] memory idsIn,
        uint amountOutMin,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external checkDeadline(deadline) returns (uint amountOut) {
        amountOut = swapExactNFTsForTokens(_pair, idsIn, amountOutMin, royaltyPercent, address(this), deadline);
        // withdraw eth
        IWETH(weth).withdraw(amountOut);
        // send to user
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
        uint[][] calldata idsOuts,
        uint[] calldata amountInMaxs,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external virtual checkDeadline(deadline) returns (uint amountIn) {
        require(
            _pairs.length == idsOuts.length && idsOuts.length == amountInMaxs.length,
            'SeacowsRouter: INVALID_PARAMS_LENGTH'
        );
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
        uint[][] calldata idsIns,
        uint[] calldata amountOutMins,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external virtual checkDeadline(deadline) returns (uint amountOut) {
        require(
            _pairs.length == idsIns.length && idsIns.length == amountOutMins.length,
            'SeacowsRouter: INVALID_PARAMS_LENGTH'
        );
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
        uint[][] calldata idsOuts,
        uint[] calldata amountInMaxs,
        uint royaltyPercent,
        address to,
        uint deadline
    ) external payable virtual checkDeadline(deadline) returns (uint amountIn) {
        require(
            _pairs.length == idsOuts.length && idsOuts.length == amountInMaxs.length,
            'SeacowsRouter: INVALID_PARAMS_LENGTH'
        );

        // convert eth to weth
        IWETH(weth).deposit{value: msg.value}();

        for (uint256 i = 0; i < _pairs.length; i++) {
            amountIn += this.swapTokensForExactNFTs(_pairs[i], idsOuts[i], amountInMaxs[i], royaltyPercent, to, deadline);
        }

        // refund remaining eth
        uint256 remainingAmount = msg.value - amountIn;
        IWETH(weth).withdraw(remainingAmount);
        _sendETH(msg.sender, remainingAmount);
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
        uint[][] calldata idsIns,
        uint[] calldata amountOutMins,
        uint[] calldata royaltyPercent,
        address to,
        uint deadline
    ) external virtual checkDeadline(deadline) returns (uint amountOut) {
        require(
            _pairs.length == idsIns.length && idsIns.length == amountOutMins.length,
            'SeacowsRouter: INVALID_PARAMS_LENGTH'
        );
        for (uint256 i = 0; i < _pairs.length; i++) {
            amountOut += swapExactNFTsForTokens(_pairs[i], idsIns[i], amountOutMins[i], royaltyPercent[i], address(this), deadline);
        }

        // withdraw eth
        IWETH(weth).withdraw(amountOut);
        // send to user
        _sendETH(to, amountOut);
    }

    /** Internal functions */
    function _sendETH(address to, uint256 amount) internal {
        (bool sent, ) = to.call{value: amount}('');
        require(sent, 'Failed to send Ether');
    }

    receive() external payable {}
}
