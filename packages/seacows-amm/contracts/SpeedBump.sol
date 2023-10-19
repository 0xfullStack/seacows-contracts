// SPDX-License-Identifier: MIT
// Author: Rashad Haddad @rashadalh
// NOTE: the following has NOT been tested or audited, and is for demonstration purposes only
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract SpeedBump is ReentrancyGuardUpgradeable, ERC721Holder {
    struct TokenWithdrawal {
        address token;
        uint256 amount;
        uint256 blockNumber;
    }

    struct NFTWithdrawal {
        uint256 id;
        uint256 blockNumber;
    }

    // User addresss => NFT collection address => Withdrawal
    mapping(address => mapping (address => NFTWithdrawal)) public userCollections;

    // User address => collection address
    mapping(address => address[]) public userToCollections;

    // Token address => User address => Withdrawal
    mapping(address => mapping (address => Withdrawal)) public tokenWithdrawals;

    address public positionManager;

    function initialize(address _positionManager) public initializer {
        positionManager = _positionManager;
    }

    function registerNftWithdrawal(address collection, uint256 tokenId, address user) external onlyPositionManager {
        nftWithdrawals[collection][tokenId] = Withdrawal(user, 1, block.number);
    }

    function withdrawNft(address collection, uint256 tokenId) external nonReentrant {
        Withdrawal memory withdrawal = nftWithdrawals[collection][tokenId];

        require(withdrawal.user == msg.sender, "SpeedBump: INVALID_MSG_SENDER");
        require(withdrawal.amount != 0, "SpeedBump: INVALID_TOKEN_ID");
        require(block.number > withdrawal.blockNumber, "SpeedBump: Please wait one more block");

        delete nftWithdrawals[collection][tokenId];
        IERC721(collection).safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function registerTokenWithdrawal(address token, uint256 amount, address user) external onlyPositionManager nonReentrant {
        require(amount > 0, "SpeedBump: Token amount must be great than zero");
        tokenWithdrawals[token][user] = Withdrawal(user, amount, block.number);
    }

    function withdrawToken(address token) external nonReentrant {
        Withdrawal memory withdrawal = tokenWithdrawals[token][msg.sender];

        require(withdrawal.user == msg.sender, "SpeedBump: INVALID_MSG_SENDER");
        require(block.number > withdrawal.blockNumber, "Speed bump: Please wait one more block");

        delete tokenWithdrawals[token][msg.sender];
        require(IERC20(token).transfer(msg.sender, withdrawal.amount), "Speed bump: Token transfer failed");
    }

    modifier onlyPositionManager() {
        require(msg.sender == address(positionManager), "Speed bump: Not authorized");
        _;
    }

    // User address => ()
    mapping(address => mapping (address => Withdrawal)) public tokens;
    mapping(address => mapping (address => Withdrawal)) public nfts;

    function tokens() external returns(uint) {

    }

    function nfts() external returns(uint) {
        
    }
}
