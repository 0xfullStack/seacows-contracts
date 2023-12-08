// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {Pausable} from '@openzeppelin/contracts/security/Pausable.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

contract SeacowsLimitAccessControl is Pausable, Ownable {
    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() public onlyOwner whenPaused {
        _unpause();
    }
}
