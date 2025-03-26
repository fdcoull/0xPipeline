// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TransportControlModule", (m) => {
    
    const transportControl = m.contract("TransportControl", []);

    // Add sample data

    // const transaction1 = m.call(transportControl, "list", [
    //     1,
    //     "Test",
    //     0,
    //     "kg",
    //     5,
    // ]);

    // const transaction2 = m.call(transportControl, "addBatch", [1, 10], {after: [transaction1]});

    // m.call(transportControl, "buy", [1, 3], {after: [transaction2], value: 15n}); 

    // END
    
    return { transportControl };
});
