require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const ALCHEMY_URL =
  "https://eth-kovan.alchemyapi.io/v2/LcL1zj3hTjybTF89-H4EL3kdtZcS5cjt";
const PRIVATE_KEY =
  "f9dbaa7d5af36a36bb992f3bbae3cb73601773440dab0d06636e8d80c2bb88f6";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.6",
  networks: {
    kovan: {
      url: ALCHEMY_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
