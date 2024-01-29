const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test suite for the FarmerRole contract.
 */
describe("FarmerRole", function () {
  let FarmerRole, farmerRole, owner, addr1, addr2;

  /**
   * Deploy FarmerRole contract and get signers before each test.
   */
  beforeEach(async function () {
    // Deploy the FarmerRole contract before each test
    FarmerRole = await ethers.getContractFactory("FarmerRole");
    farmerRole = await FarmerRole.deploy();
    await farmerRole.deployed();

    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  /**
   * Tests for deployment behavior of the FarmerRole contract.
   */
  describe("Deployment", function () {
    it("Should set the deploying address as the first farmer", async function () {
      // Expect the deployer to be set as the first farmer
      expect(await farmerRole.isFarmer(owner.address)).to.equal(true);
    });
  });

  /**
   * Tests for farmer management functionality.
   */
  describe("Manage Farmers", function () {
    it("Should allow a farmer to add another farmer", async function () {
      // Test adding a new farmer
      await farmerRole.addFarmer(addr1.address);
      expect(await farmerRole.isFarmer(addr1.address)).to.equal(true);
    });

    it("Should emit FarmerAdded event when a new farmer is added", async function () {
      // Test emission of FarmerAdded event
      await expect(farmerRole.addFarmer(addr1.address))
        .to.emit(farmerRole, "FarmerAdded")
        .withArgs(addr1.address);
    });

    it("Should allow a farmer to renounce their role", async function () {
      // Test renouncing farmer role
      await farmerRole.addFarmer(addr1.address);
      await farmerRole.connect(addr1).renounceFarmer();
      expect(await farmerRole.isFarmer(addr1.address)).to.equal(false);
    });

    it("Should emit FarmerRemoved event when a farmer is removed", async function () {
      // Test emission of FarmerRemoved event
      await farmerRole.addFarmer(addr1.address);
      await expect(farmerRole.connect(addr1).renounceFarmer())
        .to.emit(farmerRole, "FarmerRemoved")
        .withArgs(addr1.address);
    });

    it("Should not allow non-farmers to add farmers", async function () {
      // Test that non-farmers cannot add farmers
      await expect(
        farmerRole.connect(addr1).addFarmer(addr2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });
});
