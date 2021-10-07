const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Entrance Fee", async () => {
  it("Should return entrance fee of $50", async () => {
    const [owner] = await ethers.getSigners();
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(
      0x9326bfa02add2366b30bacb125260af641031331
    );
    expect(await lottery.getEntranceFee()).to.be.greaterThan(12000000000000000);
  });
});
