// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { ISeacowsComplement } from "../interfaces/ISeacowsComplement.sol";

// contract SeacowsComplement is IFeeManagement {
contract SeacowsComplement is ISeacowsComplement {
    using SafeMath for uint;
    using SafeMath for uint256;

    int256 internal complement0;
    uint256 internal complement1;

    uint public override constant COMPLEMENT_PRECISION = 10**18;

    constructor() {}

    function getComplementedBalance(address _token, address _collection) public view returns (uint256 balance0, uint256 balance1) {
        balance0 = uint256(int256(IERC20(_collection).balanceOf(address(this))) - complement0);
        balance1 = uint256(IERC721(_token).balanceOf(address(this)).mul(COMPLEMENT_PRECISION)) - complement1;
    }

    // Expect _amount1Out = NFT quantity output * precision
    function _updateComplement(uint256 _amount0Out, uint256 _amount1Out) internal returns (uint256 amount0Out, uint256 amount1Out) {
        uint256 _spot = _amount0Out.div(_amount1Out);
        uint256 _complementedAmount1Out = complement1 + _amount1Out;

        if (_complementedAmount1Out >= COMPLEMENT_PRECISION ) {
            amount1Out = uint256((_complementedAmount1Out).div(COMPLEMENT_PRECISION).mul(COMPLEMENT_PRECISION));
            complement1 = _complementedAmount1Out - amount1Out;

            if (amount1Out >= _amount1Out) {
                amount0Out = uint256(_amount0Out - (amount1Out - _amount1Out).mul(_spot));
                complement0 -= int256(amount1Out);
            } else {
                amount0Out = uint256(_amount0Out + (_amount1Out - amount1Out).mul(_spot));
                complement0 += int256(amount1Out);
            }
        } else {
            complement1 += _amount1Out;
            amount1Out = 0;

            uint256 _complement0 = uint256(_amount1Out.mul(_spot));
            amount0Out = uint256(_amount0Out + _complement0);
            complement0 += int256(_complement0);
        }

    }
}
