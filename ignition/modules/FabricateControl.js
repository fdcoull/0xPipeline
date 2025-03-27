// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

module.exports = buildModule("FabricateControlModule", (m) => {
    
    const fabricateControl = m.contract("FabricateControl", []);

    // Add sample data

    transaction1 = m.call(fabricateControl, "addNewPart", [
        1,
        "Test Plate",
        100,
        "units",
        2
    ], {id: "addPart_TestPlate"});

    transaction2 = m.call(fabricateControl, "addNewPart", [
        2,
        "Test Shaft",
        200,
        "units",
        3
    ], {after: [transaction1], id: "addPart_TestShaft"});

    const components = [
        {
          partId: 1,
          quantity: 3
        },
        {
          partId: 2,
          quantity: 6
        }
      ];

    transaction3 = m.call(fabricateControl, "addNewBomProduct", [
        1,
        components,
        "Test Assembled Product",
        "units",
        8
    ], {after: [transaction2]});

    transaction4 = m.call(fabricateControl, "manufactureProduct", [
        1,
        5
    ], {after: [transaction3]});

    transaction5 = m.call(fabricateControl, "buy", [
        1,
        2,
    ], {value:16n, after: [transaction4]});


    // END
    
    return { fabricateControl };
});
