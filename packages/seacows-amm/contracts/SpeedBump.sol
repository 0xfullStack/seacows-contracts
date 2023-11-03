// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract SpeedBump is ReentrancyGuardUpgradeable, ERC721Holder {

    event RegisterToken(address indexed owner, address indexed token, uint256 amount);
    event WithdrawToken(address indexed sender, address indexed token, uint256 amount);
    event RegisterNFTs(address indexed owner, address indexed collection, uint256[] tokenIds);
    event WithdrawNFTs(address indexed sender, address indexed collection, uint256[] tokenIds);

    struct Token {
        uint256 blockNumber;
        uint256 amount;
    }

    struct NFT {
        uint256 blockNumber;
        address owner;
    }

    // collection address => nft id => NFT
    mapping(address => mapping (uint256 => NFT)) public collections;

    // token address => owner address => Token
    mapping(address => mapping (address => Token)) public tokens;

    address public positionManager;

    function initialize(address _positionManager) public initializer {
        positionManager = _positionManager;
    }

    function batchRegisterNFTs(address collection, uint256[] memory tokenIds, address owner) public onlyPositionManager nonReentrant {
        for (uint i = 0; i < tokenIds.length; i++) {
            collections[collection][tokenIds[i]] = NFT(block.number, owner);
        }
        emit RegisterNFTs(owner, collection, tokenIds);
    }

    function batchWithdrawNFTs(address collection, uint256[] memory tokenIds) public nonReentrant {
        for (uint i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            NFT memory nft = collections[collection][tokenId];
            require(nft.owner == msg.sender, "SpeedBump: INVALID_MSG_SENDER");
            require(block.number > nft.blockNumber, "SpeedBump: Please wait one more block");
            delete collections[collection][tokenId];
            IERC721(collection).safeTransferFrom(address(this), msg.sender, tokenId);
        }
        emit WithdrawNFTs(msg.sender, collection, tokenIds);
    }

    function registerToken(address token, uint256 amount, address owner) public onlyPositionManager nonReentrant {
        require(amount > 0, "SpeedBump: Token amount must be great than zero");
        uint256 existedAmount = tokens[token][owner].amount;
        tokens[token][owner] = Token(block.number, existedAmount + amount); // overlap with latest block number 
        emit RegisterToken(owner, token, amount);
    }

    function withdrawToken(address token) public nonReentrant {
        Token memory _token = tokens[token][msg.sender];
        require(block.number > _token.blockNumber, "Speed bump: Please wait one more block");
        require(_token.amount > 0, "SpeedBump: Token amount must be great than zero");
        delete tokens[token][msg.sender];
        require(IERC20(token).transfer(msg.sender, _token.amount), "Speed bump: Token transfer failed");
        emit WithdrawToken(msg.sender, token, _token.amount);
    }

    modifier onlyPositionManager() {
        require(msg.sender == address(positionManager), "Speed bump: INVALID_MSG_SENDER");
        _;
    }
}
