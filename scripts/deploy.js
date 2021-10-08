const { ethers, network } = require("hardhat");

async function deploy_lottery() {
  const Lottery = await ethers.getContractFactory("Lottery");

  const { priceFeedAddress, vrfCoordinator, linkToken, fee, keyhash } =
    network.config;

  const lottery = await Lottery.deploy(
    priceFeedAddress,
    vrfCoordinator,
    linkToken,
    fee,
    keyhash
  );

  return lottery;
}

async function main() {
  const lottery = await deploy_lottery();
  console.log("Lottery address:", lottery.address);
  console.log("entrance: ", (await lottery.getEntranceFee()).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
