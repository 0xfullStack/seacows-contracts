// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {PricingKernel} from '../contracts/lib/PricingKernel.sol';

contract TestPricingKernel {

    uint8 public constant COMPLEMENT_PRECISION_DIGITS = 18;
    uint256 _tokenBalance = 0;
    uint256 _nftBalance = 0;
    uint256 _tokenExpectedOut;
    uint256 _nftExpectedOut;

    function echidna_ddddd() public view returns (bool){

        uint256 _tokenActualOut;
        uint256 _nftActualOut;
        try PricingKernel.partialCompensated(
            _tokenBalance,
            _nftBalance,
            _tokenExpectedOut,
            _nftExpectedOut,
            COMPLEMENT_PRECISION_DIGITS
        ) returns (uint256 tokenActualOut, uint256 nftActualOut) {
            _tokenActualOut = tokenActualOut;
            _nftActualOut = nftActualOut;
        } catch {
            // assert(true);
        }
        return _tokenActualOut > 0 && _nftActualOut >= 0;
    }

    function setValue(uint256 _value) public {
        // require(_value > 0 && _value < );
        _tokenBalance = _value;
        _nftBalance = _value;
    }

    // function doRemoveLiquidity(uint256 _amount) public {
    //     _tokenBalance -= _amount;
    //     _nftBalance -= _amount;
    // }
}