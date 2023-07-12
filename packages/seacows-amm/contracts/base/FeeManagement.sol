// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import { IFeeManagement } from '../interfaces/IFeeManagement.sol';
 
contract FeeManagement is IFeeManagement {

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
    require(msg.sender == feeManager(), 'FeeManagement: NON_FEE_MANAGER');
    _;
  }

  modifier onlyRoyaltyFeeManager() {
    require(msg.sender == feeManager(), 'FeeManagement: NON_ROYALTY_FEE_MANAGER');
    _;
  }

  function feeManager() public view returns (address) {
    return _feeManager;
  }

  function royaltyRegistry() public view returns (address) {
    return _royaltyRegistry;
  }

  function royaltyFeeManager() public view returns (address) {
    return _royaltyFeeManager;
  }

  function feeTo() public view returns (address) {
    return _feeTo;
  }

  function setFeeManager(address _to) public onlyManager {
    _feeManager = _to;
  }

  function setRoyaltyFeeManager(address _to) public onlyRoyaltyFeeManager {
    _feeManager = _to;
  }

  function setRoyaltyRegistry(address _to) public onlyRoyaltyFeeManager {
    _royaltyRegistry = _to;
  }

  function setFeeTo(address _to) public onlyManager {
    _feeTo = _to;
  }
}
