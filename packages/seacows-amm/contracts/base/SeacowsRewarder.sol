// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.13;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {ISeacowsRewarder} from '../interfaces/ISeacowsRewarder.sol';
import {SeacowsPairMetadata} from './SeacowsPairMetadata.sol';

contract SeacowsRewarder is ISeacowsRewarder, SeacowsPairMetadata {
    uint256 public accRewardPerShare;

    uint256 public feeBalance;
    uint256 public lastFeeBalance;

    // Position NFT ID => PositionInfo
    mapping(uint256 => PositionInfo) public positionInfos;

    uint256 public constant ACC_REWARD_PER_SHARE_PRECISION = 1e4;

    struct PositionInfo {
        uint256 feeDebt;
        uint256 unclaimedFee;
    }

    function getPendingFee(uint256 _tokenId) public view virtual returns (uint256) {
        PositionInfo storage _info = positionInfos[_tokenId];

        uint256 _accRewardTokenPerShare = accRewardPerShare;
        if (feeBalance != lastFeeBalance) {
            _accRewardTokenPerShare += ((feeBalance - lastFeeBalance) * ACC_REWARD_PER_SHARE_PRECISION) / totalSupply();
        }
        return
            _info.unclaimedFee +
            (balanceOf(_tokenId) * _accRewardTokenPerShare) /
            ACC_REWARD_PER_SHARE_PRECISION -
            _info.feeDebt;
    }

    function updateSwapFee() public {
        uint256 _totalLiquidity = totalSupply();

        // Any swap fee accured
        if (feeBalance == lastFeeBalance || _totalLiquidity == 0) {
            return;
        }

        accRewardPerShare += ((feeBalance - lastFeeBalance) * ACC_REWARD_PER_SHARE_PRECISION) / _totalLiquidity;
        lastFeeBalance = feeBalance;
    }

    function updatePositionFee(uint256 tokenId) public onlyPositionManager {
        PositionInfo storage info = positionInfos[tokenId];
        uint256 liquidity = balanceOf(tokenId);

        if (liquidity != 0) {
            uint256 _pending = (liquidity * accRewardPerShare) / ACC_REWARD_PER_SHARE_PRECISION - info.feeDebt;
            if (_pending != 0) {
                info.unclaimedFee += _pending;
            }
        }
    }

    function updatePositionFeeDebt(uint256 tokenId) public onlyPositionManager {
        PositionInfo storage info = positionInfos[tokenId];
        uint256 liquidity = balanceOf(tokenId);
        info.feeDebt = (liquidity * accRewardPerShare) / ACC_REWARD_PER_SHARE_PRECISION;
    }

    /**
    @notice Collect Swap fee for Position NFT
    @param _tokenId The Position NFT ID contract address
   */
    function collect(uint256 _tokenId) public returns (uint256 _fee) {
        updateSwapFee();
        uint256 _feeAmount = getPendingFee(_tokenId);
        positionInfos[_tokenId].unclaimedFee = 0;

        PositionInfo storage _info = positionInfos[_tokenId];

        _info.feeDebt = (balanceOf(_tokenId) * accRewardPerShare) / ACC_REWARD_PER_SHARE_PRECISION;

        _fee = _feeAmount > feeBalance ? feeBalance : _feeAmount;
        lastFeeBalance -= _fee;
        feeBalance -= _fee;
        IERC20(token).transfer(ownerOf(_tokenId), _fee);

        emit CollectFee(_tokenId, _fee);
    }
}
