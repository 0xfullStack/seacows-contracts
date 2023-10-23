// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import {ISeacowsSwapCallback} from '@yolominds/seacows-periphery/contracts/interfaces/ISeacowsSwapCallback.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {ERC3525Upgradeable} from '@solvprotocol/erc-3525/ERC3525Upgradeable.sol';
import {ISeacowsERC721TradePair} from './interfaces/ISeacowsERC721TradePair.sol';
import {ISeacowsERC721TradePairFactory} from './interfaces/ISeacowsERC721TradePairFactory.sol';
import {ISeacowsPositionManager} from './interfaces/ISeacowsPositionManager.sol';
import './base/SeacowsComplement.sol';
import './base/SeacowsPairMetadata.sol';
import './base/SeacowsRewarder.sol';
import './base/RoyaltyManagement.sol';

contract SeacowsERC721TradePair is
    ReentrancyGuardUpgradeable,
    SeacowsComplement,
    SeacowsPairMetadata,
    SeacowsRewarder,
    RoyaltyManagement,
    ISeacowsERC721TradePair
{
    uint256 public feePercent;
    uint256 public protocolFeePercent;

    // Token reserve
    uint256 private reserve0;

    // NFT reserve
    uint256 private reserve1;

    uint32 private blockTimestampLast;

    uint public price0CumulativeLast;
    uint public price1CumulativeLast;

    function initialize(address token_, address collection_, uint256 fee_) public initializer {
        require(fee_ == ONE_PERCENT || fee_ == POINT_FIVE_PERCENT, 'Invalid _fee');

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

    function getReserves() public view returns (uint256 _reserve0, uint256 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(IERC165, SeacowsPairMetadata) returns (bool) {
        return super.supportsInterface(interfaceId) || type(ISeacowsERC721TradePair).interfaceId == interfaceId;
    }

    function minTotalFeePercent() public view returns (uint256) {
        address _feeTo = positionManager().feeTo();
        return (_feeTo != address(0) ? feePercent : 0) + protocolFeePercent + minRoyaltyFeePercent;
    }

    // this low-level function should be called from a contract which performs important safety checks
    function mint(uint256 toTokenId) public nonReentrant returns (uint liquidity) {
        (uint256 _reserve0, uint256 _reserve1, ) = getReserves(); // gas savings
        (uint balance0, uint balance1) = getComplementedBalance();
        uint256 amount0 = uint256(balance0 - _reserve0);
        uint256 amount1 = uint256(balance1 - _reserve1);

        uint _totalSupply = totalSupply(); // gas savings, must be defined here since totalSupply can update in _mintFee
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0 * amount1);
        } else {
            liquidity = Math.min((amount0 * _totalSupply) / _reserve0, (amount1 * _totalSupply) / _reserve1);
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
        IERC20(token).transfer(to, tokenOut);

        {
            // scope to avoid stack too deep errors
            idsOut = new uint[](nftAmountOut);
            uint count = 0;
            uint i = 0;
            while (count < nftAmountOut && i < _ids.length) {
                if (IERC721(collection).ownerOf(_ids[i]) == address(this)) {
                    IERC721(collection).safeTransferFrom(address(this), to, _ids[i]);
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
            (uint256 _reserve0, uint256 _reserve1, ) = getReserves();
            _update(balance0, balance1, _reserve0, _reserve1);
        }
        emit Burn(msg.sender, cTokenOut, cNftOut, tokenIn, tokenOut, idsOut, to);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function swap(uint tokenAmountOut, uint[] memory idsOut, address to, bytes calldata data) external nonReentrant {
        require(tokenAmountOut > 0 || idsOut.length > 0, 'SeacowsERC721TradePair: INSUFFICIENT_OUTPUT_AMOUNT');

        uint absAmountIn;
        uint absAmountOut;
        uint[] memory idsIn;
        {
            // scope avoids stack too deep errors
            (uint256 _reserve0, uint256 _reserve1, ) = getReserves(); // gas savings
            require(
                tokenAmountOut < _reserve0 && idsOut.length * COMPLEMENT_PRECISION < _reserve1,
                'SeacowsERC721TradePair INSUFFICIENT_LIQUIDITY'
            );
            uint tokenAmountIn;
            (tokenAmountIn, idsIn) = ISeacowsSwapCallback(msg.sender).seacowsSwapCallback(data);
            require(tokenAmountIn > 0 || idsIn.length > 0, 'SeacowsERC721TradePair: INSUFFICIENT_INPUT_AMOUNT');

            require(to != token && to != collection, 'SeacowsERC721TradePair: INVALID_TO');
            if (tokenAmountOut > 0) IERC20(token).transfer(to, tokenAmountOut); // optimistically transfer tokens
            if (idsOut.length > 0) {
                for (uint i = 0; i < idsOut.length; i++) {
                    IERC721(collection).safeTransferFrom(address(this), to, idsOut[i]); // optimistically transfer tokens
                }
            }

            {
                // scope avoids stack too deep errors
                (uint balance0, uint balance1) = getComplementedBalance();
                uint _totalFees = ((balance0 * balance1 - _reserve0 * _reserve1) * SCALE_FACTOR) / balance1;

                absAmountIn = balance0 > reserve0 ? (balance0 - reserve0) * SCALE_FACTOR - _totalFees : 0;
                absAmountOut = reserve0 > balance0 ? (reserve0 - balance0) * SCALE_FACTOR + _totalFees : 0;
                {
                    // scope avoids stack too deep errors
                    uint absAmount = Math.max(absAmountIn, absAmountOut);

                    require(
                        (absAmount * minTotalFeePercent()) / PERCENTAGE_PRECISION <= _totalFees,
                        'SeacowsERC721TradePair: INSUFFICIENT_MIN_FEE'
                    );

                    _totalFees -= _handleProtocolFee(absAmount);
                    _totalFees -= _handleSwapFee(absAmount);
                }
                _handleRoyaltyFee(_totalFees, idsIn, idsOut);

                (balance0, balance1) = getComplementedBalance();
                require(balance0 * balance1 >= _reserve0 * _reserve1, 'SeacowsERC721TradePair K');
                _update(balance0, balance1, _reserve0, _reserve1);
            }
        }
        emit Swap(
            msg.sender,
            absAmountIn / SCALE_FACTOR,
            idsIn.length * COMPLEMENT_PRECISION,
            absAmountOut / SCALE_FACTOR,
            idsOut.length * COMPLEMENT_PRECISION,
            to
        );
    }

    function setProtocolFeePercent(uint256 _protocolFee) public {
        require(positionManager().feeManager() == msg.sender, 'SeacowsERC721TradePair: UNAUTHORIZED');
        require(_protocolFee <= MAX_PROTOCOL_FEE_PERCENT, 'SeacowsERC721TradePair: FEE_OUT_OF_RANGE');
        protocolFeePercent = _protocolFee;
    }

    // force balances to match reserves
    function skim(address to, uint256[] memory ids) external nonReentrant {
        (uint balance0, uint balance1) = getComplementedBalance();
        require(
            balance1 - reserve1 == ids.length * COMPLEMENT_PRECISION,
            'SeacowsERC721TradePair: SKIM_QUANTITY_MISMATCH'
        );

        IERC20(token).transfer(to, balance0 / reserve0);
        for (uint i = 0; i < ids.length; i++) {
            IERC721(collection).safeTransferFrom(address(this), to, ids[i]);
        }
    }

    function sync() external nonReentrant {
        (uint balance0, uint balance1) = getComplementedBalance();
        _update(balance0, balance1, reserve0, reserve1);
    }

    function _update(uint balance0, uint balance1, uint256 _reserve0, uint256 _reserve1) private {
        require(balance0 <= type(uint256).max && balance1 <= type(uint256).max, 'SeacowsERC721TradePair: OVERFLOW ');
        uint32 blockTimestamp = uint32(block.timestamp % 2 ** 32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast += (_reserve1 / _reserve0) * timeElapsed;
            price1CumulativeLast += (_reserve0 / _reserve1) * timeElapsed;
        }
        reserve0 = uint256(balance0);
        reserve1 = uint256(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }

    function _mint(uint256 toTokenId, uint _liquidity) private {
        positionManager().mintValue(toTokenId, _liquidity);
    }

    function _burn(uint256 fromTokenId, uint _liquidity) private {
        positionManager().burnValue(fromTokenId, _liquidity);
    }

    function _handleProtocolFee(uint _amount) private returns (uint protocolFee) {
        address _feeTo = positionManager().feeTo();
        protocolFee = (_amount * protocolFeePercent) / PERCENTAGE_PRECISION;
        if (_feeTo != address(0)) {
            IERC20(token).transfer(_feeTo, protocolFee / SCALE_FACTOR);
        }
    }

    function _handleSwapFee(uint _amount) private returns (uint swapFee) {
        swapFee = (_amount * feePercent) / PERCENTAGE_PRECISION;
        feeBalance = feeBalance + swapFee / SCALE_FACTOR;
    }

    function _handleRoyaltyFee(uint _amount, uint[] memory idsIn, uint[] memory idsOut) private {
        if (_amount != 0 && isRoyaltySupported()) {
            uint feePerToken = (_amount / (idsOut.length + idsIn.length)) / SCALE_FACTOR;
            for (uint i = 0; i < idsOut.length; i++) {
                IERC20(token).transfer(getRoyaltyRecipient(idsOut[i]), feePerToken);
            }
            for (uint i = 0; i < idsIn.length; i++) {
                IERC20(token).transfer(getRoyaltyRecipient(idsIn[i]), feePerToken);
            }
        }
    }
}
