// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC721Metadata} from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import {IERC20Metadata} from '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {ERC721Holder} from '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import {IERC721Receiver} from '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import {ERC3525} from '@solvprotocol/erc-3525/ERC3525.sol';
import {IERC165} from '@openzeppelin/contracts/utils/introspection/IERC165.sol';
import {Counters} from '@openzeppelin/contracts/utils/Counters.sol';
import {ISeacowsERC3525} from '../interfaces/ISeacowsERC3525.sol';
import {ISeacowsERC721TradePair} from '../interfaces/ISeacowsERC721TradePair.sol';
import {SeacowsErrors} from './SeacowsErrors.sol';
import {NFTRenderer} from '../lib/NFTRenderer.sol';
import {SeacowsLimitAccessControl} from './SeacowsLimitAccessControl.sol';

contract SeacowsERC3525 is ISeacowsERC3525, SeacowsErrors, ERC3525, ERC721Holder, SeacowsLimitAccessControl {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;

    uint256 public constant PERCENTAGE_PRECISION = 10 ** 4;
    Counters.Counter private _slotGenerator;

    mapping(address => uint256) public pairSlots;
    mapping(address => uint256) public pairTokenIds;
    mapping(uint256 => address) public slotPairs;
    mapping(uint256 => uint256) private totalValueSupplyInSlot;

    constructor(string memory _name, string memory _symbol, uint8 _decimal) ERC3525(_name, _symbol, _decimal) {}

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC3525, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId) || interfaceId == type(IERC721Receiver).interfaceId;
    }

    function totalValueSupplyOf(uint256 _slot) public view virtual returns (uint256) {
        return totalValueSupplyInSlot[_slot];
    }

    function _beforeValueTransfer(
        address from_,
        address to_,
        uint256 fromTokenId_,
        uint256 toTokenId_,
        uint256 slot_,
        uint256 value_
    ) internal override {
        from_;
        to_;
        value_;
        if (slotPairs[slot_] != address(0)) {
            ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(slotPairs[slot_]);
            pair.updateSwapFee();
            // Minting
            if (_exists(fromTokenId_)) {
                pair.updatePositionFee(fromTokenId_);
            }

            // Burning
            if (_exists(toTokenId_)) {
                pair.updatePositionFee(toTokenId_);
            }
        }
    }

    function _afterValueTransfer(
        address from_,
        address to_,
        uint256 fromTokenId_,
        uint256 toTokenId_,
        uint256 slot_,
        uint256 value_
    ) internal override {
        if (from_ == address(0) && fromTokenId_ == 0) {
            totalValueSupplyInSlot[slot_] += value_;
        }

        if (to_ == address(0) && toTokenId_ == 0) {
            totalValueSupplyInSlot[slot_] -= value_;
        }

        if (slotPairs[slot_] != address(0)) {
            ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(slotPairs[slot_]);
            // Minting
            if (_exists(fromTokenId_)) {
                pair.updatePositionFeeDebt(fromTokenId_);
            }

            // Burning
            if (_exists(toTokenId_)) {
                pair.updatePositionFeeDebt(toTokenId_);
            }
        }
    }

    function _checkDeadline(uint256 deadline) internal view {
        if (deadline < block.timestamp) {
            revert SPM_EXPIRED();
        }
    }

    function _checkTokenIdOwner(uint256 tokenId, address sender) internal view {
        if (ownerOf(tokenId) != sender) {
            revert SPM_INVALID_TOKEN_ID();
        }
    }

    function _createSlot(address _pair) internal returns (uint256 newSlot) {
        _slotGenerator.increment();
        newSlot = _slotGenerator.current();
        pairSlots[_pair] = newSlot;
    }

    function _sendETHs(address to, uint256 amount) internal {
        (bool sent, ) = to.call{value: amount}('');
        if (sent == false) {
            revert SPM_ETH_TRANSFER_FAILED();
        }
    }

    function _sendERC20Tokens(address token, address from, address to, uint256 value) internal {
        IERC20(token).safeTransferFrom(from, to, value);
    }

    function _sendERC721Tokens(address collection, address from, address to, uint256[] memory tokenIds) internal {
        for (uint256 i; i < tokenIds.length; ) {
            IERC721(collection).safeTransferFrom(from, to, tokenIds[i]);
            unchecked {
                ++i;
            }
        }
    }

    function _renderTokenMetadata(uint256 tokenId) internal view returns (string memory) {
        uint256 slotId = slotOf(tokenId);
        ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(slotPairs[slotId]);
        string memory tokenSymbol = IERC20Metadata(pair.token()).symbol();
        string memory collectionSymbol = IERC721Metadata(pair.collection()).symbol();
        uint256 fee = pair.feePercent();
        uint256 poolShare = (balanceOf(tokenId) * PERCENTAGE_PRECISION * 100) / totalValueSupplyOf(slotId);

        return
            NFTRenderer.render(
                NFTRenderer.RenderParams({
                    pool: address(pair),
                    id: tokenId,
                    tokenSymbol: tokenSymbol,
                    nftSymbol: collectionSymbol,
                    tokenAddress: pair.token(),
                    nftAddress: pair.collection(),
                    swapFee: fee,
                    poolShare: poolShare,
                    owner: ownerOf(tokenId)
                })
            );
    }
}
