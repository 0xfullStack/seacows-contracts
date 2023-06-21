// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import { IFeeManagement } from '../interfaces/IFeeManagement.sol';
 
contract FeeManagement is IFeeManagement {

  address private _feeManager;

  address private _feeTo;

  constructor() {
    _feeManager = msg.sender;
    _feeTo = msg.sender;
  }

  modifier onlyManager() {
    require(msg.sender == feeManager(), 'FeeManagement: FORBIDDEN');
    _;
  }

  function feeManager() public view returns (address) {
    return _feeManager;
  }

  function feeTo() public view returns (address) {
    return _feeTo;
  }

  function setFeeManager(address _to) public onlyManager {
    _feeManager = _to;
  }

  function setFeeTo(address _to) public onlyManager {
    _feeTo = _to;
  }
}
