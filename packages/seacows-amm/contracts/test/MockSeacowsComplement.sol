// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import { SeacowsComplement } from "../base/SeacowsComplement.sol";

// contract SeacowsComplement is IFeeManagement {
contract MockSeacowsComplement is SeacowsComplement {
    constructor() SeacowsComplement() {}

    function updateComplement(uint256 _amount0Out, uint256 _amount1Out) public returns (uint256 amount0Out, uint256 amount1Out) {
        (amount0Out, amount1Out) = _updateComplement(_amount0Out, _amount1Out);
    }
}
