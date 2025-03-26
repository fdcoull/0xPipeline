// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

module.exports = buildModule("MaterialControlModule", (m) => {
    
    const materialControl = m.contract("MaterialControl", []);

    // Add sample data

    const transaction1 = m.call(materialControl, "list", [
        1,
        "Test",
        0,
        "kg",
        5,
    ]);

    const transaction2 = m.call(materialControl, "addBatch", [1, 10], {after: [transaction1]});

    m.call(materialControl, "buy", [1, 3], {after: [transaction2], value: 15n}); 

    // END
    
    return { materialControl };
});
