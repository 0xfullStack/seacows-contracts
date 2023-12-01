// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.13;

import '../base/SeacowsERC3525.sol';

contract MockSeacowsERC3525 is SeacowsERC3525 {
    constructor() SeacowsERC3525('Mock SeacowsERC3525', 'MSERC3525', 18) {}

    function mint(address _to, uint tokenId, uint slot, uint _value) public {
        _mint(_to, tokenId, slot, _value);
    }

    function mintValue(uint _tokenId, uint _value) public {
        _mintValue(_tokenId, _value);
    }

    function burnValue(uint _tokenId, uint _value) public {
        _burnValue(_tokenId, _value);
    }

    function setSlotPair(uint _slot, address _pair) public {
        pairSlots[_pair] = _slot;
        slotPairs[_slot] = _pair;
        pairTokenIds[_pair] = 0;
    }
}
