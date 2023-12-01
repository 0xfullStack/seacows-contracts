// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

interface ISeacowsERC721TradePairFactory {
    function template() external view returns (address);

    function getPair(address _collection, address _token, uint256 _fee) external view returns (address);
}
