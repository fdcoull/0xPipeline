const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Material Manager", function () {
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

    // describe("Deployment", function () { });
    // it("Has a name", async function () { });
})
