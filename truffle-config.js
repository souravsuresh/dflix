require("babel-register");
require("babel-polyfill");
require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    matic: {
      provider: () =>
        new HDWalletProvider(
          process.env.REACT_APP_MNEMONIC,
          process.env.REACT_APP_INFURA_MATIC
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 6000000,
      gasPrice: 10000000000,
    },
    mainnet: {
      provider: function () {
        return new HDWalletProvider(
          process.env.REACT_APP_MNEMONIC,
          process.env.REACT_APP_INFURA_MAINNET
        );
      },
      network_id: 1,
      // gas: 6000000,
      // gasPrice: 10000000000,
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          process.env.REACT_APP_MNEMONIC,
          process.env.REACT_APP_INFURA_RINKEBY
        );
      },
      network_id: 4,
      gas: 6000000,
      gasPrice: 10000000000,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(
          process.env.REACT_APP_MNEMONIC,
          process.env.REACT_APP_INFURA_ROPSTEN
        );
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: "*",
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(
          process.env.REACT_APP_MNEMONIC,
          process.env.REACT_APP_INFURA_GOERLI
        );
      },
      network_id: 5,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      gas: 5000000,
      gasPrice: 25000000000,
    },
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "0.8.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};