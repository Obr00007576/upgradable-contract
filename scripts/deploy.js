// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");


async function deployProxy(contractName){
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy();
  console.log("Implementation contract deployed to:", contract.address);

  const Proxy = await ethers.getContractFactory("Proxy");
  const proxy = await Proxy.deploy();
  await proxy.upgrade(contract.address);
  console.log("Proxy contract deployed to:", proxy.address);

  const proxyContract = await contract.attach(proxy.address);
  return proxyContract;
}

async function upgrade(proxyAdress, newContractName){
  const Contract = await ethers.getContractFactory(newContractName);
  const contract = await Contract.deploy();
  console.log("Implementation contract deployed to:", contract.address);

  const Proxy = await ethers.getContractFactory("Proxy");
  const proxy = await Proxy.attach(proxyAdress);

  await proxy.upgrade(contract.address);
}

async function main() {
  counterProxy = await deployProxy("Counter");
  console.log("counter:", (await counterProxy.getCount()).toString());
  await counterProxy.add();
  console.log("counter:", (await counterProxy.getCount()).toString());

  await upgrade(counterProxy.address, "CounterV2");

  console.log("counter:", (await counterProxy.getCount()).toString());
  await counterProxy.add();
  console.log("counter:", (await counterProxy.getCount()).toString());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
