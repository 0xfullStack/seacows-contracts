// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import { IRoyaltyRegistry } from '../interfaces/IRoyaltyRegistry.sol';
 
contract RoyaltyManagement {
  IRoyaltyRegistry public royaltyRegistry;


  // function _calculateRoyalties(LSSVMPair pair, uint256 salePrice)
  //   internal
  //   view
  //   returns (address recipient, uint256 royalties)
  // {
  //   // get royalty lookup address from the shared royalty registry
  //   address lookupAddress = ROYALTY_REGISTRY.getRoyaltyLookupAddress(
  //     address(pair.nft())
  //   );

  //   // calculates royalty payments for ERC2981 compatible lookup addresses
  //   if (
  //     IERC2981(lookupAddress).supportsInterface(
  //       type(IERC2981).interfaceId
  //     )
  //   ) {
  //     // queries the default royalty (or specific for this router)
  //     (recipient, royalties) = IERC2981(lookupAddress).royaltyInfo(
  //       FETCH_TOKEN_ID,
  //       salePrice
  //     );

  //     // validate royalty amount
  //     require(salePrice >= royalties, "royalty exceeds sale price");
  //   }
  // }

}
