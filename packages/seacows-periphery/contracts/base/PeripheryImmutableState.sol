// SPDX-License-Identifier: MIT
pragma solidity =0.8.13;

import {IPeripheryImmutableState} from '../interfaces/IPeripheryImmutableState.sol';

contract PeripheryImmutableState is IPeripheryImmutableState {
    /* solhint-disable immutable-vars-naming */
    address public immutable weth;
    address public immutable manager;

    /* solhint-enable immutable-vars-naming */

    constructor(address _manager, address _weth) {
        manager = _manager;
        weth = _weth;
    }
}
