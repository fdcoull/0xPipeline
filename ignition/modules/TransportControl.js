// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TransportControlModule", (m) => {
    
    const transportControl = m.contract("TransportControl", []);

    //function ship(uint256 _senderOrderNo, uint256 _weight, address _recipient, Method _method) public payable {

    m.call(transportControl, "ship", [
        73626,
        6,
        "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        0,
    ], {value:1n});

    // END
    
    return { transportControl };
});
