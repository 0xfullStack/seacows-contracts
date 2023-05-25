// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


interface ISeacowsComplement {
    function COMPLEMENT_PRECISION() external view returns (uint);
    function tokenComplement() external view returns (int256);
    function nftComplement() external view returns (uint256);
    function getComplemenetedAssetsOut(uint256 _tokenAmountOut, uint256 _nftAmountOut) external view returns (uint256 tokenAmountOut, uint256 nftAmountOut, int256 tokenComplementAdjusted, uint256 nftComplementAdjusted);
}
