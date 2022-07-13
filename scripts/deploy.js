// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const TransparentUpgradeableProxy = require('@openzeppelin/upgrades-core/artifacts/@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol/TransparentUpgradeableProxy.json');
const ProxyAdmin = require('@openzeppelin/upgrades-core/artifacts/@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol/ProxyAdmin.json');

const {getInitializerData} = require("@openzeppelin/hardhat-upgrades/dist/utils");


async function fetchOrDeployAdminProxy(proxyAdminAddress) {
    const address = proxyAdminAddress ? hethers.utils.getAddressFromAccount(hethers.utils.parseAccount(proxyAdminAddress)) : null;
    // const address = null;
    const proxyAdminFactory = await hethers.getContractFactory(ProxyAdmin.abi, ProxyAdmin.bytecode);
    const proxyAdmin = proxyAdminAddress ? (await proxyAdminFactory.attach(address)) : (await proxyAdminFactory.deploy());
    await proxyAdmin.deployed();

    console.log("ProxyAdmin deployed to:", proxyAdmin.address);

    return proxyAdmin
}

async function deployProxy(proxyAdmin, ImplFactory, args, opts) {
    if (!Array.isArray(args)) {
        opts = args;
        args = [];
    }
    const impl = await ImplFactory.deploy()
    await impl.deployed();

    const ProxyFactory = await hethers.getContractFactory(TransparentUpgradeableProxy.abi, TransparentUpgradeableProxy.bytecode);
    const data = getInitializerData(impl.interface, args, opts.initializer);
    const proxy = await ProxyFactory.deploy(impl.address, proxyAdmin.address, data)
    await proxy.deployed();
    return await ImplFactory.attach(proxy.address)
}

async function upgradeProxy(proxyAdmin, proxyAddress, ImplFactory) {
    const impl = await ImplFactory.deploy()
    await impl.deployed();
    await proxyAdmin.upgrade(proxyAddress, impl.address);
    return await ImplFactory.attach(proxyAddress)
}

async function upgradeProxyAddress(proxyAdmin, proxyAddress, ImplFactory, implAddress) {
    await proxyAdmin.upgrade(proxyAddress, hethers.utils.getAddressFromAccount(hethers.utils.parseAccount(implAddress)));
    return await ImplFactory.attach(proxyAddress)
}


async function main() {

    const Counter = await hethers.getContractFactory("Counter");

    //const proxyAdmin = await fetchOrDeployAdminProxy(null);
    const proxyAdmin = await fetchOrDeployAdminProxy();

    const contractProxy = await deployProxy(proxyAdmin, Counter, [20], { initializer: 'initialize' });
    // const contractProxy = await boxFactory.attach('0.0.1034');
    await contractProxy.deployed();
    console.log("Proxy deployed to:", contractProxy.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
