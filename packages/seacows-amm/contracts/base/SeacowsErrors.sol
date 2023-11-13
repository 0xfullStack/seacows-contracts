// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

contract SeacowsErrors {

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
}