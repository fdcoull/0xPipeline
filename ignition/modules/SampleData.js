// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

module.exports = buildModule("SampleDataModule", (m) => {
    
    const materialControl1 = m.contract("MaterialControl", [], {id: "MaterialControlInstance1"});
    const materialControl2 = m.contract("MaterialControl", [], {id: "MaterialControlInstance2"});

    const fabricateControl1 = m.contract("FabricateControl", [], {id: "FabricateControlInstance1"});
    const fabricateControl2 = m.contract("FabricateControl", [], {id: "FabricateControlInstance2"});

    // Material Contract 1 sample data
    const transaction1 = m.call(materialControl1, "list", [
        "Steel",
        500,
        "kg",
        1,
    ]);

    // Material Contract 2 sample data
    const transaction2 = m.call(materialControl2, "list", [
        "Iron",
        800,
        "kg",
        1,
    ]);

    // Fabricate Contract 1 sample data
    const components1 = [
        {
          partId: 1,
          quantity: 3
        }
    ];

    const transaction3 = m.call(fabricateControl1, "addNewBomProduct", [
        components1,
        "Test Assembled Product",
        "units",
        50
    ], {id: "AddProduct1"});

    // Fabricate Contract 2 sample data
    const components2 = [
        {
          partId: 2,
          quantity: 7
        }
    ];

    const transaction4 = m.call(fabricateControl2, "addNewBomProduct", [
        components2,
        "Test Assembled Product 2",
        "units",
        50
    ], {id: "AddProduct2"});

    
    return { materialControl1, materialControl2, fabricateControl1, fabricateControl2 };
});
