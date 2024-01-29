const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test suite for the SupplyChain contract.
 */
describe("SupplyChain", function () {
  let SupplyChain, supplyChain, owner, farmer, distributor, retailer, consumer;
  let upc = 0; // Initialize UPC

  /**
   * Deploy SupplyChain contract, assign roles, and prepare an item for each test.
   */
  beforeEach(async function () {
    // Contract setup and role assignment
    [owner, farmer, distributor, retailer, consumer] =
      await ethers.getSigners();
    SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplyChain = await SupplyChain.deploy();
    await supplyChain.deployed();

    // Increment UPC for each test to ensure uniqueness
    upc++;

    // Check and assign roles to the respective addresses
    // Assign roles if not already assigned
    if (!(await supplyChain.isFarmer(farmer.address))) {
      await supplyChain.connect(owner).addFarmer(farmer.address);
    }
    if (!(await supplyChain.isDistributor(distributor.address))) {
      await supplyChain.connect(owner).addDistributor(distributor.address);
    }
    if (!(await supplyChain.isRetailer(retailer.address))) {
      await supplyChain.connect(owner).addRetailer(retailer.address);
    }
    if (!(await supplyChain.isConsumer(consumer.address))) {
      await supplyChain.connect(owner).addConsumer(consumer.address);
    }

    // Harvest an item by farmer for each test
    await supplyChain.connect(farmer).harvestItem({
      upc,
      originFarmName: "Farm",
      originFarmInformation: "Information",
      originFarmLatitude: "Lat",
      originFarmLongitude: "Long",
      productNotes: "Best coffee beans",
    });
  });

  /**
   * Tests for adding and removing roles in the SupplyChain contract.
   */
  describe("Role Management Tests", function () {
    // Test adding and removing Farmer role
    it("Should allow adding and removing Farmer role", async function () {
      // Only add the Farmer role if the account doesn't already have it
      if (!(await supplyChain.isFarmer(farmer.address))) {
        await supplyChain.connect(owner).addFarmer(farmer.address);
      }
      expect(await supplyChain.isFarmer(farmer.address)).to.be.true;

      // Renounce Farmer role
      await supplyChain.connect(farmer).renounceFarmer();
      expect(await supplyChain.isFarmer(farmer.address)).to.be.false;
    });

    // Test adding and removing Distributor role
    it("Should allow adding and removing Distributor role", async function () {
      // Only add the Distributor role if the account doesn't already have it
      if (!(await supplyChain.isDistributor(distributor.address))) {
        await supplyChain.connect(owner).addDistributor(distributor.address);
      }
      expect(await supplyChain.isDistributor(distributor.address)).to.be.true;

      // Renounce Distributor role
      await supplyChain.connect(distributor).renounceDistributor();
      expect(await supplyChain.isDistributor(distributor.address)).to.be.false;
    });

    // Test adding and removing Retailer role
    it("Should allow adding and removing Retailer role", async function () {
      // Only add the Retailer role if the account doesn't already have it
      if (!(await supplyChain.isRetailer(retailer.address))) {
        await supplyChain.connect(owner).addRetailer(retailer.address);
      }
      expect(await supplyChain.isRetailer(retailer.address)).to.be.true;

      // Renounce Retailer role
      await supplyChain.connect(retailer).renounceRetailer();
      expect(await supplyChain.isRetailer(retailer.address)).to.be.false;
    });

    // Test adding and removing Consumer role
    it("Should allow adding and removing Consumer role", async function () {
      // Only add the Consumer role if the account doesn't already have it
      if (!(await supplyChain.isConsumer(consumer.address))) {
        await supplyChain.connect(owner).addConsumer(consumer.address);
      }
      expect(await supplyChain.isConsumer(consumer.address)).to.be.true;

      // Renounce Consumer role
      await supplyChain.connect(consumer).renounceConsumer();
      expect(await supplyChain.isConsumer(consumer.address)).to.be.false;
    });
  });

  /**
   * Tests for the lifecycle of an item in the SupplyChain contract.
   */
  describe("Item Lifecycle Tests", function () {
    let upc; // Declare UPC variable
    const productNotes = "Best coffee beans";
    const productPrice = ethers.utils.parseEther("1");

    /**
     * Harvest an item for each lifecycle test to ensure a unique UPC and consistent state.
     */
    beforeEach(async function () {
      // Increment UPC for each test to ensure uniqueness
      upc = upc ? upc + 1 : 1;

      // Harvest an item by farmer for each test
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Information",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes,
      });
    });

    it("Should allow a farmer to harvest an item", async function () {
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(0); // Harvested
    });

    it("Should allow a farmer to process an item", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(1); // Processed
    });

    it("Should allow a farmer to pack an item", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(2); // Packed
    });

    it("Should allow a farmer to sell an item", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain.connect(farmer).sellItem(upc, productPrice);
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(3); // ForSale
    });

    it("Should allow a distributor to buy an item", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain.connect(farmer).sellItem(upc, productPrice);
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: productPrice });
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(4); // Sold
    });

    it("Should allow a distributor to ship an item", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain.connect(farmer).sellItem(upc, productPrice);
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: productPrice });
      await supplyChain.connect(distributor).shipItem(upc);
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(5); // Shipped
    });
  });

  /**
   * Tests for access control functionalities in the SupplyChain contract.
   */
  describe("Access Control Tests", function () {
    let upc; // Declare UPC variable

    /**
     * Set up the SupplyChain contract with fresh roles for each test.
     */
    beforeEach(async function () {
      // Increment UPC for each test to ensure uniqueness
      upc = upc ? upc + 1 : 1;

      // Reinitialize the contract to avoid role conflicts from previous tests
      SupplyChain = await ethers.getContractFactory("SupplyChain");
      supplyChain = await SupplyChain.deploy();
      await supplyChain.deployed();

      // Reassign roles for each test
      await supplyChain.connect(owner).addFarmer(farmer.address);
      await supplyChain.connect(owner).addDistributor(distributor.address);
      await supplyChain.connect(owner).addRetailer(retailer.address);
      await supplyChain.connect(owner).addConsumer(consumer.address);
    });

    /**
     * Test to ensure non-farmers cannot harvest an item.
     */
    it("Should prevent non-farmers from harvesting an item", async function () {
      await expect(
        supplyChain.connect(distributor).harvestItem({
          upc,
          originFarmName: "Farm",
          originFarmInformation: "Info",
          originFarmLatitude: "Lat",
          originFarmLongitude: "Long",
          productNotes: "Notes",
        })
      ).to.be.revertedWith("Caller is not a farmer");
    });

    /**
     * Test to ensure non-farmers cannot process an item.
     */
    it("Should prevent non-farmers from processing an item", async function () {
      // First harvest item with farmer to meet preconditions
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Info",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes: "Notes",
      });

      await expect(
        supplyChain.connect(distributor).processItem(upc)
      ).to.be.revertedWith("Caller is not a farmer");
    });

    it("Should prevent non-farmers from packing an item", async function () {
      // First process item with farmer
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Info",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes: "Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);

      await expect(
        supplyChain.connect(distributor).packItem(upc)
      ).to.be.revertedWith("Caller is not a farmer");
    });

    it("Should prevent non-farmers from selling an item", async function () {
      // First pack item with farmer
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Info",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes: "Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);

      await expect(
        supplyChain
          .connect(distributor)
          .sellItem(upc, ethers.utils.parseEther("1"))
      ).to.be.revertedWith("Caller is not a farmer");
    });

    it("Should prevent non-distributors from buying an item", async function () {
      // First sell item with farmer
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Info",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes: "Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));

      await expect(
        supplyChain
          .connect(farmer)
          .buyItem(upc, { value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Caller is not a distributor");
    });

    it("Should prevent non-distributors from shipping an item", async function () {
      // First buy item with distributor
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Info",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes: "Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: ethers.utils.parseEther("1") });

      await expect(
        supplyChain.connect(farmer).shipItem(upc)
      ).to.be.revertedWith("Caller is not a distributor");
    });

    it("Should prevent non-retailers from receiving an item", async function () {
      // First ship item with distributor
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Info",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes: "Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: ethers.utils.parseEther("1") });
      await supplyChain.connect(distributor).shipItem(upc);

      await expect(
        supplyChain.connect(farmer).receiveItem(upc)
      ).to.be.revertedWith("Caller is not a retailer");
    });
  });

  describe("Data Integrity Tests", function () {
    let upc; // Declare UPC variable

    beforeEach(async function () {
      // Increment UPC for each test to ensure uniqueness
      upc = upc ? upc + 1 : 1;

      // Check and assign roles to the respective addresses
      if (!(await supplyChain.isFarmer(farmer.address))) {
        await supplyChain.connect(owner).addFarmer(farmer.address);
      }
      if (!(await supplyChain.isDistributor(distributor.address))) {
        await supplyChain.connect(owner).addDistributor(distributor.address);
      }
      if (!(await supplyChain.isRetailer(retailer.address))) {
        await supplyChain.connect(owner).addRetailer(retailer.address);
      }
      if (!(await supplyChain.isConsumer(consumer.address))) {
        await supplyChain.connect(owner).addConsumer(consumer.address);
      }

      // Harvest the item for each test
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Information",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes: "Best coffee beans",
      });
    });

    it("Should correctly update item data after harvesting", async function () {
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(0); // Harvested
    });

    it("Should correctly update item data after processing", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(1); // Processed
    });

    it("Should correctly update item data after packing", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(2); // Packed
    });

    it("Should correctly update item data after selling", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(3); // For Sale
    });

    it("Should correctly update item data after buying", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: ethers.utils.parseEther("1") });
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(4); // Sold
    });

    it("Should correctly update item data after shipping", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: ethers.utils.parseEther("1") });
      await supplyChain.connect(distributor).shipItem(upc);
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(5); // Shipped
    });
  });

  describe("Event Emission Tests", function () {
    let upc; // Declare UPC variable
    const productNotes = "Best coffee beans";
    const productPrice = ethers.utils.parseEther("1");

    beforeEach(async function () {
      // Increment UPC for each test to ensure uniqueness
      upc = upc ? upc + 1 : 1;

      // Check and assign roles to the respective addresses
      if (!(await supplyChain.isFarmer(farmer.address))) {
        await supplyChain.connect(owner).addFarmer(farmer.address);
      }
      if (!(await supplyChain.isDistributor(distributor.address))) {
        await supplyChain.connect(owner).addDistributor(distributor.address);
      }
      if (!(await supplyChain.isRetailer(retailer.address))) {
        await supplyChain.connect(owner).addRetailer(retailer.address);
      }
      if (!(await supplyChain.isConsumer(consumer.address))) {
        await supplyChain.connect(owner).addConsumer(consumer.address);
      }

      // Harvest an item by farmer for each test
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Information",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes,
      });
    });

    it("Should emit Processed event when an item is processed", async function () {
      await expect(supplyChain.connect(farmer).processItem(upc))
        .to.emit(supplyChain, "Processed")
        .withArgs(upc);
    });

    it("Should emit Packed event when an item is packed", async function () {
      await supplyChain.connect(farmer).processItem(upc);

      await expect(supplyChain.connect(farmer).packItem(upc))
        .to.emit(supplyChain, "Packed")
        .withArgs(upc);
    });

    it("Should emit ForSale event when an item is put for sale", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);

      await expect(supplyChain.connect(farmer).sellItem(upc, productPrice))
        .to.emit(supplyChain, "ForSale")
        .withArgs(upc);
    });

    it("Should emit Sold event when an item is sold", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain.connect(farmer).sellItem(upc, productPrice);

      await expect(
        supplyChain.connect(distributor).buyItem(upc, { value: productPrice })
      )
        .to.emit(supplyChain, "Sold")
        .withArgs(upc);
    });

    it("Should emit Shipped event when an item is shipped", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain.connect(farmer).sellItem(upc, productPrice);
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: productPrice });

      await expect(supplyChain.connect(distributor).shipItem(upc))
        .to.emit(supplyChain, "Shipped")
        .withArgs(upc);
    });
  });

  /**
   * Tests for the emergency stop functionality in the SupplyChain contract.
   */
  describe("Emergency Stop Tests", function () {
    let owner, farmer, distributor, retailer, consumer, supplyChain;

    /**
     * Initialize the SupplyChain contract and assign the Farmer role before each test.
     */
    beforeEach(async function () {
      [owner, farmer, distributor, retailer, consumer] =
        await ethers.getSigners();
      const SupplyChain = await ethers.getContractFactory("SupplyChain");
      supplyChain = await SupplyChain.deploy();
      await supplyChain.deployed();

      // Assign the Farmer role to the farmer address
      await supplyChain.connect(owner).addFarmer(farmer.address);
    });

    /**
     * Test to verify the ability to toggle the active state of the contract.
     */
    it("Should toggle contract active state", async function () {
      // Initially, the contract is active
      expect(await supplyChain.isStopped()).to.equal(false);

      // Toggle contract to inactive
      await supplyChain.connect(owner).toggleContractActive();
      expect(await supplyChain.isStopped()).to.equal(true);

      // Toggle contract back to active
      await supplyChain.connect(owner).toggleContractActive();
      expect(await supplyChain.isStopped()).to.equal(false);
    });

    /**
     * Test to ensure actions can be performed when the contract is active.
     */
    it("Should allow actions when contract is active", async function () {
      // Ensure the contract is active
      if (await supplyChain.isStopped()) {
        await supplyChain.connect(owner).toggleContractActive();
      }

      // Perform an action (e.g., harvestItem)
      const harvestData = {
        upc: 1,
        originFarmName: "Farm",
        originFarmInformation: "Info",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes: "Best coffee beans",
      };

      await expect(supplyChain.connect(farmer).harvestItem(harvestData))
        .to.emit(supplyChain, "Harvested")
        .withArgs(1);
    });

    /**
     * Test to ensure only the owner can toggle the contract active state.
     */
    it("Should only allow owner to toggle contract active state", async function () {
      // Try to toggle contract active state by a non-owner
      await expect(
        supplyChain.connect(farmer).toggleContractActive()
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Payment and Refund Tests", function () {
    let owner,
      farmer,
      distributor,
      retailer,
      consumer,
      supplyChain,
      upc,
      productPrice;

    beforeEach(async function () {
      [owner, farmer, distributor, retailer, consumer] =
        await ethers.getSigners();
      const SupplyChain = await ethers.getContractFactory("SupplyChain");
      supplyChain = await SupplyChain.deploy();
      await supplyChain.deployed();
      upc = 1;
      productPrice = ethers.utils.parseEther("1"); // 1 ETH

      // Assign roles and prepare an item for sale
      await supplyChain.connect(owner).addFarmer(farmer.address);
      await supplyChain.connect(owner).addDistributor(distributor.address);
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Test Farm",
        originFarmInformation: "Test Info",
        originFarmLatitude: "0",
        originFarmLongitude: "0",
        productNotes: "Test Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain.connect(farmer).sellItem(upc, productPrice);
    });

    it("Should handle payments correctly when buying an item", async function () {
      // Distributor buys the item
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: productPrice });

      // Check if the state of the item is updated to Sold
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(4); // Sold state
    });

    it("Should not allow buying an item with insufficient payment", async function () {
      const insufficientAmount = ethers.utils.parseEther("0.5"); // 0.5 ETH, less than product price

      // Attempt to buy the item with insufficient amount
      await expect(
        supplyChain
          .connect(distributor)
          .buyItem(upc, { value: insufficientAmount })
      ).to.be.revertedWith("Not enough ether provided");
    });

    // Additional tests for other payment-related scenarios can be added here
  });

  describe("State Transition Tests", function () {
    let SupplyChain,
      supplyChain,
      owner,
      farmer,
      distributor,
      retailer,
      consumer,
      upc;

    beforeEach(async function () {
      [owner, farmer, distributor, retailer, consumer] =
        await ethers.getSigners();
      SupplyChain = await ethers.getContractFactory("SupplyChain");
      supplyChain = await SupplyChain.deploy();
      await supplyChain.deployed();
      upc = 1;

      // Check and assign roles to the respective addresses
      if (!(await supplyChain.isFarmer(farmer.address))) {
        await supplyChain.connect(owner).addFarmer(farmer.address);
      }
      if (!(await supplyChain.isDistributor(distributor.address))) {
        await supplyChain.connect(owner).addDistributor(distributor.address);
      }
      if (!(await supplyChain.isRetailer(retailer.address))) {
        await supplyChain.connect(owner).addRetailer(retailer.address);
      }
      if (!(await supplyChain.isConsumer(consumer.address))) {
        await supplyChain.connect(owner).addConsumer(consumer.address);
      }

      // Harvest an item
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Test Farm",
        originFarmInformation: "Test Info",
        originFarmLatitude: "0",
        originFarmLongitude: "0",
        productNotes: "Test Notes",
      });
    });

    it("Should transition from Harvested to Processed", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(1); // Processed state
    });

    it("Should transition from Processed to Packed", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(2); // Packed state
    });

    it("Should transition from Packed to ForSale", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(3); // ForSale state
    });

    it("Should transition from ForSale to Sold", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: ethers.utils.parseEther("1") });
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(4); // Sold state
    });

    it("Should transition from Sold to Shipped", async function () {
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: ethers.utils.parseEther("1") });
      await supplyChain.connect(distributor).shipItem(upc);
      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(5); // Shipped state
    });

    // Additional tests for invalid state transitions can be added here
  });

  describe("Edge Case Tests", function () {
    let SupplyChain,
      supplyChain,
      owner,
      farmer,
      distributor,
      retailer,
      consumer,
      upc;

    beforeEach(async function () {
      [owner, farmer, distributor, retailer, consumer] =
        await ethers.getSigners();
      SupplyChain = await ethers.getContractFactory("SupplyChain");
      supplyChain = await SupplyChain.deploy();
      await supplyChain.deployed();
      upc = 1;

      // Assign roles
      await supplyChain.connect(owner).addFarmer(farmer.address);
      await supplyChain.connect(owner).addDistributor(distributor.address);
      await supplyChain.connect(owner).addRetailer(retailer.address);
      await supplyChain.connect(owner).addConsumer(consumer.address);
    });

    it("Should fail if a non-farmer tries to harvest an item", async function () {
      await expect(
        supplyChain.connect(consumer).harvestItem({
          upc,
          originFarmName: "Test Farm",
          originFarmInformation: "Test Info",
          originFarmLatitude: "0",
          originFarmLongitude: "0",
          productNotes: "Test Notes",
        })
      ).to.be.revertedWith("Caller is not a farmer");
    });

    it("Should fail if an item is processed before being harvested", async function () {
      await expect(
        supplyChain.connect(farmer).processItem(upc)
      ).to.be.revertedWith(
        "Only the farmer who harvested can process this item"
      );
    });

    it("Should fail if an item is packed before being processed", async function () {
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Test Farm",
        originFarmInformation: "Test Info",
        originFarmLatitude: "0",
        originFarmLongitude: "0",
        productNotes: "Test Notes",
      });
      await expect(
        supplyChain.connect(farmer).packItem(upc)
      ).to.be.revertedWith("Item not processed");
    });

    it("Should fail if an item is sold before being packed", async function () {
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Test Farm",
        originFarmInformation: "Test Info",
        originFarmLatitude: "0",
        originFarmLongitude: "0",
        productNotes: "Test Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await expect(
        supplyChain.connect(farmer).sellItem(upc, ethers.utils.parseEther("1"))
      ).to.be.revertedWith("Item not packed");
    });

    it("Should fail if a non-distributor tries to buy an item", async function () {
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Test Farm",
        originFarmInformation: "Test Info",
        originFarmLatitude: "0",
        originFarmLongitude: "0",
        productNotes: "Test Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      await expect(
        supplyChain
          .connect(consumer)
          .buyItem(upc, { value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Caller is not a distributor");
    });

    it("Should fail if an item is shipped before being sold", async function () {
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Test Farm",
        originFarmInformation: "Test Info",
        originFarmLatitude: "0",
        originFarmLongitude: "0",
        productNotes: "Test Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      await expect(
        supplyChain.connect(distributor).shipItem(upc)
      ).to.be.revertedWith("Item not sold");
    });

    it("Should fail if a non-retailer tries to receive a shipped item", async function () {
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Test Farm",
        originFarmInformation: "Test Info",
        originFarmLatitude: "0",
        originFarmLongitude: "0",
        productNotes: "Test Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: ethers.utils.parseEther("1") });
      await supplyChain.connect(distributor).shipItem(upc);
      await expect(
        supplyChain.connect(consumer).receiveItem(upc)
      ).to.be.revertedWith("Caller is not a retailer");
    });

    it("Should fail if an item is purchased before being received", async function () {
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Test Farm",
        originFarmInformation: "Test Info",
        originFarmLatitude: "0",
        originFarmLongitude: "0",
        productNotes: "Test Notes",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain
        .connect(farmer)
        .sellItem(upc, ethers.utils.parseEther("1"));
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: ethers.utils.parseEther("1") });
      await supplyChain.connect(distributor).shipItem(upc);
      await expect(
        supplyChain.connect(consumer).purchaseItem(upc)
      ).to.be.revertedWith("Item not received");
    });
  });

  /**
   * Tests for handling multiple items in the SupplyChain contract.
   */
  describe("Multiple Items Handling", function () {
    it("Should handle multiple items correctly", async function () {
      // Harvest two different items
      await supplyChain.connect(farmer).harvestItem({
        upc: 1,
        originFarmName: "Farm1",
        originFarmInformation: "Info1",
        originFarmLatitude: "Lat1",
        originFarmLongitude: "Long1",
        productNotes: "Notes1",
      });

      await supplyChain.connect(farmer).harvestItem({
        upc: 2,
        originFarmName: "Farm2",
        originFarmInformation: "Info2",
        originFarmLatitude: "Lat2",
        originFarmLongitude: "Long2",
        productNotes: "Notes2",
      });

      // Check that the items are correctly recorded and independent
      const item1Data = await supplyChain.fetchItemBufferOne(1);
      const item2Data = await supplyChain.fetchItemBufferOne(2);

      expect(item1Data.originFarmName).to.equal("Farm1");
      expect(item2Data.originFarmName).to.equal("Farm2");
    });
  });

  /**
   * Tests for various fetch functions in the SupplyChain contract.
   */
  describe("Fetch Function Tests", function () {
    let upc; // Declare UPC variable

    beforeEach(async function () {
      // Increment UPC for each test to ensure uniqueness
      upc = upc ? upc + 1 : 1;

      // Harvest an item by farmer for each test
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Information",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes: "Best coffee beans",
      });
    });

    it("Should fetch correct data from fetchItemBufferOne", async function () {
      const itemData = await supplyChain.fetchItemBufferOne(upc);
      expect(itemData.originFarmName).to.equal("Farm");
      expect(itemData.originFarmInformation).to.equal("Information");
      expect(itemData.originFarmLatitude).to.equal("Lat");
      expect(itemData.originFarmLongitude).to.equal("Long");
      // Add more assertions as needed
    });

    it("Should fetch correct data from fetchItemBufferTwo", async function () {
      const itemData = await supplyChain.fetchItemBufferTwo(upc);
      expect(itemData.productNotes).to.equal("Best coffee beans");
      expect(itemData.itemState).to.equal(0); // Harvested
      // Add more assertions as needed
    });

    it("Should fetch correct origin data", async function () {
      const originData = await supplyChain.fetchOriginData(upc);
      expect(originData.originFarmName).to.equal("Farm");
      // Add more assertions as needed
    });

    it("Should fetch correct product data", async function () {
      const productData = await supplyChain.fetchProductData(upc);
      expect(productData.productNotes).to.equal("Best coffee beans");
      // Add more assertions as needed
    });

    it("Should fetch correct item history", async function () {
      const itemHistory = await supplyChain.fetchItemHistory(upc);
      // Add assertions to check the history data
      // This depends on how your item history is structured
    });

    // Add more tests for other fetch functions as needed
  });

  /**
   * Tests for item receiving and purchasing functionalities in the SupplyChain contract.
   */
  describe("Item Receiving and Purchasing Tests", function () {
    let upc; // Declare UPC variable
    const productPrice = ethers.utils.parseEther("1"); // 1 ETH

    beforeEach(async function () {
      // Increment UPC for each test to ensure uniqueness
      upc = upc ? upc + 1 : 1;

      // Harvest, process, pack, sell, buy, and ship an item for each test
      await supplyChain.connect(farmer).harvestItem({
        upc,
        originFarmName: "Farm",
        originFarmInformation: "Information",
        originFarmLatitude: "Lat",
        originFarmLongitude: "Long",
        productNotes: "Best coffee beans",
      });
      await supplyChain.connect(farmer).processItem(upc);
      await supplyChain.connect(farmer).packItem(upc);
      await supplyChain.connect(farmer).sellItem(upc, productPrice);
      await supplyChain
        .connect(distributor)
        .buyItem(upc, { value: productPrice });
      await supplyChain.connect(distributor).shipItem(upc);
    });

    it("Should allow a retailer to receive an item", async function () {
      await expect(
        supplyChain.connect(retailer).receiveItem(upc, { value: productPrice })
      )
        .to.emit(supplyChain, "Received")
        .withArgs(upc);

      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(6); // Received state
    });

    it("Should prevent non-retailers from receiving an item", async function () {
      await expect(
        supplyChain.connect(consumer).receiveItem(upc)
      ).to.be.revertedWith("Caller is not a retailer");
    });

    it("Should allow a consumer to purchase an item", async function () {
      // First, the item must be received by the retailer
      await supplyChain
        .connect(retailer)
        .receiveItem(upc, { value: productPrice });

      await expect(
        supplyChain.connect(consumer).purchaseItem(upc, { value: productPrice })
      )
        .to.emit(supplyChain, "Purchased")
        .withArgs(upc);

      const item = await supplyChain.fetchItemBufferTwo(upc);
      expect(item.itemState).to.equal(7); // Purchased state
    });

    it("Should prevent non-consumers from purchasing an item", async function () {
      // First, the item must be received by the retailer
      await supplyChain
        .connect(retailer)
        .receiveItem(upc, { value: productPrice });

      await expect(
        supplyChain.connect(retailer).purchaseItem(upc)
      ).to.be.revertedWith("Caller is not a consumer");
    });
  });

  /**
   * Tests for the circuit breaker functionality in the SupplyChain contract.
   */
  describe("SupplyChain with Circuit Breaker", function () {
    let SupplyChain, supplyChain;
    let owner, farmer, distributor, consumer;

    beforeEach(async function () {
      [owner, farmer, distributor, consumer] = await ethers.getSigners();

      SupplyChain = await ethers.getContractFactory("SupplyChain");
      supplyChain = await SupplyChain.deploy();
      await supplyChain.deployed();

      // Add roles
      await supplyChain.connect(owner).addFarmer(farmer.address);
      await supplyChain.connect(owner).addDistributor(distributor.address);
      await supplyChain.connect(owner).addConsumer(consumer.address);
    });

    it("Should halt contract functions when circuit breaker is activated", async function () {
      const upc = 1;

      // Activate the circuit breaker
      await supplyChain.connect(owner).toggleContractActive();
      expect(await supplyChain.isStopped()).to.equal(true);

      // Attempt to perform various contract actions
      await expect(
        supplyChain.connect(farmer).harvestItem({
          upc,
          originFarmName: "Test Farm",
          originFarmInformation: "Test Info",
          originFarmLatitude: "0",
          originFarmLongitude: "0",
          productNotes: "Test Notes",
        })
      ).to.be.revertedWith("Contract is stopped");

      // ... add similar checks for other functions that should be halted
    });

    it("Should resume contract functions when circuit breaker is deactivated", async function () {
      // Activate then deactivate the circuit breaker
      await supplyChain.connect(owner).toggleContractActive();
      await supplyChain.connect(owner).toggleContractActive();
      expect(await supplyChain.isStopped()).to.equal(false);

      // Attempt to perform a contract action
      const upc = 2;
      await expect(
        supplyChain.connect(farmer).harvestItem({
          upc,
          originFarmName: "Test Farm",
          originFarmInformation: "Test Info",
          originFarmLatitude: "0",
          originFarmLongitude: "0",
          productNotes: "Test Notes",
        })
      ).not.to.be.reverted;
    });
  });
});
