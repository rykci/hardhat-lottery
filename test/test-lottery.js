const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");

let linkToken;
let vrfMock;

async function getAddresses(isDevelopment) {
  if (isDevelopment) {
    return await getMockAddresses();
  } else {
    return {
      priceFeedAddress: network.config.priceFeedAddress,
      vrfCoordinator: network.config.vrfCoordinator,
      linkToken: network.config.linkToken,
      fee: network.config.fee,
      keyhash: network.config.keyhash,
    };
  }
}

async function getMockAddresses() {
  const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
  const LinkToken = await ethers.getContractFactory("LinkToken");
  const VRFCoordinatorMock = await ethers.getContractFactory(
    "VRFCoordinatorMock"
  );
  const mocks = await deployMocks({
    MockV3Aggregator,
    LinkToken,
    VRFCoordinatorMock,
  });
  return {
    priceFeedAddress: mocks.mockV3Aggregator.address,
    vrfCoordinator: mocks.vrfMock.address,
    linkToken: mocks.linkToken.address,
    fee: network.config.fee,
    keyhash: network.config.keyhash,
  };
}

async function deployMocks(
  contracts,
  decimals = 8,
  initialValue = 3600 * 10 ** 8
) {
  const mockV3Aggregator = await contracts.MockV3Aggregator.deploy(
    decimals,
    initialValue
  );
  linkToken = await contracts.LinkToken.deploy();
  vrfMock = await contracts.VRFCoordinatorMock.deploy(linkToken.address);

  return { mockV3Aggregator, linkToken, vrfMock };
}

async function fund_with_link(
  contract_address,
  link_token,
  amount = "100000000000000000"
) {
  // 0.1 LINK
  tx = await link_token.transfer(contract_address, amount);
  return tx;
}

describe("Lottery Tests", async () => {
  let Lottery;
  let lottery;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  before(async function () {
    addresses = await getAddresses(true);
    Lottery = await ethers.getContractFactory("Lottery");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    lottery = await Lottery.deploy(
      addresses.priceFeedAddress,
      addresses.vrfCoordinator,
      addresses.linkToken,
      addresses.fee,
      addresses.keyhash
    );
  });

  it("Should return entrance fee of $50", async () => {
    const entranceFee = await lottery.getEntranceFee();
    expect(entranceFee.toString()).to.equal("13888888888888888");
  });

  it("Attenpt to enter a closed lottery", async () => {
    const entranceFee = await lottery.getEntranceFee();
    await expect(lottery.enter({ value: entranceFee })).to.be.revertedWith(
      "Lottery is not open"
    );
  });

  it("Can start and enter lottery", async () => {
    const entranceFee = await lottery.getEntranceFee();
    await lottery.startLottery();
    await lottery.enter({ value: entranceFee });
    expect(await lottery.players(0)).is.equal(owner.address);
  });

  it("Can end and pick the correct winner", async () => {
    const entranceFee = await lottery.getEntranceFee();

    await fund_with_link(lottery.address, linkToken);
    await lottery.enter({ value: entranceFee });
    await lottery.connect(addr1).enter({ value: entranceFee });
    await lottery.connect(addr2).enter({ value: entranceFee });
    const addr1Balance = await ethers.provider.getBalance(addr1.address);
    const lotteryBalance = await ethers.provider.getBalance(lottery.address);

    const tx = await lottery.endLottery();

    const events = await (await tx.wait()).events;
    const requestId = await (
      await events.find((ev) => ev.event)
    ).args.requestId;
    const STATIC_RNG = 1234;
    await vrfMock.callBackWithRandomness(
      requestId,
      STATIC_RNG,
      lottery.address
    );

    // 1234 % 4 = 2
    expect(await lottery.recentWinner()).to.equal(addr1.address);
    expect(await ethers.provider.getBalance(lottery.address)).to.equal(0);
    expect(await ethers.provider.getBalance(addr1.address)).to.equal(
      addr1Balance.add(lotteryBalance)
    );
  });
});
