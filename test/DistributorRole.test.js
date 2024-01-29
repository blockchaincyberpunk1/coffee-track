const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test suite for the DistributorRole contract.
 */
describe("DistributorRole", function () {
  let DistributorRole, distributorRole, owner, addr1, addr2;

  /**
   * Deploy DistributorRole contract and get signers before each test.
   */
  beforeEach(async function () {
    // Deploy the DistributorRole contract before each test
    DistributorRole = await ethers.getContractFactory("DistributorRole");
    distributorRole = await DistributorRole.deploy();
    await distributorRole.deployed();

    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  /**
   * Tests for deployment behavior of the DistributorRole contract.
   */
  describe("Deployment", function () {
    it("Should set the deploying address as the first distributor", async function () {
      // Expect the deployer to be set as the first distributor
      expect(await distributorRole.isDistributor(owner.address)).to.equal(true);
    });
  });

  /**
   * Tests for distributor management functionality.
   */
  describe("Manage Distributors", function () {
    it("Should allow a distributor to add another distributor", async function () {
      // Test adding a new distributor
      await distributorRole.addDistributor(addr1.address);
      expect(await distributorRole.isDistributor(addr1.address)).to.equal(true);
    });

    it("Should emit DistributorAdded event when a new distributor is added", async function () {
      // Test emission of DistributorAdded event
      await expect(distributorRole.addDistributor(addr1.address))
        .to.emit(distributorRole, "DistributorAdded")
        .withArgs(addr1.address);
    });

    it("Should allow a distributor to renounce their role", async function () {
      // Test renouncing distributor role
      await distributorRole.addDistributor(addr1.address);
      await distributorRole.connect(addr1).renounceDistributor();
      expect(await distributorRole.isDistributor(addr1.address)).to.equal(
        false
      );
    });

    it("Should emit DistributorRemoved event when a distributor is removed", async function () {
      // Test emission of DistributorRemoved event
      await distributorRole.addDistributor(addr1.address);
      await expect(distributorRole.connect(addr1).renounceDistributor())
        .to.emit(distributorRole, "DistributorRemoved")
        .withArgs(addr1.address);
    });

    it("Should not allow non-distributors to add distributors", async function () {
      // Test that non-distributors cannot add distributors
      await expect(
        distributorRole.connect(addr1).addDistributor(addr2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });
});
