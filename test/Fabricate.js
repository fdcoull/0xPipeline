const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Fabricate Control", function () {
    let fabricateControl;
    let deployer, buyer;
    let transaction;

    beforeEach(async () => {
        [deployer, buyer] = await ethers.getSigners();
        const FabricateControl = await ethers.getContractFactory("FabricateControl");
        fabricateControl = await FabricateControl.deploy();

        // Parts
        transaction = await fabricateControl.connect(deployer).addNewPart(
            1,
            "Steel sheet metal",
            100,
            "KG",
            5
        );
        await transaction.wait();

        transaction = await fabricateControl.connect(deployer).addNewPart(
            2,
            "Steel tube metal",
            50,
            "KG",
            8
        );
        await transaction.wait();

        // BOMs
        const component1 = { partId: 1, quantity: 2 };
        const component2 = { partId: 2, quantity: 4 };
        const components = [component1, component2];

        const name = "Body panel";
        const quantity_unit = "units";
        const cost = 100;

        transaction = await fabricateControl.connect(deployer).addNewBomProduct(1, components, name, quantity_unit, cost);
        await transaction.wait();
    });

    describe("Deployment", function () {
        it("Sets the owner", async function () {
            const owner = await fabricateControl.owner();
            expect(owner).to.equal(deployer.address);
        });
    });

    describe("Parts", function () {
        it("Returns part details", async function () {
            // Declare parts
            const part1 = await fabricateControl.parts(1);
            const part2 = await fabricateControl.parts(2);

            // Test part 1 and details
            expect(part1.name).to.equal("Steel sheet metal");
            expect(part1.quantity).to.equal(100);
            expect(part1.quantity_unit).to.equal("KG");
            expect(part1.cost).to.equal(5);

            // Test part 2
            expect(part2.name).to.equal("Steel tube metal")
        });
    });

    describe("BOMS", function () {
        it("Adds new BOMs", async function () {
            const bom = await fabricateControl.getBom(1);
            expect(bom).to.not.be.undefined;
            expect(bom).to.not.be.null;
        });

        it("Adds new products", async function () {
            const product = await fabricateControl.products(1);
            expect(product).to.not.be.undefined;
            expect(product).to.not.be.null;
        });
    });

    describe("Manufacturing", function () {
        beforeEach(async () => {
            // Manufacturing
            transaction = await fabricateControl.connect(deployer).manufactureProduct(1, 3);
            await transaction.wait();
        });
        
        it("Subtracts from part stock", async function () {
            const part1 = await fabricateControl.parts(1);
            const part2 = await fabricateControl.parts(2);
            expect(part1.quantity).to.be.equal(94);
            expect(part2.quantity).to.be.equal(38);
        });
        it("Adds to product stock", async function () {
            const product = await fabricateControl.products(1);
            expect(product.quantity).to.be.equal(3);
        });
    });

    describe("Purchases", function () {
        beforeEach(async () => {
            // Manufacturing
            transaction = await fabricateControl.connect(deployer).manufactureProduct(1, 3);
            await transaction.wait();

            // Create order
            const buyQuantity = 5;
            transaction = await fabricateControl.connect(buyer).buy(1, 2, {value: 2 * 100});
            await transaction.wait();
        });

        it("Adds an order", async function () {
            // Check blockchain for order
            const order = await fabricateControl.orders(1);
            expect(order.time).to.be.greaterThan(0);
        });

        it("Adds payment to contract balance", async function () {
            const result = await ethers.provider.getBalance(fabricateControl.target);
            expect(result).to.equal(100 * 2);
        });

        it("Reduces stock", async function () {
            const product = await fabricateControl.products(1);
            expect(product.quantity).to.equal(3 - 2);
        });
    });

});