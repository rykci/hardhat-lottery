require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.3",
      },
      {
        version: "0.4.24",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  networks: {
    hardhat: {
      fee: (0.1 * 10 ** 18).toString(),
      keyhash:
        "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
      tags: ["local"],
    },
    development: {
      url: "http://127.0.0.1:8545",
      fee: (0.1 * 10 ** 18).toString(),
      keyhash:
        "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
      tags: ["local"],
    },
    kovan: {
      url: process.env.ALCHEMY_KOVAN_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      priceFeedAddress: "0x9326BFA02ADD2366b30bacB125260Af641031331",
      vrfCoordinator: "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
      linkToken: "0xa36085F69e2889c224210F603D836748e7dC0088",
      fee: (0.1 * 10 ** 18).toString(),
      keyhash:
        "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
      tags: ["staging"],
    },
    rinkeby: {
      url: process.env.ALCHEMY_RINKEBY_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      priceFeedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
      vrfCoordinator: "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B",
      linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
      fee: (0.1 * 10 ** 18).toString(),
      keyhash:
        "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
      tags: ["staging"],
    },
  },
};
