// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

module.exports = buildModule("SampleDataModule", (m) => {
    
    const materialControl1 = m.contract("MaterialControl", [], {id: "MaterialControlInstance1"});
    const materialControl2 = m.contract("MaterialControl", [], {id: "MaterialControlInstance2"});

    // Contract 1 sample data
    const transaction1 = m.call(materialControl1, "list", [
        "Steel",
        500,
        "kg",
        1,
    ]);

    // Contract 2 sample data
    const transaction2 = m.call(materialControl2, "list", [
        "Iron",
        800,
        "kg",
        1,
    ]);
    
    return { materialControl1, materialControl2 };
});
