const { ethers } = require("hardhat");

/**
 * Main function that deploys the Ownable contract.
 */
async function main() {
  /**
   * Compiles all contracts in the project, if necessary.
   */
  await hre.run("compile");

  /**
   * Deploying the Ownable contract.
   */
  const Ownable = await ethers.getContractFactory("Ownable");
  const ownable = await Ownable.deploy();

  await ownable.deployed();

  console.log("Ownable contract deployed to:", ownable.address);
}

// Execution and error handling for the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


  /* 
Draft a detailed explanation of what the supply chain test code does.   Rewrite this in JSDoc Comments:  */