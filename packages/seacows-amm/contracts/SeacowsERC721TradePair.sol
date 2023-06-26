// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Strings.sol";
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
import './base/SeacowsRewarder.sol';

contract SeacowsERC721TradePair is
    ReentrancyGuardUpgradeable,
    SeacowsComplement,
    SeacowsPairMetadata,
    SeacowsRewarder,
    ISeacowsERC721TradePair
    // ISeacowsERC721TradePair
{
    using SafeMath for uint112;
    using UQ112x112 for uint224;

    // address private _positionManager;

    uint256 public feePercent;
    uint256 public protocolFeePercent;

    // Token reserve
    uint112 private reserve0;

    // NFT reserve
    uint112 private reserve1;

    uint32 private blockTimestampLast;

    uint public price0CumulativeLast;
    uint public price1CumulativeLast;

    uint public constant PERCENTAGE_PRECISION = 1e4;
    uint public constant ONE_PERCENT = 1e2;
    uint public constant POINT_FIVE_PERCENT = 50;
    uint public constant MAX_PROTOCOL_FEE_PERCENT = 1e3;

    function initialize(address token_, address collection_, uint112 fee_) public initializer {
        require(fee_ == ONE_PERCENT || fee_ == POINT_FIVE_PERCENT, 'Invalid _fee');

        // _positionManager = msg.sender;
        feePercent = fee_;
        protocolFeePercent = 3; // Initially, 0.3% 
        __SeacowsPairMetadata_init(msg.sender, token_, collection_);
        __ReentrancyGuard_init();
    }

    function getComplementedBalance() public view returns (uint256 tokenBalance, uint256 nftBalance) {
        tokenBalance = uint256(int256(IERC20(token).balanceOf(address(this))) + tokenComplement()) - feeBalance;
        nftBalance = uint256(
            int256(IERC721(collection).balanceOf(address(this)) * uint256(COMPLEMENT_PRECISION)) + nftComplement()
        );
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    // this low-level function should be called from a contract which performs important safety checks
    function mint(uint256 toTokenId) public nonReentrant returns (uint liquidity) {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        (uint balance0, uint balance1) = getComplementedBalance();
        uint112 amount0 = uint112(balance0 - _reserve0);
        uint112 amount1 = uint112(balance1 - _reserve1);


        // updateSwapFee(); // Update swapping fee reward

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
    function burn(
        address from,
        address to,
        uint256[] memory _ids
    ) public nonReentrant returns (uint cTokenOut, uint cNftOut, uint tokenIn, uint tokenOut, uint[] memory idsOut) {
        (uint balance0, uint balance1) = getComplementedBalance();

        ISeacowsPositionManager manager = positionManager();

        uint nftAmountOut;
        {
            // scope to avoid stack too deep errors
            uint liquidity = manager.balanceOf(manager.tokenOf(address(this)));
            cTokenOut = (liquidity * balance0) / totalSupply(); // using balances ensures pro-rata distribution
            cNftOut = (liquidity * balance1) / totalSupply(); // using balances ensures pro-rata distribution
            require(cTokenOut > 0 && cNftOut > 0, 'SeacowsERC721TradePair: INSUFFICIENT_LIQUIDITY_BURNED');

            uint nftOut;
            (tokenIn, tokenOut, nftOut) = _updateComplement(cTokenOut, cNftOut);
            _burn(manager.tokenOf(address(this)), liquidity);
            nftAmountOut = nftOut / COMPLEMENT_PRECISION;

            if (tokenOut > IERC20(token).balanceOf(address(this))) {
                tokenOut = IERC20(token).balanceOf(address(this));
            }
        }
        require(_ids.length >= nftAmountOut, 'SeacowsERC721TradePair: EXCEED_NFT_OUT_MAX');
        IERC20Metadata(token).transfer(to, tokenOut);

        {
            // scope to avoid stack too deep errors
            idsOut = new uint[](nftAmountOut);
            uint count = 0;
            uint i = 0;
            while (count < nftAmountOut && i < _ids.length) {
                if (IERC721Metadata(collection).ownerOf(_ids[i]) == address(this)) {
                    IERC721Metadata(collection).safeTransferFrom(address(this), to, _ids[i]);
                    idsOut[count] = _ids[i];
                    count++;
                }
                i++;
            }
            require(count == nftAmountOut, 'SeacowsERC721TradePair: INSUFFICIENT_NFT_TO_WITHDRAW');
        }

        if (tokenIn > 0) {
            manager.seacowsBurnCallback(token, from, tokenIn);
        }

        (balance0, balance1) = getComplementedBalance();

        {
            // scope to avoid stack too deep errors
            (uint112 _reserve0, uint112 _reserve1, ) = getReserves();
            _update(balance0, balance1, _reserve0, _reserve1);
        }
        // updateSwapFee();
        emit Burn(msg.sender, cTokenOut, cNftOut, tokenIn, tokenOut, idsOut, to);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function swap(uint tokenAmountOut, uint[] memory idsOut, address to) external nonReentrant {
        require(tokenAmountOut > 0 || idsOut.length > 0, 'SeacowsERC721TradePair: INSUFFICIENT_OUTPUT_AMOUNT');
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        require(tokenAmountOut < _reserve0 && idsOut.length < _reserve1, 'Seacows: INSUFFICIENT_LIQUIDITY');

        uint balance0;
        uint balance1;
        {
            // scope for _token{0,1}, avoids stack too deep errors
            address _token = token;
            address _collection = collection;
            require(to != _token && to != _collection, 'SeacowsERC721TradePair: INVALID_TO');
            if (tokenAmountOut > 0) IERC20(_token).transfer(to, tokenAmountOut); // optimistically transfer tokens
            if (idsOut.length > 0) {
                for (uint i = 0; i < idsOut.length; i++) {
                    IERC721Metadata(_collection).safeTransferFrom(address(this), to, idsOut[i]); // optimistically transfer tokens
                }
            }
            (balance0, balance1) = getComplementedBalance();
        }
        uint tokenAmountIn = balance0 > _reserve0 - tokenAmountOut ? balance0 - (_reserve0 - tokenAmountOut) : 0;
        uint nftAmountIn = balance1 > _reserve1 - idsOut.length * COMPLEMENT_PRECISION
            ? balance1 - (_reserve1 - idsOut.length * COMPLEMENT_PRECISION)
            : 0;
        require(tokenAmountIn > 0 || nftAmountIn > 0, 'SeacowsERC721TradePair: INSUFFICIENT_INPUT_AMOUNT');
        _handleFee(tokenAmountIn, tokenAmountOut);
        (balance0, balance1) = getComplementedBalance();
        {
            // scope for reserve{0,1}Adjusted, avoids stack too deep errors
            // uint balance0Adjusted = balance0 * PERCENTAGE_PRECISION - tokenAmountIn * feePercent;
            // uint balance0Adjusted = balance0 * PERCENTAGE_PRECISION;
            // uint balance1Adjusted = balance1 * PERCENTAGE_PRECISION;
            // require(
            //     balance0Adjusted * balance1Adjusted >= uint(_reserve0) * _reserve1 * (PERCENTAGE_PRECISION ** 2),
            //     'Seacows: K'
            // );
            require(
                balance0 * balance1 >= uint(_reserve0) * _reserve1,
                string.concat('Seacows: K', ' ', Strings.toString((balance0)), ' ', Strings.toString((balance1)), ' ', Strings.toString((_reserve0)), ' ', Strings.toString((_reserve1)))
            );
        }

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, tokenAmountIn, nftAmountIn, tokenAmountOut, idsOut.length * COMPLEMENT_PRECISION, to);
    }

    function setProtocolFeePercent(uint256 _protocolFee) public {
        require(positionManager().feeManager() == msg.sender, "SeacowsERC721TradePair: UNAUTHORIZED");
        require(_protocolFee <= MAX_PROTOCOL_FEE_PERCENT, "SeacowsERC721TradePair: FEE_OUT_OF_RANGE");
        protocolFeePercent = _protocolFee;
    }

    // force balances to match reserves
    function skim(address to, uint256[] memory ids) external nonReentrant {
        (uint balance0, uint balance1) = getComplementedBalance();
        require(
            (balance1 - reserve1) / COMPLEMENT_PRECISION == ids.length,
            'SeacowsERC721TradePair: SKIM_QUANTITY_UNMATCH'
        );

        IERC20Metadata(token).transfer(to, balance0 / reserve0);
        for (uint i = 0; i < ids.length; i++) {
            IERC721Metadata(collection).safeTransferFrom(address(this), to, ids[i]);
        }
    }

    function sync() external nonReentrant {
        (uint balance0, uint balance1) = getComplementedBalance();
        _update(balance0, balance1, reserve0, reserve1);
    }

    function _handleFee(uint tokenAmountIn, uint tokenAmountOut) private {
        address _feeTo = positionManager().feeTo();
        if (tokenAmountIn > 0) {
            uint tokenInAfterFee;
            if (_feeTo != address(0)) {
                tokenInAfterFee = tokenAmountIn * PERCENTAGE_PRECISION / (PERCENTAGE_PRECISION + protocolFeePercent + feePercent);
                IERC20(token).transfer(_feeTo, tokenInAfterFee * protocolFeePercent / PERCENTAGE_PRECISION);
            }
            feeBalance += tokenInAfterFee * feePercent / PERCENTAGE_PRECISION;
        }
        if (tokenAmountOut > 0) {
            uint tokenOutBeforeFee;
            if (_feeTo != address(0)) {
                tokenOutBeforeFee = tokenAmountOut * PERCENTAGE_PRECISION / (PERCENTAGE_PRECISION - protocolFeePercent - feePercent);
                IERC20(token).transfer(_feeTo, tokenOutBeforeFee * protocolFeePercent / PERCENTAGE_PRECISION);
            } else {
                tokenOutBeforeFee = tokenAmountOut / (PERCENTAGE_PRECISION - feePercent);
            }
            feeBalance += tokenOutBeforeFee * feePercent / PERCENTAGE_PRECISION;
        }
    }

    function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, 'SeacowsERC721TradePair: OVERFLOW ');
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
        positionManager().mintValue(toTokenId, _liquidity);
    }

    function _burn(uint256 fromTokenId, uint _liquidity) private {
        positionManager().burnValue(fromTokenId, _liquidity);
    }
}
