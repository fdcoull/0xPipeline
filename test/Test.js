const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Test", function () {
    it("Has a name", async function () {
        const Test = await ethers.getContractFactory("Test");
        test = await Test.deploy();
        expect(await test.name()).to.equal("Test");
    });
})
