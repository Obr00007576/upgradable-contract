// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract Counter{
    uint256 private count;

    function initialize(uint256 _count) public{
        count = _count;
    }

    function add() public {
        count = count+1;
    }

    function getCount() view public returns(uint256){
        return count;
    }
}
