// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

module.exports = buildModule("MaterialControlModule", (m) => {
    const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;

    const materialControl = m.contract("Material", [deployerKey]);
    
    return { materialControl };
});
