// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import "./basic/Context.sol";

contract SeacowsPositionManagerTest is Context {

    constructor() payable {
        // _mintTokens(address(this), 1000, 100);
    }

    function echidna_sum_of_individual_position_liquidity_equal_to_total_pair_liquidity() public view returns (bool) {

        // get pair slot in manager
        uint256 slot = manager.slotOfPair(pair);

        // get total supply of this pair
        uint256 totalSupply = manager.totalSupply(); 

        // get total liquidities of this pair
        uint256 totalLiquidityOfPair = manager.totalValueSupplyOf(slot);
        
        // sum of individual liquidity positions 
        uint256 sumOfIndividualLiquidityPositions;
        for (uint256 i = 0; i < totalSupply; i++) {
            // individual liquidity positions 
            uint256 tokenId = manager.tokenByIndex(i);
            uint256 individualLiquidityPosition = manager.balanceOf(tokenId);

            sumOfIndividualLiquidityPositions += individualLiquidityPosition;
        }

        return sumOfIndividualLiquidityPositions == totalLiquidityOfPair;
    }
}


// function testProvideLiquidity(uint tokenAmount, uint nftAmount) public {
//         // Preconditions:
//         tokenAmount = _between(tokenAmount, 1000, uint(-1));
//         nftAmount = _between(nftAmount, 1000, uint(-1));

//         if (!completed) {
//             _mintTokens(tokenAmount, nftAmount);
//         }

//         uint lpTokenBalanceBefore = pair.balanceOf(address(user));
//         (uint reserve0Before, uint reserve1Before,) = pair.getReserves(); 
//         uint kBefore = reserve0Before * reserve1Before;

//         (bool success1,) = user.proxy(address(token), abi.encodeWithSelector(token.transfer.selector, address(pair)), tokenAmount);
//         // (bool success2,) = user.proxy(address(collection), abi.encodeWithSelector(collection.transfer.selector, address(pair)), nftAmount);

//         require(success1, success2);

//         // Action:
//         (bool success3,) = user.proxy(address(pair), abi.encodeWithSelector(bytes4(keccak256("mint(address)"))), address(user));

//         // Postcondition:
//         if(success3) {
//             uint lpTokenBalanceAfter = pair.balance0f(address(user));
//             (uint reserve0After, uint reserve1After,) = pair.getReserves();
//             uint kAfter = reserve0After * reserve1After;
//             assert(lpTokenBalanceAfter < lpTokenBalanceAfter);
//             assert(kBefore < kAfter);
//         }
//     }