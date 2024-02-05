// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;
import {SeacowsPositionManager} from '../contracts/SeacowsPositionManager.sol';
// import "./basic.sol";

contract MyContract {

    // SpeedBump: 0x43  WETH: 0x44  SeacowsERC721TradePair: 0x45
    SeacowsPositionManager public manager = new SeacowsPositionManager(address(0x45), address(0x44), address(0x43));

    // SpeedBump(payable(address(0x43))).initialize(address(manager));
        // manager.setRoyaltyRegistry(royaltyRegistry);

    function echidna_ddd() public pure {
        assert(1>0);
    }
}


