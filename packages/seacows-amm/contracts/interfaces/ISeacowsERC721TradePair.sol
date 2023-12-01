// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {IERC165} from '@openzeppelin/contracts/utils/introspection/IERC165.sol';
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
    event Mint(address indexed sender, uint256 tokenAmount, uint256 nftAmount);
    event Burn(
        address indexed sender,
        uint256 cTokenOut,
        uint256 cNftOut,
        uint256 tokenAmountOut,
        uint256[] idsOut,
        address indexed to
    );
    event Swap(
        address indexed sender,
        uint256 tokenIn,
        uint256 nftIn,
        uint256 tokenOut,
        uint256 nftOut,
        address indexed to
    );
    event Sync(uint256 reserve0, uint256 reserve1);

    function feePercent() external view returns (uint256);

    function protocolFeePercent() external view returns (uint256);

    function getComplementedBalance() external view returns (uint256 tokenBalance, uint256 nftBalance);

    function initialize(address _collection, address _token, uint256 _fee) external;

    function getReserves() external view returns (uint256 _reserve0, uint256 _reserve1, uint32 _blockTimestampLast);

    function mint(uint256 toTokenId) external returns (uint256 liquidity);

    function burn(
        address from,
        address to,
        uint256[] memory ids
    ) external returns (uint256 cTokenOut, uint256 cNftOut, uint256 tokenOut, uint256[] memory idsOut);

    function swap(uint256 tokenAmountOut, uint256[] memory idsOut, address to, bytes calldata data) external;

    function setProtocolFeePercent(uint256 _protocolFee) external;
}
