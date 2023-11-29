// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

contract SeacowsErrors {
    /**
     * SeacowsRouter Errors
     */
    error SR_EXPIRED();

    error SR_EXCESSIVE_INPUT_AMOUNT();

    error SR_INSUFFICIENT_OUTPUT_AMOUNT();

    error SR_INVALID_PARAMS_LENGTH();

    error SR_ETH_TRANSFER_FAILED();

    /**
     * SeacowsSwapCallback Errors
     */
    error SSC_NOT_SEACOWS_PAIR();

    error SSC_PAIR_MISMATCH();
}
