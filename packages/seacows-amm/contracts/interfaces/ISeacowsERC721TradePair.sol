// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { ISeacowsComplement } from "./ISeacowsComplement.sol";

interface ISeacowsERC721TradePair is ISeacowsComplement {
    event Mint(address indexed sender, uint tokenAmount, uint nftAmount);
    event Burn(address indexed sender, uint cTokenOut, uint cNftOut, uint tokenAmountIn, uint tokenAmountOut, uint[] idsOut, address indexed to);
    event Swap(
        address indexed sender,
        uint tokenIn,
        uint nftIn,
        uint tokenOut,
        uint nftOut,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function totalSupply() external view returns (uint256);
    function token() external view returns (address);
    function collection() external view returns (address);
    function fee() external view returns (uint);
    function PERCENTAGE_PRECISION() external view returns (uint);
    // function COMPLEMENT_PRECISION() external view returns (uint);
    function getComplementedBalance() external view returns (uint256 tokenBalance, uint256 nftBalance);


    function initialize(address _collection, address _token, uint112 _fee) external;
    function getReserves() external view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast);
    function mint(uint256 toTokenId) external returns (uint liquidity);
    function burn(address from, address to, uint256[] memory ids) external returns (uint cTokenOut, uint cNftOut, uint tokenIn, uint tokenOut, uint[] memory idsOut);
    function swap(uint tokenAmountOut, uint[] memory idsOut, address to) external;
}
