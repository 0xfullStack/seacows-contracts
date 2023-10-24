// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import {IERC3525Receiver} from '@solvprotocol/erc-3525/IERC3525Receiver.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';

import {ERC3525} from '@solvprotocol/erc-3525/ERC3525.sol';
import {IERC3525} from '@solvprotocol/erc-3525/IERC3525.sol';
import {ISeacowsERC3525} from '../interfaces/ISeacowsERC3525.sol';
import {ISeacowsPairMetadata} from '../interfaces/ISeacowsPairMetadata.sol';
import {ISeacowsPositionManager} from '../interfaces/ISeacowsPositionManager.sol';

contract SeacowsPairMetadata is ERC165, ERC721Holder, IERC3525Receiver, ISeacowsPairMetadata, Initializable {
    address public collection;
    address public token;

    uint64 public constant PERCENTAGE_PRECISION = 1e4;
    uint64 public constant ONE_PERCENT = 1e2;
    uint64 public constant POINT_FIVE_PERCENT = 50;
    uint64 public constant MAX_PROTOCOL_FEE_PERCENT = 1e3;

    address private _positionManager;

    modifier onlyPositionManager() {
        require(_positionManager == msg.sender, 'SeacowsPairMetadata: ONLY_POSITION_MANAGER');
        _;
    }

    function __SeacowsPairMetadata_init(
        address positionManager_,
        address token_,
        address collection_
    ) internal onlyInitializing {
        token = token_;
        collection = collection_;
        _positionManager = positionManager_;
    }

    function positionManager() public view returns (ISeacowsPositionManager) {
        return ISeacowsPositionManager(_positionManager);
    }

    function balanceOf(uint _tokenId) public view returns (uint256) {
        return positionManager().balanceOf(_tokenId);
    }

    function ownerOf(uint _tokenId) public view returns (address) {
        return positionManager().ownerOf(_tokenId);
    }

    function slot() public view returns (uint256) {
        return positionManager().slotOfPair(address(this));
    }

    function totalSupply() public view override returns (uint256) {
        return positionManager().totalValueSupplyOf(slot());
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return
            super.supportsInterface(interfaceId) ||
            interfaceId == type(IERC721Receiver).interfaceId ||
            interfaceId == type(IERC3525Receiver).interfaceId;
    }

    function onERC3525Received(
        address _operator,
        uint256 _fromTokenId,
        uint256 _toTokenId,
        uint256 _value,
        bytes calldata _data
    ) external pure returns (bytes4) {
        return IERC3525Receiver.onERC3525Received.selector;
    }
}
