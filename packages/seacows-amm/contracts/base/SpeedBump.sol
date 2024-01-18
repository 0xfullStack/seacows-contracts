// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {ReentrancyGuardUpgradeable} from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import {ERC721Holder} from '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import {SeacowsErrors} from './SeacowsErrors.sol';

contract SpeedBump is ReentrancyGuardUpgradeable, ERC721Holder, SeacowsErrors {
    using SafeERC20 for IERC20;

    event RegisterETH(address indexed owner, uint256 amount);
    event RegisterToken(address indexed owner, address indexed token, uint256 amount);
    event RegisterNFTs(address indexed owner, address indexed collection, uint256[] tokenIds);

    event WithdrawETH(address indexed sender, uint256 amount);
    event WithdrawToken(address indexed sender, address indexed token, uint256 amount);
    event WithdrawNFTs(address indexed sender, address indexed collection, uint256[] tokenIds);

    struct ETH {
        uint256 blockNumber;
        uint256 amount;
    }

    struct Token {
        uint256 blockNumber;
        uint256 amount;
    }

    struct NFT {
        uint256 blockNumber;
        address owner;
    }

    // owner address => ETH
    mapping(address => ETH) public eths;

    // token address => owner address => Token
    mapping(address => mapping(address => Token)) public tokens;

    // collection address => nft id => NFT
    mapping(address => mapping(uint256 => NFT)) public collections;

    address public positionManager;

    function initialize(address _positionManager) public initializer {
        positionManager = _positionManager;
    }

    function batchRegisterNFTs(
        address collection,
        uint256[] memory tokenIds,
        address owner
    ) public onlyPositionManager nonReentrant {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            collections[collection][tokenIds[i]] = NFT(block.number, owner);
        }
        emit RegisterNFTs(owner, collection, tokenIds);
    }

    function batchWithdrawNFTs(address collection, uint256[] memory tokenIds) public nonReentrant {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            NFT memory nft = collections[collection][tokenId];
            if (nft.owner != msg.sender) {
                revert SSB_UNAUTHORIZED();
            }
            if (nft.blockNumber >= block.number) {
                revert SSB_ONE_MORE_BLOCK_AT_LEAST();
            }
            delete collections[collection][tokenId];
            IERC721(collection).safeTransferFrom(address(this), msg.sender, tokenId);
        }
        emit WithdrawNFTs(msg.sender, collection, tokenIds);
    }

    function registerToken(address token, uint256 amount, address owner) public onlyPositionManager nonReentrant {
        if (amount <= 0) {
            revert SSB_INSUFFICIENT_AMOUNT();
        }
        uint256 existedAmount = tokens[token][owner].amount;
        tokens[token][owner] = Token(block.number, existedAmount + amount); // overlap with latest block number
        emit RegisterToken(owner, token, amount);
    }

    function withdrawToken(address token) public nonReentrant {
        Token memory _token = tokens[token][msg.sender];
        if (_token.blockNumber >= block.number) {
            revert SSB_ONE_MORE_BLOCK_AT_LEAST();
        }
        if (_token.amount <= 0) {
            revert SSB_INSUFFICIENT_AMOUNT();
        }
        delete tokens[token][msg.sender];
        IERC20(token).safeTransfer(msg.sender, _token.amount);
        emit WithdrawToken(msg.sender, token, _token.amount);
    }

    function registerETH(uint256 amount, address owner) public onlyPositionManager nonReentrant {
        if (amount <= 0) {
            revert SSB_INSUFFICIENT_AMOUNT();
        }
        uint256 existedAmount = eths[owner].amount;
        eths[owner] = ETH(block.number, existedAmount + amount); // overlap with latest block number
        emit RegisterETH(owner, amount);
    }

    function withdrawETH() public nonReentrant {
        ETH memory eth = eths[msg.sender];
        if (eth.blockNumber >= block.number) {
            revert SSB_ONE_MORE_BLOCK_AT_LEAST();
        }
        if (eth.amount <= 0) {
            revert SSB_INSUFFICIENT_AMOUNT();
        }
        delete eths[msg.sender];
        (bool success, ) = msg.sender.call{value: eth.amount}(new bytes(0));
        if (success == false) {
            revert SSB_ETH_TRANSFER_FAILED();
        }
        emit WithdrawETH(msg.sender, eth.amount);
    }

    modifier onlyPositionManager() {
        if (address(positionManager) != msg.sender) {
            revert SSB_UNAUTHORIZED();
        }
        _;
    }

    receive() external payable {}
}
