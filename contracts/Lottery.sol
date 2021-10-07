// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract Lottery {
    address payable[] public players;
    uint256 public usdEntryFee;
    AggregatorV3Interface internal ethUsdPriceFeed;
    address _KOVAN = 0x9326BFA02ADD2366b30bacB125260Af641031331;

    constructor() public {
        usdEntryFee = 50 * 10**18;
        ethUsdPriceFeed = AggregatorV3Interface(_KOVAN);
    }

    function enter() public {
        players.push(payable(msg.sender));
    }

    function getEntranceFee() public view returns (uint256) {
        (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
        uint256 adjustedPrice = uint256(price) * 10**10;
        uint256 entranceFeeInWei = (usdEntryFee * 10**18) / adjustedPrice;
        console.log("The Entrance Fee in Wei is %s", entranceFeeInWei);
        return entranceFeeInWei;
    }

    function startLottery() public {}

    function endLottery() public {}
}
