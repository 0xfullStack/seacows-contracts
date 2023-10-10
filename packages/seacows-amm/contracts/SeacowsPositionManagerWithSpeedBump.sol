// SPDX-License-Identifier: MIT
// Author: Rashad Haddad @rashadalh
// NOTE: the following has NOT been tested or audited, and is for demonstration purposes only
pragma solidity ^0.8.0;

import "./SeacowsPositionManager.sol";
import "./SpeedBump.sol";

contract SeacowsPositionManagerWithSpeedBump is SeacowsPositionManager {
    SpeedBump public speedBump;

    constructor(address _speedBump) {
        speedBump = SpeedBump(_speedBump);
    }

    function removeLiquidity(
        address token,
        address collection,
        uint256 fee,
        uint liquidity,
        RemoveLiquidityConstraint memory constraint,
        uint256 fromTokenId,
        address to,  // owner of the NFTs, the user
        uint deadline
    )
        public
        override
        checkDeadline(deadline)
        returns (uint cTokenOut, uint cNftOut, uint tokenIn, uint tokenOut, uint[] memory idsOut)
    {
        // Call the original removeLiquidity function
        (cTokenOut, cNftOut, tokenIn, tokenOut, idsOut) = super.removeLiquidity(
            token,
            collection,
            fee,
            liquidity,
            constraint,
            fromTokenId,
            speedBump,  // transfers NFTS to speedBump
            deadline
        );

        // Register NFTs withdrawal in SpeedBump contract
        for (uint i = 0; i < idsOut.length; i++) {
            IERC721(collection).approve(address(speedBump), idsOut[i]);
            speedBump.registerNftWithdrawal(idsOut[i], to);
        }

        return (cTokenOut, cNftOut, tokenIn, tokenOut, idsOut);
    }

    function removeLiquidityETH(
        address collection,
        uint256 fee,
        uint liquidity,
        RemoveLiquidityConstraint memory constraint,
        uint256 fromTokenId,
        address to,  // owner of the NFTs, the user
        uint deadline
    )
        public
        override
        returns (uint cTokenOut, uint cNftOut, uint tokenIn, uint tokenOut, uint[] memory idsOut)
    {
        // Call the overridden removeLiquidity function
        (cTokenOut, cNftOut, tokenIn, tokenOut, idsOut) = removeLiquidity(
            WETH,
            collection,
            fee,
            liquidity,
            constraint,
            fromTokenId,
            speedBump,
            deadline
        );

        // Transfer WETH to SpeedBump and register the deposit
        IERC20(WETH).approve(address(speedBump), tokenOut);
        speedBump.depositERC20(WETH, tokenOut);

        return (cTokenOut, cNftOut, tokenIn, tokenOut, idsOut);
    }
}