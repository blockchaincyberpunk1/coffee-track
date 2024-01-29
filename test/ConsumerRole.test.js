const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test suite for ConsumerRole contract.
 */
describe("ConsumerRole", function () {
  let ConsumerRole, consumerRole, owner, addr1, addr2;

  /**
   * Deploy ConsumerRole contract and get signers before each test.
   */
  beforeEach(async function () {
    // Deploy the ConsumerRole contract before each test
    ConsumerRole = await ethers.getContractFactory("ConsumerRole");
    consumerRole = await ConsumerRole.deploy();
    await consumerRole.deployed();

    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  /**
   * Tests for deployment behavior of the ConsumerRole contract.
   */
  describe("Deployment", function () {
    it("Should set the deploying address as the first consumer", async function () {
      // Expect the deployer to be set as the first consumer
      expect(await consumerRole.isConsumer(owner.address)).to.equal(true);
    });
  });

  /**
   * Tests for consumer management functionality.
   */
  describe("Manage Consumers", function () {
    it("Should allow a consumer to add another consumer", async function () {
      // Test adding a new consumer
      await consumerRole.addConsumer(addr1.address);
      expect(await consumerRole.isConsumer(addr1.address)).to.equal(true);
    });

    it("Should emit ConsumerAdded event when a new consumer is added", async function () {
      // Test emission of ConsumerAdded event
      await expect(consumerRole.addConsumer(addr1.address))
        .to.emit(consumerRole, "ConsumerAdded")
        .withArgs(addr1.address);
    });

    it("Should allow a consumer to renounce their role", async function () {
      // Test renouncing consumer role
      await consumerRole.addConsumer(addr1.address);
      await consumerRole.connect(addr1).renounceConsumer();
      expect(await consumerRole.isConsumer(addr1.address)).to.equal(false);
    });

    it("Should emit ConsumerRemoved event when a consumer is removed", async function () {
      // Test emission of ConsumerRemoved event
      await consumerRole.addConsumer(addr1.address);
      await expect(consumerRole.connect(addr1).renounceConsumer())
        .to.emit(consumerRole, "ConsumerRemoved")
        .withArgs(addr1.address);
    });

    it("Should not allow non-consumers to add consumers", async function () {
      // Test that non-consumers cannot add consumers
      await expect(
        consumerRole.connect(addr1).addConsumer(addr2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });
});
