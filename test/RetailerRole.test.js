const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test suite for the RetailerRole contract.
 */
describe("RetailerRole", function () {
  let RetailerRole, retailerRole, owner, addr1, addr2;

  /**
   * Deploy RetailerRole contract and get signers before each test.
   */
  beforeEach(async function () {
    // Deploy the RetailerRole contract before each test
    RetailerRole = await ethers.getContractFactory("RetailerRole");
    retailerRole = await RetailerRole.deploy();
    await retailerRole.deployed();

    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  /**
   * Tests for deployment behavior of the RetailerRole contract.
   */
  describe("Deployment", function () {
    it("Should set the deploying address as the first retailer", async function () {
      // Test to ensure the deployer is set as the first retailer
      expect(await retailerRole.isRetailer(owner.address)).to.equal(true);
    });
  });

  /**
   * Tests for retailer management functionality in the RetailerRole contract.
   */
  describe("Manage Retailers", function () {
    it("Should allow a retailer to add another retailer", async function () {
      // Test adding a new retailer
      await retailerRole.addRetailer(addr1.address);
      expect(await retailerRole.isRetailer(addr1.address)).to.equal(true);
    });

    it("Should emit RetailerAdded event when a new retailer is added", async function () {
      // Test emission of RetailerAdded event
      await expect(retailerRole.addRetailer(addr1.address))
        .to.emit(retailerRole, "RetailerAdded")
        .withArgs(addr1.address);
    });

    it("Should allow a retailer to renounce their role", async function () {
      // Test renouncing retailer role
      await retailerRole.addRetailer(addr1.address);
      await retailerRole.connect(addr1).renounceRetailer();
      expect(await retailerRole.isRetailer(addr1.address)).to.equal(false);
    });

    it("Should emit RetailerRemoved event when a retailer is removed", async function () {
      // Test emission of RetailerRemoved event
      await retailerRole.addRetailer(addr1.address);
      await expect(retailerRole.connect(addr1).renounceRetailer())
        .to.emit(retailerRole, "RetailerRemoved")
        .withArgs(addr1.address);
    });

    it("Should not allow non-retailers to add retailers", async function () {
      // Test that non-retailers cannot add retailers
      await expect(
        retailerRole.connect(addr1).addRetailer(addr2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });
});
