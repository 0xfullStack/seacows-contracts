// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

interface ISeacowsComplement {
    // solhint-disable-next-line func-name-mixedcase
    function COMPLEMENT_PRECISION() external view returns (uint256);

    function caculateAssetsOutAfterComplemented(
        uint256 _tokenBalance,
        uint256 _nftBalance,
        uint256 _tokenExpectedOut,
        uint256 _nftExpectedOut
    ) external pure returns (uint256, uint256);
}
