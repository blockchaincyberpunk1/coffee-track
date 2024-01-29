const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test suite for the MockRoles contract.
 */
describe("MockRoles", function () {
  let MockRoles, mockRoles, owner, addr1;

  /**
   * Deploy MockRoles contract and retrieve signers before each test.
   */
  beforeEach(async function () {
    // Deploy the MockRoles contract before each test
    MockRoles = await ethers.getContractFactory("MockRoles");
    mockRoles = await MockRoles.deploy();
    await mockRoles.deployed();

    // Get signers
    [owner, addr1] = await ethers.getSigners();
  });

  /**
   * Tests for role management functionality in MockRoles contract.
   */
  describe("Role Management", function () {
    it("Should add a role to an account", async function () {
      // Test adding a role to an account
      await mockRoles.addRole(addr1.address);
      expect(await mockRoles.hasRole(addr1.address)).to.equal(true);
    });

    it("Should remove a role from an account", async function () {
      // Test removing a role from an account
      await mockRoles.addRole(addr1.address);
      await mockRoles.removeRole(addr1.address);
      expect(await mockRoles.hasRole(addr1.address)).to.equal(false);
    });

    it("Should return false for accounts without a role", async function () {
      // Test role check for an account without a role
      expect(await mockRoles.hasRole(addr1.address)).to.equal(false);
    });

    it("Should revert when adding a role to the zero address", async function () {
      // Test for revert when adding a role to the zero address
      await expect(
        mockRoles.addRole(ethers.constants.AddressZero)
      ).to.be.revertedWith("Roles: account is the zero address");
    });

    it("Should revert when removing a role from an account without a role", async function () {
      // Test for revert when removing a role from an account without it
      await expect(mockRoles.removeRole(addr1.address)).to.be.revertedWith(
        "Roles: account does not have role"
      );
    });
  });
});
