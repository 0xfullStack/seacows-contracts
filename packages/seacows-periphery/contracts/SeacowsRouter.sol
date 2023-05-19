// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './interfaces/ISeacowsRouter.sol';
import './interfaces/ISeacowsERC721TradePair.sol';
import './lib/SeacowsLibrary.sol';

contract SeacowsRouter is ISeacowsRouter {
    using SafeMath for uint;
    using SafeMath for uint112;

    modifier checkDeadline(uint deadline) {
        require(deadline >= block.timestamp, 'SeacowsPositionManager: EXPIRED');
        _;
    }

    /**
        @notice Swap from ERC20 to ERC721
        @param _pair The pair to swap with
        @param idsOut The NFT ids to swap out
        @param amountInMax The max amount of ERC20 to input
        @param to The address that receive the NFTs swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function swapTokensForExactNFTs(
        address _pair,
        uint[] memory idsOut,
        uint amountInMax,
        address to,
        uint deadline
    ) public checkDeadline(deadline) returns (uint amountIn) {
        ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(_pair);
        (uint tokenReserve, uint nftReserve, ) = pair.getReserves();
        amountIn = SeacowsLibrary.getAmountIn(
            idsOut.length * pair.COMPLEMENT_PRECISION(),
            tokenReserve,
            nftReserve,
            pair.fee(),
            pair.PERCENTAGE_PRECISION()
        );
        require(amountIn <= amountInMax, 'SeacowsPositionManager: EXCESSIVE_INPUT_AMOUNT');
        IERC20(pair.token()).transferFrom(msg.sender, _pair, amountIn);
        pair.swap(0, idsOut, to);
    }

    /**
        @notice Swap from ERC721 to ERC20
        @param _pair The pair to swap with
        @param idsIn The NFT ids to swap in
        @param amountOutMin The min amount of ERC20 to swap out
        @param to The address that receive the ERC20 swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function swapExactNFTsForTokens(
        address _pair,
        uint[] memory idsIn,
        uint amountOutMin,
        address to,
        uint deadline
    ) public checkDeadline(deadline) returns (uint amountOut) {
        ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(_pair);
        (uint tokenReserve, uint nftReserve, ) = pair.getReserves();
        amountOut = SeacowsLibrary.getAmountOut(
            idsIn.length * pair.COMPLEMENT_PRECISION(),
            tokenReserve,
            nftReserve,
            pair.fee(),
            pair.PERCENTAGE_PRECISION()
        );
        require(amountOut >= amountOutMin, 'SeacowsPositionManager: INSUFFICIENT_OUTPUT_AMOUNT');
        for (uint i = 0; i < idsIn.length; i++) {
            IERC721(pair.collection()).safeTransferFrom(msg.sender, _pair, idsIn[i]);
        }
        pair.swap(amountOut, new uint[](0), to);
    }

    /**
        @notice Swap from ERC20 to ERC721
        @param _pairs The pairs to swap with
        @param idsOuts The array of NFT ids to swap out
        @param amountInMaxs The array of max amount of ERC20 to input
        @param to The address that receive the NFTs swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function batchSwapTokensForExactNFTs(
        address[] calldata _pairs,
        uint[][] calldata idsOuts,
        uint[] calldata amountInMaxs,
        address to,
        uint deadline
    ) external virtual checkDeadline(deadline) returns (uint amountIn) {
        require(_pairs.length == idsOuts.length && idsOuts.length == amountInMaxs.length, "SeacowsRouter: INVALID_PARAMS_LENGTH");
        for (uint256 i = 0; i < _pairs.length; i++) {
            amountIn += swapTokensForExactNFTs(_pairs[i], idsOuts[i], amountInMaxs[i], to, deadline);
        }
    }

    /**
        @notice Swap from ERC721 to ERC20
        @param _pairs The pairs to swap with
        @param idsIns The array of NFT ids to swap in for each pair
        @param amountOutMins The array of min amount of ERC20 to swap out
        @param to The address that receive the ERC20 swapped out
        @param deadline The timestamp of deadline in seconds
     */
    function batchSwapExactNFTsForTokens(
        address[] calldata _pairs,
        uint[][] calldata idsIns,
        uint[] calldata amountOutMins,
        address to,
        uint deadline
    ) external virtual checkDeadline(deadline) returns (uint amountOut) {
        require(_pairs.length == idsIns.length && idsIns.length == amountOutMins.length, "SeacowsRouter: INVALID_PARAMS_LENGTH");
        for (uint256 i = 0; i < _pairs.length; i++) {
            amountOut += swapExactNFTsForTokens(_pairs[i], idsIns[i], amountOutMins[i], to, deadline);
        }
    }
    
}
