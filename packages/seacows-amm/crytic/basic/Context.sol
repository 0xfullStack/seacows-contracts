// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {WETH} from '../../contracts/test/WETH.sol';
import {MockERC20} from '../../contracts/test/MockERC20.sol';
import {MockERC721} from '../../contracts/test/MockERC721.sol';
import {MockRoyaltyRegistry} from '../../contracts/test/MockRoyaltyRegistry.sol';
import {SpeedBump} from '../../contracts/base/SpeedBump.sol';
import {SeacowsPositionManager} from '../../contracts/SeacowsPositionManager.sol';
import {SeacowsERC721TradePair} from '../../contracts/SeacowsERC721TradePair.sol';
import {ISeacowsERC721TradePair} from '../../contracts/interfaces/ISeacowsERC721TradePair.sol';

contract Context {
    SeacowsPositionManager public manager;
    SeacowsERC721TradePair public template;
    WETH public weth;
    SpeedBump public speedBump;
    MockRoyaltyRegistry public registry;

    // users
    address public owner;
    address public alice;
    address public bob;

    MockERC20 token;
    MockERC721 collection;
    address public pair;
    
    constructor() payable {
        // Deploy contracts
        weth = new WETH();
        template = new SeacowsERC721TradePair();
        registry = new MockRoyaltyRegistry(address(0));
        speedBump = new SpeedBump();
        manager = new SeacowsPositionManager(address(template), address(weth), address(speedBump));

        // Initialize
        manager.setRoyaltyRegistry(address(registry));
        speedBump.initialize(address(manager));

        // Deploy mock contracts
        collection = new MockERC721();
        token = new MockERC20();

        manager.createPair(address(token), address(collection), template.ONE_PERCENT());
        pair = manager.getPair(address(token), address(collection), template.ONE_PERCENT());
    }

    function _mintTokens(address to, uint tokenAmount, uint nftAmount) internal {
        token.mint(to, tokenAmount);
        for (uint256 i; i < nftAmount; ++i) {
            collection.mint(to);
        }
    }

    function _between(uint value, uint low, uint high) internal pure returns (uint) {
        return (low + (value % (high - low + 1)));
    }

    // function doAddLiquidity(uint256 tokenDesired, uint256[] calldata idsDesired) external {
    //     uint256 fee = 0;
    //     uint256 tokenMin = tokenDesired / 2;
    //     uint256 toTokenId = 1;
    //     uint256 deadline = block.timestamp + 15 minutes;

    //     erc20.approve(address(manager), tokenDesired);
    //     manager.addLiquidity(
    //         address(erc20),
    //         address(erc721),
    //         fee,
    //         tokenDesired,
    //         idsDesired,
    //         tokenMin,
    //         toTokenId,
    //         deadline
    //     );
    // }

    // function doAddLiquidityETH(uint256[] calldata idsDesired) external payable {
    //     uint256 fee = 0;
    //     uint256 tokenMin = tokenDesired / 2;
    //     uint256 toTokenId = 1;
    //     uint256 deadline = block.timestamp + 15 minutes;

    //     manager.addLiquidityETH(
    //         address(erc721),
    //         fee,
    //         idsDesired,
    //         tokenMin,
    //         toTokenId,
    //         deadline
    //     );
    // }

    // function doRemoveLiquidity(uint256 liquidity, uint256 fromTokenId) public {
    //     uint256 fee = 0;
    //     SeacowsPositionManager.RemoveLiquidityConstraint memory constraint;
    //     uint256 deadline = block.timestamp + 15 minutes;

    //     constraint.constraintType = 0;
    //     constraint.value = 0;

    //     manager.removeLiquidity(token, collection, fee, liquidity, constraint, fromTokenId, address(this), deadline);
    // }

    // function doRemoveLiquidityETH(uint256 liquidity, uint256 fromTokenId) public {
    //     uint256 fee = 0;
    //     SeacowsPositionManager.RemoveLiquidityConstraint memory constraint;
    //     uint256 deadline = block.timestamp + 15 minutes;

    //     constraint.constraintType = 0;
    //     constraint.value = 0;

    //     manager.removeLiquidityETH(collection, fee, liquidity, constraint, fromTokenId, address(this), deadline);
    // }

    // function doMint(uint256 tokenDesired, uint256[] calldata idsDesired) public {
    //     uint256 fee = 0;
    //     uint256 tokenMin = tokenDesired / 2;
    //     uint256 deadline = block.timestamp + 15 minutes;

    //     erc20.approve(address(manager), tokenDesired);
    //     manager.mint(token, collection, fee, tokenDesired, idsDesired, tokenMin, deadline);
    // }

    // function doMintWithETH(uint256[] calldata idsDesired, uint256 tokenMin) public payable {
    //     uint256 fee = 0;
    //     uint256 deadline = block.timestamp + 15 minutes;

    //     manager.mintWithETH{value: msg.value}(collection, fee, idsDesired, tokenMin, deadline);
    // }
}

