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

    beforeEach(async () => {
        [deployer, buyer] = await ethers.getSigners();
        const MaterialControl = await ethers.getContractFactory("MaterialControl");
        materialControl = await MaterialControl.deploy();
    });

    describe("Deployment", function () {
        it("Sets the owner", async function () {
            const owner = await materialControl.owner();
            expect(owner).to.equal(deployer.address);
        });
    });

    describe("List material", function () {
        let transaction

        beforeEach(async () => {
            transaction = await materialControl.connect(deployer).list(
                ID,
                NAME,
                QUANTITY,
                QUANTITY_UNIT,
                COST
            );

            await transaction.wait();
        });

        it("Returns material details", async function () {
            const material = await materialControl.materials(ID)

            expect(material.name).to.equal(NAME);
            expect(material.quantity).to.equal(QUANTITY);
            expect(material.quantity_unit).to.equal(QUANTITY_UNIT);
            expect(material.cost).to.equal(COST);
        });
    });

    // describe("Deployment", function () { });
    // it("Has a name", async function () { });
})
