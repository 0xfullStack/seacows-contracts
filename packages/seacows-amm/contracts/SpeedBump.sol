// SPDX-License-Identifier: MIT
// Author: Rashad Haddad @rashadalh
// NOTE: the following has NOT been tested or audited, and is for demonstration purposes only
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SpeedBump is ReentrancyGuard {
    struct Withdrawal {
        address user;
        uint256 amount;
        uint256 blockNumber;
    }

    // Mapping from token ID to Withdrawal struct
    mapping(uint256 => Withdrawal) public nftWithdrawals;

    // Mapping from user address to Withdrawal struct for Ether
    mapping(address => Withdrawal) public etherWithdrawals;

    ERC721 public positionManager;

    constructor(address _positionManager) {
        positionManager = ERC721(_positionManager);
    }
    
    // Modifier to check if the call is being made from the positionManager contract
    modifier onlyPositionManager() {
        require(msg.sender == address(positionManager), "Not authorized");
        _;
    }

    function registerNftWithdrawal(uint256 tokenId, address user) external onlyPositionManager {
        // Register the NFT withdrawal
        nftWithdrawals[tokenId] = Withdrawal(user, 1, block.number);
    }

    function withdrawNft(uint256 tokenId) external nonReentrant {
        Withdrawal memory withdrawal = nftWithdrawals[tokenId];

        // Check if the user is entitled to withdraw
        require(withdrawal.user == msg.sender, "Not entitled to withdraw");

        // Check if at least 1 blocks have passed
        require(block.number > withdrawal.blockNumber, "Speed bump - please wait one more block");

        // Reset withdrawal entry
        delete nftWithdrawals[tokenId];

        // Transfer the NFT to the user
        nftContract.safeTransferFrom(address(this), msg.sender, tokenId);
    }

    // Function to deposit ERC20 tokens into the contract
    function depositERC20(address user, address tokenAddress, uint256 amount) external onlyPositionManager nonReentrant {
        require(amount > 0, "No tokens sent");

        // Transfer the tokens from the user to this contract
        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        // Register the ERC20 withdrawal to the user
        erc20Withdrawals[user][tokenAddress] = Withdrawal(user, amount, block.number);
    }

    // Function for the user to withdraw their ERC20 tokens
    function withdrawERC20(address tokenAddress) external nonReentrant {
        Withdrawal memory withdrawal = erc20Withdrawals[msg.sender][tokenAddress];

        // Check if the user has deposited ERC20 tokens
        require(withdrawal.user == msg.sender, "No deposit found");

        // Check if at least 1 blocks have passed
        require(block.number > withdrawal.blockNumber, "Speed bump - please wait one more block");

        // Reset withdrawal entry
        delete erc20Withdrawals[msg.sender][tokenAddress];

        // Transfer the ERC20 tokens to the user
        IERC20 token = IERC20(tokenAddress);
        require(token.transfer(msg.sender, withdraw.amount), "Token transfer failed");
    }
}
