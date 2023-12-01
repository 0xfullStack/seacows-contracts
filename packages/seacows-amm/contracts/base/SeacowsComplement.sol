// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.13;

import {ISeacowsComplement} from '../interfaces/ISeacowsComplement.sol';
import {PricingKernel} from '../lib/PricingKernel.sol';

contract SeacowsComplement is ISeacowsComplement {
    uint256 public constant COMPLEMENT_PRECISION = 10 ** 18;
    uint8 public constant COMPLEMENT_PRECISION_DIGITS = 18;

    function _caculateAssetsOutAfterComplemented(
        uint256 _tokenBalance,
        uint256 _nftBalance,
        uint256 _tokenExpectedOut,
        uint256 _nftExpectedOut
    ) internal pure returns (uint256, uint256) {
        return
            PricingKernel.partialCompensated(
                _tokenBalance,
                _nftBalance,
                _tokenExpectedOut,
                _nftExpectedOut,
                COMPLEMENT_PRECISION_DIGITS
            );
    }

    function caculateAssetsOutAfterComplemented(
        uint256 _tokenBalance,
        uint256 _nftBalance,
        uint256 _tokenExpectedOut,
        uint256 _nftExpectedOut
    ) external pure returns (uint256, uint256) {
        return _caculateAssetsOutAfterComplemented(_tokenBalance, _nftBalance, _tokenExpectedOut, _nftExpectedOut);
    }
}
