const hre = require("hardhat");

const {getInitializerData} = require("@openzeppelin/hardhat-upgrades/dist/utils");

async function deployProxy(ImplFactory, args, opts) {
    if (!Array.isArray(args)) {
        opts = args;
        args = [];
    }
    const impl = await ImplFactory.deploy()
    await impl.deployed();
    const data = getInitializerData(impl.interface, args, opts.initializer);

    const ProxyFactory = await hethers.getContractFactory('UUPSProxy');
    const proxy = await ProxyFactory.deploy(impl.address, data)
    await proxy.deployed();
    return await ImplFactory.attach(proxy.address)
}

async function upgradeProxy(proxyAddress, ImplFactory, newImplFactory) {
    const newimpl = await newImplFactory.deploy();
    const impl = await ImplFactory.attach(proxyAddress);
    await newimpl.deployed();
    await impl.upgradeTo(newimpl.address);
    return await newImplFactory.attach(proxyAddress);
}

async function main() {
    const Counter = await hethers.getContractFactory("Counter_UUPS");
    const CounterV2 = await hethers.getContractFactory("CounterV2_UUPS");

    const counter = await deployProxy(Counter, [10], {initializer: 'initialize'});
    console.log("Proxy deployed to: ", counter.address);

    await counter.add();
    console.log("count = ", (await counter.getCount()).toString());

    const counterv2 = await upgradeProxy(counter.address, Counter, CounterV2);

    await counterv2.add();
    console.log("count = ", (await counterv2.getCount()).toString());
}
`1`
main()    
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });