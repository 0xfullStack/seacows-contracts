// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { ISeacowsComplement } from "../interfaces/ISeacowsComplement.sol";

// contract SeacowsComplement is IFeeManagement {
contract SeacowsComplement is ISeacowsComplement {
    using SafeMath for uint;
    using SafeMath for uint256;

    int256 private _tokenComplement;
    uint256 private _nftComplement;

    uint public override constant COMPLEMENT_PRECISION = 10**18;

    constructor() {}

    function tokenComplement() public view returns (int256) {
        return _tokenComplement;
    }

    function nftComplement() public view returns (uint256) {
        return _nftComplement;
    }

    function getComplemenetedAssetsOut(uint256 _tokenAmountOut, uint256 _nftAmountOut) public view returns (uint256 tokenAmountOut, uint256 nftAmountOut, int256 tokenComplementAdjusted, uint256 nftComplementAdjusted) {
        uint256 _spot = _tokenAmountOut.div(_nftAmountOut);
        uint256 _complementedNftAmountOut = _nftComplement + _nftAmountOut;

        if (_complementedNftAmountOut >= COMPLEMENT_PRECISION ) {
            // Wipe out all the decimals and get the integer amount of NFT out
            nftAmountOut = uint256((_complementedNftAmountOut).div(COMPLEMENT_PRECISION).mul(COMPLEMENT_PRECISION));
            nftComplementAdjusted = _complementedNftAmountOut - nftAmountOut;

            if (nftAmountOut >= _nftAmountOut) {
                uint __tokenComplement = (nftAmountOut - _nftAmountOut).mul(_spot);
                tokenAmountOut = uint256(_tokenAmountOut - __tokenComplement);
                tokenComplementAdjusted = _tokenComplement + int256(__tokenComplement);
            } else {
                uint __tokenComplement = (_nftAmountOut - nftAmountOut).mul(_spot);
                tokenAmountOut = uint256(_tokenAmountOut + __tokenComplement);
                tokenComplementAdjusted = _tokenComplement - int256(__tokenComplement);
            }
        } else {
            nftComplementAdjusted = _nftComplement + _nftAmountOut;
            nftAmountOut = 0;

            uint256 __tokenComplement = uint256(_nftAmountOut.mul(_spot));
            tokenAmountOut = uint256(_tokenAmountOut + __tokenComplement);
            tokenComplementAdjusted = _tokenComplement - int256(__tokenComplement);
        }
    }

    function _getComplementedBalance(address _token, address _collection) internal view returns (uint256 balance0, uint256 balance1) {
        balance0 = uint256(int256(IERC20(_token).balanceOf(address(this))) - _tokenComplement);
        balance1 = uint256(IERC721(_collection).balanceOf(address(this)).mul(COMPLEMENT_PRECISION)) - _nftComplement;
    }

    // Expect _nftAmountOut = NFT quantity output * precision
    function _updateComplement(uint256 _tokenAmountOut, uint256 _nftAmountOut) internal returns (uint256 tokenAmountOut, uint256 nftAmountOut) {
        (tokenAmountOut, nftAmountOut, _tokenComplement, _nftComplement) = getComplemenetedAssetsOut(_tokenAmountOut, _nftAmountOut);
    }
}
