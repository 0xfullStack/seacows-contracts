// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {ISeacowsComplement} from '../interfaces/ISeacowsComplement.sol';

// contract SeacowsComplement is IFeeManagement {
contract SeacowsComplement is ISeacowsComplement {
    int256 private _tokenComplement;
    int256 private _nftComplement;

    uint public constant COMPLEMENT_PRECISION = 10 ** 18;
    int public constant COMPLEMENT_THRESHOLD = -5 * 10 ** 17;

    constructor() {}

    function tokenComplement() public view returns (int256) {
        return _tokenComplement;
    }

    function nftComplement() public view returns (int256) {
        return _nftComplement;
    }

    function getComplemenetedAssetsOut(
        int256 _tokenAmountOut,
        int256 _nftAmountOut
    )
        public
        view
        returns (int256 tokenAmountOut, int256 nftAmountOut, int256 newTokenComplement, int256 newNftComplement)
    {
        int256 complement = int256(COMPLEMENT_PRECISION);

        int256 quotient = (_nftAmountOut / complement) * complement;
        int256 remainer = quotient - _nftAmountOut;

        if (remainer + _nftComplement <= COMPLEMENT_THRESHOLD) {
            quotient = quotient + complement;
        }

        if (quotient >= complement) {
            nftAmountOut = quotient;
            int256 nftChange = nftAmountOut - _nftAmountOut;
            newNftComplement = _nftComplement + nftChange;

            int256 tokenChange = (nftChange * _tokenAmountOut) / _nftAmountOut;
            tokenAmountOut = _tokenAmountOut - tokenChange;
            newTokenComplement = _tokenComplement - tokenChange;
        } else {
            newNftComplement = _nftComplement - _nftAmountOut;
            nftAmountOut = 0;

            tokenAmountOut = 2 * _tokenAmountOut;
            newTokenComplement = _tokenComplement + _tokenAmountOut;
        }
    }

    // Expect _nftAmountOut = NFT quantity output * precision
    function _updateComplement(
        uint256 _tokenAmountOut,
        uint256 _nftAmountOut
    ) internal returns (uint256 tokenAmountIn, uint256 tokenAmountOut, uint256 nftAmountOut) {
        int256 tokenOut;
        int256 nftOut;
        (tokenOut, nftOut, _tokenComplement, _nftComplement) = getComplemenetedAssetsOut(
            int(_tokenAmountOut),
            int(_nftAmountOut)
        );
        if (tokenOut < 0) {
            tokenAmountIn = uint256(0 - tokenOut);
            tokenAmountOut = 0;
        } else {
            tokenAmountIn = 0;
            tokenAmountOut = uint256(tokenOut);
        }
        nftAmountOut = uint256(nftOut);
    }
}
