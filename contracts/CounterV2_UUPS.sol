// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

// Import this file to use console.log
import "hardhat/console.sol";

contract CounterV2_UUPS is Ownable, UUPSUpgradeable, Initializable{
    uint256 private count;

    function initialize(uint256 _count) public initializer{
        _transferOwnership(msg.sender);
        count = _count;
    }

    function add() public {
        count = count+10;
    }

    function getCount() view public returns(uint256){
        return count;
    }
    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {}
}
