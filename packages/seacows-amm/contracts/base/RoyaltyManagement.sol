// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/interfaces/IERC2981.sol';
import {IRoyaltyManagement} from '../interfaces/IRoyaltyManagement.sol';
import {IRoyaltyRegistry} from '../interfaces/IRoyaltyRegistry.sol';
import {SeacowsPairMetadata} from './SeacowsPairMetadata.sol';

contract RoyaltyManagement is SeacowsPairMetadata, IRoyaltyManagement {
    uint256 public minRoyaltyFeePercent;

    modifier onlyRoyaltyFeeManager() {
        require(msg.sender == royaltyFeeManager(), 'RoyaltyManagement: FORBIDDEN');
        _;
    }

    function royaltyRegistry() public view returns (address) {
        return positionManager().royaltyRegistry();
    }

    function isRoyaltySupported() public view returns (bool) {
        if (royaltyRegistry() != address(0)) {
            address lookupAddress = IRoyaltyRegistry(royaltyRegistry()).getRoyaltyLookupAddress(collection);
            return IERC2981(lookupAddress).supportsInterface(type(IERC2981).interfaceId);
        } else {
            return false;
        }
    }

    function getRoyaltyRecipient(uint256 _tokenId) public view returns (address recipient) {
        if (royaltyRegistry() != address(0)) {
            // get royalty lookup address from the shared royalty registry
            address lookupAddress = IRoyaltyRegistry(royaltyRegistry()).getRoyaltyLookupAddress(collection);

            // calculates royalty payments for ERC2981 compatible lookup addresses
            if (IERC2981(lookupAddress).supportsInterface(type(IERC2981).interfaceId)) {
                // queries the default royalty (or specific for this router)
                (recipient, ) = IERC2981(lookupAddress).royaltyInfo(_tokenId, 0);
            }
        }
    }

    function royaltyFeeManager() public view returns (address) {
        return positionManager().royaltyFeeManager();
    }

    function setMinRoyaltyFeePercent(uint256 _percent) public onlyRoyaltyFeeManager {
        minRoyaltyFeePercent = _percent;
    }
}
