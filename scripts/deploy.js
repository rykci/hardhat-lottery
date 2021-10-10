const { ContractFactory } = require("@ethersproject/contracts");
const { network } = require("hardhat");

const DECIMALS = 8;
const INITIAL_VALUE = 3600 * 10 ** 8;

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
  decimals = DECIMALS,
  initialValue = INITIAL_VALUE
) {
  const mockV3Aggregator = await contracts.MockV3Aggregator.deploy(
    decimals,
    initialValue
  );
  const linkToken = await contracts.LinkToken.deploy();
  const vrfMock = await contracts.VRFCoordinatorMock.deploy(linkToken.address);

  return { mockV3Aggregator, linkToken, vrfMock };
}

async function main() {
  const isDevelopment = network.name == "hardhat"; // if network is development, we need to deploy mocks
  const addresses = await getAddresses(isDevelopment); // get params for lottery

  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(
    addresses.priceFeedAddress,
    addresses.vrfCoordinator,
    addresses.linkToken,
    addresses.fee,
    addresses.keyhash
  );
  console.log("Lottery address:", lottery.address);
  console.log((await lottery.getEntranceFee()).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
