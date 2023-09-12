// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ISeacowsComplement {
    function COMPLEMENT_PRECISION() external view returns (uint);

    function tokenComplement() external view returns (int256);

    function nftComplement() external view returns (int256);

    function getComplemenetedAssetsOut(
        int256 _tokenAmountOut,
        int256 _nftAmountOut
    )
        external
        view
        returns (int256 tokenAmountOut, int256 nftAmountOut, int256 newTokenComplement, int256 newNftComplement);
}
