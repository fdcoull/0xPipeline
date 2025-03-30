// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PipelineModule", (m) => {
    
    const pipeline = m.contract("Pipeline", []);
    
    return { pipeline };
});
