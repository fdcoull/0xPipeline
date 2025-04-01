// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

module.exports = buildModule("SampleDataModule", (m) => {
    
    const materialControl1 = m.contract("MaterialControl", [], {id: "MaterialControlInstance1"});
    const materialControl2 = m.contract("MaterialControl", [], {id: "MaterialControlInstance2"});

    const fabricateControl1 = m.contract("FabricateControl", [], {id: "FabricateControlInstance1"});
    const fabricateControl2 = m.contract("FabricateControl", [], {id: "FabricateControlInstance2"});

    const transportControl1 = m.contract("TransportControl", [], {id: "TransportControlInstance1"});

    // Material Contract 1 sample data
    const transaction1 = m.call(materialControl1, "list", [
        "Transparent Sheet Plastic 25x10CM",
        200,
        "units",
        1,
    ]);

    // Material Contract 2 sample data
    const transaction2 = m.call(materialControl2, "list", [
        "Black Plastic",
        2000,
        "g",
        2,
    ]);

    // Fabricate Contract 1 sample data
    const transaction3 = m.call(fabricateControl1, "addNewPart", [
        "TEST",
        500,
        "units",
        1
    ], {id: "AddFabPart1"});

    const components1 = [
        {
          partId: 1,
          quantity: 1
        }
    ];

    const transaction4 = m.call(fabricateControl1, "addNewBomProduct", [
        components1,
        "Microcontroller and RTC",
        "units",
        2
    ], {after: [transaction3], id: "AddProduct1"});

    const transaction5 = m.call(fabricateControl1, "manufactureProduct", [
        1,
        50
    ], {after: [transaction4], id: "Manufacture1"});

    // Fabricate Contract 2 sample data
    const transaction6 = m.call(fabricateControl2, "addNewPart", [
        "TEST2",
        750,
        "units",
        1
    ], {id: "AddFabPart2"});

    const components2 = [
        {
          partId: 1,
          quantity: 1
        }
    ];

    const transaction7 = m.call(fabricateControl2, "addNewBomProduct", [
        components2,
        "LCD Display 25x10CM",
        "units",
        2
    ], {after: [transaction6], id: "AddProduct2"});

    const transaction8 = m.call(fabricateControl2, "manufactureProduct", [
        1,
        75
    ], {after: [transaction7], id: "Manufacture2"});
    
    return { materialControl1, materialControl2, fabricateControl1, fabricateControl2, transportControl1 };
});
