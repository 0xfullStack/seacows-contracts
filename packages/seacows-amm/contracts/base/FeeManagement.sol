// SPDX-License-Identifier: BUSL-1.1
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

    function _onlyManager() internal view {
        if (msg.sender != feeManager()) {
            revert FM_NON_FEE_MANAGER();
        }
    }

    function _onlyRoyaltyFeeManager() internal view {
        if (msg.sender != royaltyFeeManager()) {
            revert FM_NON_ROYALTY_FEE_MANAGER();
        }
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

    function setFeeTo(address _to) public {
        _onlyManager();
        _feeTo = _to;
    }

    function setFeeManager(address _to) public {
        _onlyManager();
        _feeManager = _to;
    }

    function setRoyaltyFeeManager(address _to) public {
        _onlyRoyaltyFeeManager();
        _royaltyFeeManager = _to;
    }

    function setRoyaltyRegistry(address _to) public {
        _onlyRoyaltyFeeManager();
        _royaltyRegistry = _to;
    }
}
