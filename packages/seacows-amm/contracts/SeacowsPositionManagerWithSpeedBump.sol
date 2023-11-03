// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./SeacowsPositionManager.sol";
import "./SpeedBump.sol";

contract SeacowsPositionManagerWithSpeedBump is SeacowsPositionManager {
    SpeedBump public speedBump;

    constructor(address template_, address _WETH, address _speedBump) SeacowsPositionManager(template_, _WETH) {
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
        returns (uint cTokenOut, uint cNftOut, uint tokenOut, uint[] memory idsOut)
    {
        (cTokenOut, cNftOut, tokenOut, idsOut) = super.removeLiquidity(
            token,
            collection,
            fee,
            liquidity,
            constraint,
            fromTokenId,
            address(speedBump),  // transfers to speedBump
            deadline
        );
        
        speedBump.batchRegisterNFTs(collection, idsOut, to);
        speedBump.registerToken(token, tokenOut, to);

        return (cTokenOut, cNftOut, tokenOut, idsOut);
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
        returns (uint cTokenOut, uint cNftOut, uint tokenOut, uint[] memory idsOut)
    {
        (cTokenOut, cNftOut, tokenOut, idsOut) = removeLiquidity(
            WETH,
            collection,
            fee,
            liquidity,
            constraint,
            fromTokenId,
            address(speedBump),
            deadline
        );

        speedBump.batchRegisterNFTs(collection, idsOut, to);
        speedBump.registerToken(WETH, tokenOut, to);

        return (cTokenOut, cNftOut, tokenOut, idsOut);
    }
}

// IERC721(collection).approve(address(speedBump), idsOut[i]);
// IERC20(WETH).approve(address(speedBump), tokenOut);