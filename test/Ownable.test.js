const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test suite for the Ownable contract.
 */
describe("Ownable Contract", function () {
  let Ownable, ownable, owner, addr1, addr2;

  /**
   * Set up the Ownable contract and retrieve signers before each test.
   */
  beforeEach(async function () {
    // Deploy the Ownable contract
    Ownable = await ethers.getContractFactory("Ownable");
    ownable = await Ownable.deploy();
    await ownable.deployed();

    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  /**
   * Tests for ownership-related functionalities in the Ownable contract.
   */
  describe("Ownership", function () {
    it("Should set the right owner", async function () {
      // Test to ensure the correct owner is set
      expect(await ownable.owner()).to.equal(owner.address);
    });

    it("Should transfer ownership", async function () {
      // Test transferring ownership to a new address
      await ownable.connect(owner).transferOwnership(addr1.address);
      expect(await ownable.owner()).to.equal(addr1.address);
    });

    it("Should renounce ownership", async function () {
      // Test renouncing ownership, setting owner to zero address
      await ownable.connect(owner).renounceOwnership();
      expect(await ownable.owner()).to.equal(ethers.constants.AddressZero);
    });

    it("Should prevent non-owners from transferring ownership", async function () {
      // Test that non-owners cannot transfer ownership
      await expect(
        ownable.connect(addr2).transferOwnership(addr1.address)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });
});
