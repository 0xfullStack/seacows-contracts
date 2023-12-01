// SPDX-License-Identifier: MIT
pragma solidity =0.8.13;

interface ISeacowsPairMetadata {
    function token() external view returns (address);

    function collection() external view returns (address);

    /* solhint-disable func-name-mixedcase */
    function PERCENTAGE_PRECISION() external view returns (uint64);

    function ONE_PERCENT() external view returns (uint64);

    function POINT_FIVE_PERCENT() external view returns (uint64);

    function MAX_PROTOCOL_FEE_PERCENT() external view returns (uint64);

    /* solhint-enable func-name-mixedcase */

    function totalSupply() external view returns (uint256);

    function balanceOf(uint256 _tokenId) external view returns (uint256);

    function ownerOf(uint256 _tokenId) external view returns (address);
}
