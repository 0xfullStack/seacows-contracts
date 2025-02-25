// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import './FixidityLib.sol';

library PricingKernel {
    using FixidityLib for int256;

    /**
     * @notice computes the partial compensation when N has a fractional part
     * @param X0: the initial amount of token X (ERC-20)
     * @param Y0: the initial amount of token Y (ERC-721)
     * @param E: the amount of token X (ERC-20) to be withdrawn
     * @param N: the amount of token Y (ERC-721) to be withdrawn
     * @return : the amount of token X should compensating
     */
    function partialCompensation(int256 X0, int256 Y0, int256 E, int256 N) public pure returns (int256) {
        require(E >= 0, 'PricingKernel: E must be non-negative.');
        require(N >= 0, 'PricingKernel: N must be non-negative.');

        int256 ONE = 1000000000000000000000000;
        int256 Nwhole = _floor(N);

        if (N > Nwhole) {
            require(Y0 != 0, 'PricingKernel: Division by zero.');

            int256 X1 = X0.subtract(E);
            int256 Y1 = Y0.subtract(N); // theorhetic
            int256 Y2 = Y0.subtract(Nwhole); // real

            require(Y1 != 0 && Y2 != 0, 'PricingKernel: Division by zero.');

            int256 K1 = X1.multiply(Y1);
            int256 K2 = X1.multiply(Y2);

            int256 oneOverY0 = ONE.divide(Y0);
            int256 part1 = oneOverY0.subtract(ONE.divide(Y1));
            int256 part2 = oneOverY0.subtract(ONE.divide(Y2));

            int256 numerator = (K2.multiply(part2)).subtract(K1.multiply(part1));
            int256 denominator = ONE.add(Y2.multiply(part2));

            return numerator.divide(denominator);
        } else {
            return 0;
        }
    }

    /**
     * @notice computes the partial compensated, when N has a fractional part
     * @param X0: the initial amount of token X (ERC-20)
     * @param Y0: the initial amount of token Y (ERC-721)
     * @param E: the amount of token X (ERC-20) to be withdrawn
     * @param N: the amount of token Y (ERC-721) to be withdrawn
     * @param DIGITS: caller used digits
     * @return : the compensated amount of token X and token Y
     */
    function partialCompensated(
        uint256 X0,
        uint256 Y0,
        uint256 E,
        uint256 N,
        uint8 DIGITS
    ) public pure returns (uint256, uint256) {
        require(N >= 0, 'PricingKernel: N must be non-negative.');

        (int256 _X0, int256 _Y0, int256 _E, int256 _N) = convertFromCallerDigitsToLibDigits(X0, Y0, E, N, DIGITS);
        int256 Nwhole = _floor(_N);
        if (_N > Nwhole) {
            int256 compensation = partialCompensation(_X0, _Y0, _E, _N);
            return convertFromLibDigitsToCallerDigits(_E + compensation, Nwhole, DIGITS);
        } else {
            return (E, N);
        }
    }

    /**
     * @notice Converts numerical values from the caller's precision to the library's precision.
     * @dev For instance, if the library uses a precision of 24 (as in the case of pricing-kernel),
     * and the caller uses a precision of 18 (as in the case of seacows), this function is responsible
     * for converting values from 18-digit precision to 24-digit precision.
     * @param X0: The initial amount of token X (ERC-20)
     * @param Y0: The initial amount of token Y (ERC-721)
     * @param E: The amount of token X (ERC-20) to be withdrawn
     * @param N: The amount of token Y (ERC-721) to be withdrawn
     * @param DIGITS: The precision used by the caller
     * @return : The values converted to the library's precision
     */
    function convertFromCallerDigitsToLibDigits(
        uint256 X0,
        uint256 Y0,
        uint256 E,
        uint256 N,
        uint8 DIGITS
    ) internal pure returns (int256, int256, int256, int256) {
        return (
            int256(X0).newFixed(DIGITS),
            int256(Y0).newFixed(DIGITS),
            int256(E).newFixed(DIGITS),
            int256(N).newFixed(DIGITS)
        );
    }

    /**
     * @notice Converts numerical values from the library's precision to the caller's precision.
     * @dev For example: seacows uses a precision of 18, while pricing-kernel uses a precision of 24.
     * This function converts values from 24-digit precision (library's precision) to 18-digit precision (caller's precision).
     * @param compensatedE: The amount of token X (ERC-20) to be withdrawn, including the compensated part, in library's precision.
     * @param compensatedN: The amount of token Y (ERC-721) to be withdrawn, including the compensated part, in library's precision.
     * @param DIGITS: The precision used by the caller (to which the conversion is targeted).
     * @return : The values converted to the caller's precision.
     */
    function convertFromLibDigitsToCallerDigits(
        int256 compensatedE,
        int256 compensatedN,
        uint8 DIGITS
    ) internal pure returns (uint256, uint256) {
        return (uint256(compensatedE.fromFixed(DIGITS)), uint256(compensatedN.fromFixed(DIGITS)));
    }

    /**
     * @notice returns the integer part of a number
     * @param a: the number to floor
     */
    function _floor(int256 a) internal pure returns (int256) {
        return FixidityLib.integer(a);
    }
}
