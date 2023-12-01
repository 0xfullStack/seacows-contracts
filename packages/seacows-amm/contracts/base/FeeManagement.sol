// SPDX-License-Identifier: AGPL-3.0
pragma solidity =0.8.13;

import {SeacowsErrors} from './SeacowsErrors.sol';
import {IFeeManagement} from '../interfaces/IFeeManagement.sol';

contract FeeManagement is SeacowsErrors, IFeeManagement {
    address private _royaltyRegistry;
    address private _feeManager;
    address private _royaltyFeeManager;
    address private _feeTo;

    constructor() {
        _feeManager = msg.sender;
        _royaltyFeeManager = msg.sender;
        _feeTo = msg.sender;
    }

    modifier onlyManager() {
        if (msg.sender != feeManager()) {
            revert FM_NON_FEE_MANAGER();
        }
        _;
    }

    modifier onlyRoyaltyFeeManager() {
        if (msg.sender != royaltyFeeManager()) {
            revert FM_NON_ROYALTY_FEE_MANAGER();
        }
        _;
    }

    function feeTo() public view returns (address) {
        return _feeTo;
    }

    function feeManager() public view returns (address) {
        return _feeManager;
    }

    function royaltyFeeManager() public view returns (address) {
        return _royaltyFeeManager;
    }

    function royaltyRegistry() public view returns (address) {
        return _royaltyRegistry;
    }

    function setFeeTo(address _to) public onlyManager {
        _feeTo = _to;
    }

    function setFeeManager(address _to) public onlyManager {
        _feeManager = _to;
    }

    function setRoyaltyFeeManager(address _to) public onlyRoyaltyFeeManager {
        _royaltyFeeManager = _to;
    }

    function setRoyaltyRegistry(address _to) public onlyRoyaltyFeeManager {
        _royaltyRegistry = _to;
    }
}
