// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

// import { ERC3525SlotEnumerable } from "@solvprotocol/erc-3525/ERC3525.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { ERC3525 } from "@solvprotocol/erc-3525/ERC3525.sol";
import { IERC3525 } from "@solvprotocol/erc-3525/IERC3525.sol";
import { ISeacowsERC3525 } from "../interfaces/ISeacowsERC3525.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/// @title The base contract for an NFT/TOKEN AMM pair
/// Inspired by 0xmons; Modified from https://github.com/sudoswap/lssvm
/// @notice This implements the core swap logic from NFT to TOKEN
contract SeacowsERC3525 is ISeacowsERC3525, ERC3525, ERC721Holder {

    // address => slot => tokenId
    // mapping(address => mapping(uint256 => uint256)) private ownerSlotsToken;

    // slot => totalValueSupply
    mapping(uint256 => uint256) private totalValueSupplyInSlot;
    
    constructor(string memory _name, string memory _symbol, uint8 _decimal) ERC3525(_name, _symbol, _decimal) {}
  
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC3525, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId) || interfaceId == type(IERC721Receiver).interfaceId ;
    }

    function totalValueSupplyOf(uint256 _slot) public view virtual returns (uint256) {
        return totalValueSupplyInSlot[_slot];
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
    }


    // function tokenOfOwnerInSlot(address _owner, uint256 _slot) public view virtual returns (uint256) {
    //     return ownerSlotsToken[_owner][_slot];
    // }

    // function transferFrom(
    //     uint256 fromTokenId_,
    //     address to_,
    //     uint256 value_
    // ) public payable virtual override(ERC3525, IERC3525) returns (uint256 toTokenId) {
    //     _spendAllowance(_msgSender(), fromTokenId_, value_);

    //     uint256 slot = slotOf(fromTokenId_);
    //     if (ownerSlotsToken[to_][slot] != 0) {
    //         toTokenId = ownerSlotsToken[to_][slot];
    //     } else {
    //         toTokenId = _createOriginalTokenId();
    //         _mint(to_, toTokenId, slot, 0);
    //     }
        
    //     _transferValue(fromTokenId_, toTokenId, value_);
    // }

    // // Override original function: Not transfer Token but transfer value
    // function _transferTokenId(
    //     address from_,
    //     address to_,
    //     uint256 tokenId_
    // ) internal virtual override {
    //     if (ownerOf(tokenId_) != from_) revert("ERC3525: transfer from invalid owner");
    //     if (to_ == address(0)) revert("ERC3525: transfer to the zero address");

    //     uint256 slot = slotOf(tokenId_);
    //     uint256 value = balanceOf(tokenId_);

    //     // _approve(address(0), tokenId_);
    //     _clearApprovedValues(tokenId_);

    //     uint256 toTokenId;
    //     if (ownerSlotsToken[to_][slot] != 0) {
    //         toTokenId = ownerSlotsToken[to_][slot];
    //     } else {
    //         toTokenId = _createOriginalTokenId();
    //         _mint(to_, toTokenId, slot, 0);
    //     }

    //     _beforeValueTransfer(from_, to_, tokenId_, toTokenId, slot, value);

    //     _transferValue(tokenId_, toTokenId, value);
        
    //     emit Transfer(from_, to_, tokenId_);

    //     _afterValueTransfer(from_, to_, tokenId_, toTokenId, slot, value);
    // }

    // function _mint(address to_, uint256 tokenId_, uint256 slot_, uint256 value_) internal virtual override {
    //     if (ownerSlotsToken[to_][slot_] != 0) revert("SeacowsERC3525: user already has token for slot");
    //     super._mint(to_, tokenId_, slot_, value_);
    //     ownerSlotsToken[to_][slot_] = tokenId_;
    //     totalValueSupplyInSlot[slot_] += value_;
    // }

    // function _burn(uint256 tokenId_) internal virtual override {
    //     _burnValue(tokenId_, balanceOf(tokenId_));
    // }
}
