// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import {SeacowsComplement} from '../base/SeacowsComplement.sol';

// contract SeacowsComplement is IFeeManagement {
contract MockSeacowsComplement is SeacowsComplement {
    // To store the tokenAmountOut of last updateComplement
    uint256 public tokenAmountOut;

    // To store the nftAmountOut of last updateComplement
    uint256 public nftAmountOut;

    constructor() SeacowsComplement() {}

    function updateComplement(uint256 _amount0Out, uint256 _amount1Out) public {
        (, tokenAmountOut, nftAmountOut) = _updateComplement(_amount0Out, _amount1Out);
    }

    function complements() public view returns (int256 _tokenComplement, int256 _nftComplement) {
        _tokenComplement = tokenComplement();
        _nftComplement = nftComplement();
    }
}
