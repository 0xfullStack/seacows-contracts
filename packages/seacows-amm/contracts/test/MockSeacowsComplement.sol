// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import { SeacowsComplement } from "../base/SeacowsComplement.sol";

// contract SeacowsComplement is IFeeManagement {
contract MockSeacowsComplement is SeacowsComplement {
    // To store the amount0Out of last updateComplement
    uint256 public amount0Out; 

    // To store the amount1Out of last updateComplement
    uint256 public amount1Out;

    constructor() SeacowsComplement() {}


    function getComplementedBalance(address _token, address _collection) public view returns (uint256 balance0, uint256 balance1) {
        return _getComplementedBalance(_token, _collection);
    }

    function updateComplement(uint256 _amount0Out, uint256 _amount1Out) public {
        (amount0Out, amount1Out) = _updateComplement(_amount0Out, _amount1Out);
    }

    function complements() public view  returns (int256 _complement0, uint256 _complement1) {
        _complement0 = tokenComplement();
        _complement1 = nftComplement();
    }

}
