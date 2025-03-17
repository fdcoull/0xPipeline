const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const ID = 1;
const NAME = "Iron";
const QUANTITY = 0;
const QUANTITY_UNIT = "KG";
const COST = "5";

describe("Material Control", function () {
    let materialControl;
    let deployer, buyer;
    let transaction;

    beforeEach(async () => {
        [deployer, buyer] = await ethers.getSigners();
        const MaterialControl = await ethers.getContractFactory("MaterialControl");
        materialControl = await MaterialControl.deploy();

        transaction = await materialControl.connect(deployer).list(
            ID,
            NAME,
            QUANTITY,
            QUANTITY_UNIT,
            COST
        );

        await transaction.wait();
    });

    describe("Deployment", function () {
        it("Sets the owner", async function () {
            const owner = await materialControl.owner();
            expect(owner).to.equal(deployer.address);
        });
    });

    describe("List material", function () {
        //let transaction

        // beforeEach(async () => {
            
        // });

        it("Returns material details", async function () {
            const material = await materialControl.materials(ID);
            expect(material.name).to.equal(NAME);
            expect(material.quantity).to.equal(QUANTITY);
            expect(material.quantity_unit).to.equal(QUANTITY_UNIT);
            expect(material.cost).to.equal(COST);
        });

        it("Sets default stock to zero", async function () {
            const material = await materialControl.materials(ID)
            expect(material.quantity).to.equal(0);
        });
    });

    describe("Batch addition", function () {
        it("Increases the stock level", async function () {
            const batchTotal = 300;
            transaction = await materialControl.connect(deployer).addBatch(ID, batchTotal);
            await transaction.wait();
            const material = await materialControl.materials(ID);

            expect(material.quantity).to.equal(batchTotal);
        });
    });

    describe("Purchases", function () {
        beforeEach(async () => {
            // Add to stock
            transaction = await materialControl.connect(deployer).addBatch(ID, 10);
            await transaction.wait();

            // Create order
            const buyQuantity = 5;
            transaction = await materialControl.connect(buyer).buy(ID, buyQuantity, {value: buyQuantity * COST});
            await transaction.wait();

        });

        it("Adds an order", async function () {
            // Check blockchain for order
            const order = await materialControl.orders(1);
            expect(order.time).to.be.greaterThan(0);
        });

        it("Adds payment to contract balance", async function () {
            const result = await ethers.provider.getBalance(materialControl.target);
            expect(result).to.equal(COST * 5);
        });

        it("Reduces stock", async function () {
            const material = await materialControl.materials(ID);
            expect(material.quantity).to.equal(10 - 5);
        });
    });

    // describe("Deployment", function () { });
    // it("Has a name", async function () { });
});
