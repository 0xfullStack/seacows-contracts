// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;
import {ReentrancyGuardUpgradeable} from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {IERC165} from '@openzeppelin/contracts/utils/introspection/IERC165.sol';
import {ISeacowsSwapCallback} from '@yolominds/seacows-periphery/contracts/interfaces/ISeacowsSwapCallback.sol';
import {ISeacowsERC721TradePair} from './interfaces/ISeacowsERC721TradePair.sol';
import {ISeacowsPositionManager} from './interfaces/ISeacowsPositionManager.sol';
import {SeacowsComplement} from './base/SeacowsComplement.sol';
import {SeacowsPairMetadata} from './base/SeacowsPairMetadata.sol';
import {SeacowsRewarder} from './base/SeacowsRewarder.sol';
import {RoyaltyManagement} from './base/RoyaltyManagement.sol';

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

    uint256 private reserve0;
    uint256 private reserve1;

    uint32 private blockTimestampLast;
    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;

    function initialize(address token_, address collection_, uint256 fee_) public initializer {
        if (fee_ != ONE_PERCENT && fee_ != POINT_FIVE_PERCENT) {
            revert STP_INVALID_FEE();
        }
        feePercent = fee_;
        protocolFeePercent = 3; // Initially, 0.3%
        __SeacowsPairMetadata_init(msg.sender, token_, collection_);
        __ReentrancyGuard_init();
    }

    function getComplementedBalance() public view returns (uint256 tokenBalance, uint256 nftBalance) {
        tokenBalance = uint256(int256(IERC20(token).balanceOf(address(this)))) - feeBalance;
        nftBalance = IERC721(collection).balanceOf(address(this)) * COMPLEMENT_PRECISION;
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

    function mint(uint256 toTokenId) public whenNotPaused nonReentrant returns (uint256 liquidity) {
        (uint256 _reserve0, uint256 _reserve1, ) = getReserves();
        (uint256 balance0, uint256 balance1) = getComplementedBalance();
        uint256 amount0 = uint256(balance0 - _reserve0);
        uint256 amount1 = uint256(balance1 - _reserve1);

        uint256 _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0 * amount1);
        } else {
            liquidity = Math.min((amount0 * _totalSupply) / _reserve0, (amount1 * _totalSupply) / _reserve1);
        }
        if (liquidity <= 0) {
            revert STP_INSUFFICIENT_LIQUIDITY_MINTED();
        }
        _mint(toTokenId, liquidity);
        _update(balance0, balance1, _reserve0, _reserve1);
        emit Mint(msg.sender, amount0, amount1);
    }

    function burn(
        address from,
        address to,
        uint256[] memory _ids
    )
        public
        whenNotPaused
        nonReentrant
        returns (uint256 cTokenOut, uint256 cNftOut, uint256 tokenOut, uint256[] memory idsOut)
    {
        from;
        (uint256 balance0, uint256 balance1) = getComplementedBalance();

        ISeacowsPositionManager manager = positionManager();

        uint256 nftAmountOut;
        {
            uint256 liquidity = manager.balanceOf(manager.tokenOf(address(this)));
            cTokenOut = (liquidity * balance0) / totalSupply();
            cNftOut = (liquidity * balance1) / totalSupply();
            if (cTokenOut <= 0 || cNftOut <= 0) {
                revert STP_INSUFFICIENT_LIQUIDITY_BURNED();
            }

            uint256 nftOut;
            (tokenOut, nftOut) = _caculateAssetsOutAfterComplemented(balance0, balance1, cTokenOut, cNftOut);
            _burn(manager.tokenOf(address(this)), liquidity);
            nftAmountOut = nftOut / COMPLEMENT_PRECISION;

            if (tokenOut > IERC20(token).balanceOf(address(this))) {
                tokenOut = IERC20(token).balanceOf(address(this));
            }
        }
        if (_ids.length < nftAmountOut) {
            revert STP_EXCEED_NFT_OUT_MAX();
        }
        IERC20(token).transfer(to, tokenOut);

        {
            idsOut = new uint256[](nftAmountOut);
            uint256 count = 0;
            uint256 i = 0;
            while (count < nftAmountOut && i < _ids.length) {
                if (IERC721(collection).ownerOf(_ids[i]) == address(this)) {
                    IERC721(collection).safeTransferFrom(address(this), to, _ids[i]);
                    idsOut[count] = _ids[i];
                    count++;
                }
                i++;
            }
            if (count != nftAmountOut) {
                revert STP_INSUFFICIENT_NFT_TO_WITHDRAW();
            }
        }

        (balance0, balance1) = getComplementedBalance();

        {
            (uint256 _reserve0, uint256 _reserve1, ) = getReserves();
            _update(balance0, balance1, _reserve0, _reserve1);
        }
        emit Burn(msg.sender, cTokenOut, cNftOut, tokenOut, idsOut, to);
    }

    function swap(
        uint256 tokenAmountOut,
        uint256[] memory idsOut,
        address to,
        bytes calldata data
    ) external whenNotPaused nonReentrant {
        if (tokenAmountOut <= 0 && idsOut.length <= 0) {
            revert STP_INSUFFICIENT_OUTPUT_AMOUNT();
        }

        uint256 absAmountIn;
        uint256 absAmountOut;
        uint256[] memory idsIn;
        {
            (uint256 _reserve0, uint256 _reserve1, ) = getReserves();
            if (tokenAmountOut >= _reserve0 || idsOut.length * COMPLEMENT_PRECISION >= _reserve1) {
                revert STP_INSUFFICIENT_LIQUIDITY();
            }
            uint256 tokenAmountIn;
            (tokenAmountIn, idsIn) = ISeacowsSwapCallback(msg.sender).seacowsSwapCallback(data);

            if (tokenAmountIn <= 0 && idsIn.length <= 0) {
                revert STP_INSUFFICIENT_INPUT_AMOUNT();
            }
            if (to == token || to == collection) {
                revert STP_INVALID_TO();
            }
            if (tokenAmountOut > 0) IERC20(token).transfer(to, tokenAmountOut);
            if (idsOut.length > 0) {
                for (uint256 i = 0; i < idsOut.length; i++) {
                    IERC721(collection).safeTransferFrom(address(this), to, idsOut[i]);
                }
            }

            {
                (uint256 balance0, uint256 balance1) = getComplementedBalance();

                uint256 _totalFees = (balance0 * balance1 - _reserve0 * _reserve1);
                absAmountIn = balance0 > reserve0 ? (balance0 - reserve0) * balance1 - _totalFees : 0; //
                absAmountOut = reserve0 > balance0 ? (reserve0 - balance0) * balance1 + _totalFees : 0;

                {
                    uint256 absAmount = Math.max(absAmountIn, absAmountOut);
                    if ((absAmount * minTotalFeePercent()) > (_totalFees * PERCENTAGE_PRECISION)) {
                        revert STP_INSUFFICIENT_MIN_FEE();
                    }

                    // delay division to here to fix loss of precision
                    _totalFees /= balance1;
                    absAmountIn /= balance1;
                    absAmountOut /= balance1;
                    absAmount = Math.max(absAmountIn, absAmountOut);

                    _totalFees -= _handleProtocolFee(absAmount);
                    _totalFees -= _handleSwapFee(absAmount);
                }
                _handleRoyaltyFee(_totalFees, idsIn, idsOut);

                (balance0, balance1) = getComplementedBalance();
                if (balance0 * balance1 < _reserve0 * _reserve1) {
                    revert STP_K();
                }
                _update(balance0, balance1, _reserve0, _reserve1);
            }
        }
        emit Swap(
            msg.sender,
            absAmountIn,
            idsIn.length * COMPLEMENT_PRECISION,
            absAmountOut,
            idsOut.length * COMPLEMENT_PRECISION,
            to
        );
    }

    function setProtocolFeePercent(uint256 _protocolFee) public {
        if (positionManager().feeManager() != msg.sender) {
            revert STP_UNAUTHORIZED();
        }
        if (_protocolFee > MAX_PROTOCOL_FEE_PERCENT) {
            revert STP_FEE_OUT_OF_RANGE();
        }
        protocolFeePercent = _protocolFee;
    }

    function skim(address to, uint256[] memory ids) external nonReentrant {
        (uint256 balance0, uint256 balance1) = getComplementedBalance();
        if (balance1 - reserve1 != ids.length * COMPLEMENT_PRECISION) {
            revert STP_SKIM_QUANTITY_MISMATCH();
        }
        IERC20(token).transfer(to, balance0 - reserve0);
        for (uint256 i = 0; i < ids.length; i++) {
            IERC721(collection).safeTransferFrom(address(this), to, ids[i]);
        }
    }

    function sync() external nonReentrant {
        (uint256 balance0, uint256 balance1) = getComplementedBalance();
        _update(balance0, balance1, reserve0, reserve1);
    }

    function _update(uint256 balance0, uint256 balance1, uint256 _reserve0, uint256 _reserve1) private {
        if (balance0 > type(uint256).max || balance1 > type(uint256).max) {
            revert STP_OVERFLOW();
        }
        uint32 blockTimestamp = uint32(block.timestamp % 2 ** 32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast;
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            price0CumulativeLast += (_reserve1 / _reserve0) * timeElapsed;
            price1CumulativeLast += (_reserve0 / _reserve1) * timeElapsed;
        }
        reserve0 = uint256(balance0);
        reserve1 = uint256(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }

    function _mint(uint256 toTokenId, uint256 _liquidity) private {
        positionManager().mintValue(toTokenId, _liquidity);
    }

    function _burn(uint256 fromTokenId, uint256 _liquidity) private {
        positionManager().burnValue(fromTokenId, _liquidity);
    }

    function _handleProtocolFee(uint256 _amount) private returns (uint256 protocolFee) {
        address _feeTo = positionManager().feeTo();
        protocolFee = (_amount * protocolFeePercent) / PERCENTAGE_PRECISION;
        if (_feeTo != address(0)) {
            IERC20(token).transfer(_feeTo, protocolFee);
        }
    }

    function _handleSwapFee(uint256 _amount) private returns (uint256 swapFee) {
        swapFee = (_amount * feePercent) / PERCENTAGE_PRECISION;
        feeBalance = feeBalance + swapFee;
    }

    function _handleRoyaltyFee(uint256 _amount, uint256[] memory idsIn, uint256[] memory idsOut) private {
        if (_amount != 0 && isRoyaltySupported()) {
            uint256 feePerToken = _amount / (idsOut.length + idsIn.length);
            for (uint256 i = 0; i < idsOut.length; i++) {
                IERC20(token).transfer(getRoyaltyRecipient(idsOut[i]), feePerToken);
            }
            for (uint256 i = 0; i < idsIn.length; i++) {
                IERC20(token).transfer(getRoyaltyRecipient(idsIn[i]), feePerToken);
            }
        }
    }
}
