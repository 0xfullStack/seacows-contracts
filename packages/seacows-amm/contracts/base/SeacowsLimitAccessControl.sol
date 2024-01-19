// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {Pausable} from '@openzeppelin/contracts/security/Pausable.sol';
import {Ownable2Step} from '@openzeppelin/contracts/access/Ownable2Step.sol';

contract SeacowsLimitAccessControl is Pausable, Ownable2Step {
    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() public onlyOwner whenPaused {
        _unpause();
    }
}
