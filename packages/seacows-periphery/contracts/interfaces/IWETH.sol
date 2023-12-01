// SPDX-License-Identifier: MIT
pragma solidity =0.8.13;

interface IWETH {
    function balanceOf(address account) external returns (uint256);

    function allowance(address src, address guy) external returns (uint256);

    function deposit() external payable;

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(address src, address dst, uint256 wad) external returns (bool);

    function approve(address guy, uint256 wad) external returns (bool);

    function withdraw(uint256) external;
}
