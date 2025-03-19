const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const OrderNo = 1;
const Weight = 2;
const Method = 0;

describe("Transport Control", function () {
    let transportControl;
    let deployer, sender, recipient;
    let transaction;

    beforeEach(async () => {
        [deployer, sender, recipient] = await ethers.getSigners();
        const TransportControl = await ethers.getContractFactory("TransportControl");
        transportControl = await TransportControl.deploy();

        transaction = await transportControl.connect(deployer).ship(
            OrderNo,
            Weight,
            recipient,
            Method,
            {value: 1}
        );

        await transaction.wait();
    });

    describe("Deployment", function () {
        it("Sets the owner", async function () {
            const owner = await transportControl.owner();
            expect(owner).to.equal(deployer.address);
        });
    });

    describe("Shipment creation", function () {
        it("Returns shipment details", async function () {
            const shipment = await transportControl.shipments(1);
            expect(shipment.sender).to.equal(deployer);
            expect(shipment.senderOrderNo).to.equal(OrderNo);
            expect(shipment.weight).to.equal(Weight);
            expect(shipment.recipient).to.equal(recipient);
            expect(shipment.status).to.equal(0);
            expect(shipment.method).to.equal(Method);
            expect(shipment.cost).to.equal(1);
        });
    });

    describe("Shipment update", function () {
        const newStatus = 3;
        beforeEach(async () => {
            // Set status to received (3)
            transaction = await transportControl.connect(deployer).updateStatus(1, 3);
            await transaction.wait();
        });
        it("Updates the shipment status", async function () {
            const shipment = await transportControl.shipments(1);
            expect(shipment.status).to.equal(newStatus);
        });
    });
});
