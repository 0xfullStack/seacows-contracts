// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

contract SeacowsErrors {

    /**
     * SeacowsPositionManager Errors
     */
    error SPM_INVALID_TOKEN_ID();

    error SPM_UNAUTHORIZED();

    error SPM_EXPIRED();

    error SPM_PAIR_NOT_EXIST();

    error SPM_ONLY_PAIR_CAN_MINT();

    error SPM_ONLY_PAIR_CAN_BURN();
    
    error SPM_INSUFFICIENT_AMOUNT();

    error SPM_INSUFFICIENT_LIQUIDITY();

    error SPM_ETH_TRANSFER_FAILED();

    error SPM_BELOW_TOKEN_OUT_MIN_CONSTRAINT();

    error SPM_BELOW_NFT_OUT_MIN_CONSTRAINT();

    error SPM_ONLY_BURNABLE_WHEN_CLEARED();

    /**
     * SeacowsERC721TradePair Errors
     */

    error STP_INVALID_FEE();

    error STP_INSUFFICIENT_LIQUIDITY_MINTED();

    error STP_INSUFFICIENT_LIQUIDITY_BURNED();

    error STP_INSUFFICIENT_NFT_TO_WITHDRAW();

    error STP_EXCEED_NFT_OUT_MAX();

    error STP_INSUFFICIENT_OUTPUT_AMOUNT();
    error STP_INSUFFICIENT_INPUT_AMOUNT();

    error STP_INVALID_TO();

    error STP_INSUFFICIENT_LIQUIDITY();

    error STP_UNAUTHORIZED();

    error STP_FEE_OUT_OF_RANGE();

    error STP_SKIM_QUANTITY_MISMATCH();

    error STP_OVERFLOW();
}