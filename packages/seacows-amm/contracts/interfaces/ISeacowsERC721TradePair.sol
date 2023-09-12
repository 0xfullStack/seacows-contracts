// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/utils/introspection/IERC165.sol';
import {IRoyaltyManagement} from './IRoyaltyManagement.sol';
import {ISeacowsComplement} from './ISeacowsComplement.sol';
import {ISeacowsPairMetadata} from './ISeacowsPairMetadata.sol';
import {ISeacowsRewarder} from './ISeacowsRewarder.sol';

interface ISeacowsERC721TradePair is
    ISeacowsComplement,
    ISeacowsRewarder,
    IERC165,
    ISeacowsPairMetadata,
    IRoyaltyManagement
{
    event Mint(address indexed sender, uint tokenAmount, uint nftAmount);
    event Burn(
        address indexed sender,
        uint cTokenOut,
        uint cNftOut,
        uint tokenAmountIn,
        uint tokenAmountOut,
        uint[] idsOut,
        address indexed to
    );
    event Swap(address indexed sender, uint tokenIn, uint nftIn, uint tokenOut, uint nftOut, address indexed to);
    event Sync(uint256 reserve0, uint256 reserve1);

    function feePercent() external view returns (uint256);

    function protocolFeePercent() external view returns (uint);

    function getComplementedBalance() external view returns (uint256 tokenBalance, uint256 nftBalance);

    function initialize(address _collection, address _token, uint256 _fee) external;

    function getReserves() external view returns (uint256 _reserve0, uint256 _reserve1, uint32 _blockTimestampLast);

    function mint(uint256 toTokenId) external returns (uint liquidity);

    function burn(
        address from,
        address to,
        uint256[] memory ids
    ) external returns (uint cTokenOut, uint cNftOut, uint tokenIn, uint tokenOut, uint[] memory idsOut);

    function swap(uint tokenAmountOut, uint[] memory idsOut, address to, bytes calldata data) external;

    function setProtocolFeePercent(uint256 _protocolFee) external;
}
