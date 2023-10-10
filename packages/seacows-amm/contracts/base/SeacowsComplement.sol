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

    // _tokenAmountOut: Expected token out 
    // _nftAmountOut: Expected nft out 
    function getComplemenetedAssetsOut(
        int256 _tokenAmountOut,
        int256 _nftAmountOut
    )
        public
        view
        returns (int256 tokenAmountOut, int256 nftAmountOut, int256 newTokenComplement, int256 newNftComplement)
    {
        int256 complement = int256(COMPLEMENT_PRECISION);

        // 向下取整，保证quotient是complement的整数倍
        // 200 =（257 / 100）* 100
        int256 quotient = (_nftAmountOut / complement) * complement;

        // 
        int256 remainer = quotient - _nftAmountOut; // ？formula里面是 _nftAmountOut - quotient

        
        // 根据文档里面的条件公式，向上取整。
        if (remainer + _nftComplement <= COMPLEMENT_THRESHOLD) {
            quotient = quotient + complement;
        }

        if (quotient >= complement) {
            nftAmountOut = quotient;

            // Actual NFT Amount Out - Expected NFT Amount Out （实际的-预估的）
            int256 nftChange = nftAmountOut - _nftAmountOut;

            // update complemented nft amount （更新本地 补足nft 的数量）
            newNftComplement = _nftComplement + nftChange;

            
            // Actual Token Amount Out
            // Formula reference: https://github.com/yolominds/seacows-protocol-specification/blob/main/overview.md#seacows-complement
            int256 tokenChange = (nftChange * _tokenAmountOut) / _nftAmountOut;
            tokenAmountOut = _tokenAmountOut - tokenChange; // 这段计算逻辑和github的formula一致

            // update complemented token amount
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
