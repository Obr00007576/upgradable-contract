require("hardhat-hethers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.hethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task('getBalance', 'Prints the the balance of accounts', async (_, {hethers}) => {
  const accounts = await hre.hethers.getSigners();
  for (const account of accounts) {
    const balance = (await hre.hethers.provider.getBalance(account.address)).toString();
    console.log(`Balance of ${account.address}: ${balance} tinybars`);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: { enabled: true, runs: 1 },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
    ],
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: true,
    runOnCompile: true,
    strict: false,
  },
  defaultNetwork: 'testnet',  // The selected default network. It has to match the name of one of the configured networks.
  hedera: {
    gasLimit: 300000, // Default gas limit. It is added to every contract transaction, but can be overwritten if required.
    networks: {
      testnet: { 
         // The name of the network, e.g. mainnet, testnet, previewnet, customNetwork
        accounts: [   // An array of predefined Externally Owned Accounts
        {
          "account": '0.0.47616494',
          "privateKey": '0xe48ccffb85187787468cc7e8ec71baca692ff60b4b6f7c369d1a655a4155b81a'
        },
        {
          "account": '0.0.47616471',
          "privateKey": '0x5d1e42f00bcf7a029f2ffd88db773c0c84634890f6fa81b8b72bf6e6056da368'
        }
        ]
      }
    }
  }
};
