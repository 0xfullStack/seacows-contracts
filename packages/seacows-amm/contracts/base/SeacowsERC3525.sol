// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.13;

// import { ERC3525SlotEnumerable } from "@solvprotocol/erc-3525/ERC3525.sol";
import {ERC721Holder} from '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import {IERC721Receiver} from '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import {ERC3525} from '@solvprotocol/erc-3525/ERC3525.sol';
import {IERC165} from '@openzeppelin/contracts/utils/introspection/IERC165.sol';
import {ISeacowsERC3525} from '../interfaces/ISeacowsERC3525.sol';
import {ISeacowsERC721TradePair} from '../interfaces/ISeacowsERC721TradePair.sol';

/// @title The base contract for an NFT/TOKEN AMM pair
/// Inspired by 0xmons; Modified from https://github.com/sudoswap/lssvm
/// @notice This implements the core swap logic from NFT to TOKEN
contract SeacowsERC3525 is ISeacowsERC3525, ERC3525, ERC721Holder {
    mapping(address => uint256) public pairSlots;
    mapping(address => uint256) public pairTokenIds;
    mapping(uint256 => address) public slotPairs;

    // slot => totalValueSupply
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
        value_; // slience unused warning
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
}
