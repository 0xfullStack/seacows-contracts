// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import {ERC3525Upgradeable} from '@solvprotocol/erc-3525/ERC3525Upgradeable.sol';
import {ISeacowsERC721TradePair} from './interfaces/ISeacowsERC721TradePair.sol';
import {ISeacowsERC721TradePairFactory} from './interfaces/ISeacowsERC721TradePairFactory.sol';
import {ISeacowsPositionManager} from './interfaces/ISeacowsPositionManager.sol';
import './lib/UQ112x112.sol';
import './base/SeacowsComplement.sol';
import './base/SeacowsPairMetadata.sol';

/// @title The base contract for an NFT/TOKEN AMM pair
/// Inspired by 0xmons; Modified from https://github.com/sudoswap/lssvm
/// @notice This implements the core swap logic from NFT to TOKEN
contract SeacowsERC721TradePair is
    ReentrancyGuardUpgradeable,
    SeacowsComplement,
    SeacowsPairMetadata,
    ISeacowsERC721TradePair
{
    using SafeMath for uint;
    using SafeMath for uint112;
    using UQ112x112 for uint224;

    address private _positionManager;

    address public collection;
    address public token;
    uint256 public fee;

    // Token reserve
    uint112 private reserve0;

    // NFT reserve
    uint112 private reserve1;

    uint32 private blockTimestampLast;

    uint public price0CumulativeLast;
    uint public price1CumulativeLast;

    uint public constant PERCENTAGE_PRECISION = 10 ** 4;
    uint public constant ONE_PERCENT = 10 ** 2;
    uint public constant POINT_FIVE_PERCENT = 5 * 10;

    function initialize(address token_, address collection_, uint112 fee_) public initializer {
        require(fee_ == ONE_PERCENT || fee_ == POINT_FIVE_PERCENT, 'Invalid _fee');

        _positionManager = msg.sender;
        token = token_;
        collection = collection_;
        fee = fee_;
        __ReentrancyGuard_init();
    }

    function positionManager() public view returns (address) {
        return _positionManager;
    }

    function slot() public view returns (uint256) {
        return ISeacowsPositionManager(positionManager()).slotOfPair(address(this));
    }

    function totalSupply() public view returns (uint256) {
        return ISeacowsPositionManager(positionManager()).totalValueSupplyOf(slot());
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    // this low-level function should be called from a contract which performs important safety checks
    function mint(uint256 toTokenId) public nonReentrant returns (uint liquidity) {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        (uint balance0, uint balance1) = getComplementedBalance(token, collection);
        uint112 amount0 = uint112(balance0.sub(_reserve0));
        uint112 amount1 = uint112(balance1.sub(_reserve1));

        uint _totalSupply = totalSupply(); // gas savings, must be defined here since totalSupply can update in _mintFee
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0.mul(amount1));
        } else {
            liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
        }
        require(liquidity > 0, 'SeacowsERC721TradePair: INSUFFICIENT_LIQUIDITY_MINTED');
        _mint(toTokenId, liquidity);

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Mint(msg.sender, amount0, amount1);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function burn(address to, uint256[] memory ids) public nonReentrant returns (uint amount0, uint amount1) {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        address _token = token; // gas savings
        address _collection = collection; // gas savings
        (uint balance0, uint balance1) = getComplementedBalance(_token, _collection);

        uint256 _pairTokenId = ISeacowsPositionManager(positionManager()).tokenOf(address(this));
        uint liquidity = ISeacowsPositionManager(positionManager()).balanceOf(_pairTokenId);

        {
            // scope to avoid stack too deep errors
            uint _totalSupply = totalSupply(); // gas savings, must be defined here since totalSupply can update in _mintFee
            amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
            amount1 = liquidity.mul(balance1) / _totalSupply; // using balances ensures pro-rata distribution
            require(amount0 > 0 && amount1 > 0, 'SeacowsERC721TradePair: INSUFFICIENT_LIQUIDITY_BURNED');

            (amount0, amount1) = _updateComplement(amount0, amount1);
            require(ids.length * COMPLEMENT_PRECISION == amount1, 'SeacowsERC721TradePair: INVALID_IDS_TO_REMOVE');
            _burn(_pairTokenId, liquidity);
        }

        IERC20Metadata(_token).transfer(to, amount0);
        for (uint i = 0; i < ids.length; i++) {
            IERC721Metadata(_collection).safeTransferFrom(address(this), to, ids[i]);
        }

        (balance0, balance1) = getComplementedBalance(_token, _collection);

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Burn(msg.sender, amount0, amount1, to);
    }

    // this low-level function should be called from a contract which performs important safety checks
    // function swap(uint tokenAmountOut, uint[] memory idsOut, address to, bytes calldata data) external nonReentrant {
    function swap(uint tokenAmountOut, uint[] memory idsOut, address to) external nonReentrant {
        require(tokenAmountOut > 0 || idsOut.length > 0, 'Seacows: INSUFFICIENT_OUTPUT_AMOUNT');
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        require(tokenAmountOut < _reserve0 && idsOut.length < _reserve1, 'Seacows: INSUFFICIENT_LIQUIDITY');

        uint balance0;
        uint balance1;
        {
            // scope for _token{0,1}, avoids stack too deep errors
            address _token = token;
            address _collection = collection;
            require(to != _token && to != _collection, 'Seacows: INVALID_TO');
            if (tokenAmountOut > 0) IERC20(_token).transfer(to, tokenAmountOut); // optimistically transfer tokens
            if (idsOut.length > 0) {
                for (uint i = 0; i < idsOut.length; i++) {
                    IERC721Metadata(_collection).safeTransferFrom(address(this), to, idsOut[i]); // optimistically transfer tokens
                }
            }
            // if (data.length > 0) ISeacowsCallee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
            (balance0, balance1) = getComplementedBalance(_token, _collection);
        }
        uint amount0In = balance0 > _reserve0 - tokenAmountOut ? balance0 - (_reserve0 - tokenAmountOut) : 0;
        uint amount1In = balance1 > _reserve1 - idsOut.length * COMPLEMENT_PRECISION
            ? balance1 - (_reserve1 - idsOut.length * COMPLEMENT_PRECISION)
            : 0;
        require(amount0In > 0 || amount1In > 0, 'Seacows: INSUFFICIENT_INPUT_AMOUNT');
        {
            // scope for reserve{0,1}Adjusted, avoids stack too deep errors
            uint balance0Adjusted = balance0.mul(PERCENTAGE_PRECISION).sub(amount0In.mul(fee));
            uint balance1Adjusted = balance1.mul(PERCENTAGE_PRECISION);
            require(
                balance0Adjusted.mul(balance1Adjusted) >= uint(_reserve0).mul(_reserve1).mul(PERCENTAGE_PRECISION ** 2),
                'Seacows: K'
            );
        }

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In.div(COMPLEMENT_PRECISION), tokenAmountOut, idsOut.length, to);
    }

    // force balances to match reserves
    function skim(address to, uint256[] memory ids) external nonReentrant {
        address _token = token; // gas savings
        address _collection = collection; // gas savings
        (uint balance0, uint balance1) = getComplementedBalance(_token, _collection);
        require(
            balance1.sub(reserve1).div(COMPLEMENT_PRECISION) == ids.length,
            'SeacowsERC721TradePair: SKIM_QUANTITY_UNMATCH'
        );

        IERC20Metadata(_token).transfer(to, balance0.sub(reserve0));
        for (uint i = 0; i < ids.length; i++) {
            IERC721Metadata(_collection).safeTransferFrom(address(this), to, ids[i]);
        }
    }

    function sync() external nonReentrant {
        (uint balance0, uint balance1) = getComplementedBalance(collection, token);
        _update(balance0, balance1, reserve0, reserve1);
    }

    function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, 'SeacowsERC721TradePair: OVERFLOW');
        uint32 blockTimestamp = uint32(block.timestamp % 2 ** 32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast += uint(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
            price1CumulativeLast += uint(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
        }
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }

    function _mint(uint256 toTokenId, uint _liquidity) private {
        ISeacowsPositionManager(positionManager()).mintValue(toTokenId, _liquidity);
    }

    function _burn(uint256 fromTokenId, uint _liquidity) private {
        ISeacowsPositionManager(positionManager()).burnValue(fromTokenId, _liquidity);
    }
}
