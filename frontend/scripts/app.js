/**
 * Global variables to hold instances of web3, the supply chain contract, and the user account.
 */
let web3;
let supplyChain;
let userAccount;
const supplyChainAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "ConsumerAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "ConsumerRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "DistributorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "DistributorRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "FarmerAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "FarmerRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "upc",
        type: "uint256",
      },
    ],
    name: "ForSale",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "upc",
        type: "uint256",
      },
    ],
    name: "Harvested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "upc",
        type: "uint256",
      },
    ],
    name: "Packed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "upc",
        type: "uint256",
      },
    ],
    name: "Processed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "upc",
        type: "uint256",
      },
    ],
    name: "Purchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "upc",
        type: "uint256",
      },
    ],
    name: "Received",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "RetailerAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "RetailerRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "upc",
        type: "uint256",
      },
    ],
    name: "Shipped",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "upc",
        type: "uint256",
      },
    ],
    name: "Sold",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "addConsumer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "addDistributor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "addFarmer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "addRetailer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "buyItem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "fetchItemBufferOne",
    outputs: [
      {
        internalType: "uint256",
        name: "itemSKU",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "itemUPC",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "ownerID",
        type: "address",
      },
      {
        internalType: "address",
        name: "originFarmerID",
        type: "address",
      },
      {
        internalType: "string",
        name: "originFarmName",
        type: "string",
      },
      {
        internalType: "string",
        name: "originFarmInformation",
        type: "string",
      },
      {
        internalType: "string",
        name: "originFarmLatitude",
        type: "string",
      },
      {
        internalType: "string",
        name: "originFarmLongitude",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "fetchItemBufferTwo",
    outputs: [
      {
        internalType: "uint256",
        name: "itemSKU",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "itemUPC",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "productID",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "productNotes",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "productPrice",
        type: "uint256",
      },
      {
        internalType: "enum SupplyChain.State",
        name: "itemState",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "distributorID",
        type: "address",
      },
      {
        internalType: "address",
        name: "retailerID",
        type: "address",
      },
      {
        internalType: "address",
        name: "consumerID",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "fetchItemHistory",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "fetchOriginData",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "originFarmerID",
            type: "address",
          },
          {
            internalType: "string",
            name: "originFarmName",
            type: "string",
          },
          {
            internalType: "string",
            name: "originFarmInformation",
            type: "string",
          },
          {
            internalType: "string",
            name: "originFarmLatitude",
            type: "string",
          },
          {
            internalType: "string",
            name: "originFarmLongitude",
            type: "string",
          },
        ],
        internalType: "struct SupplyChain.OriginData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "fetchProductData",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "productID",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "productNotes",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "productPrice",
            type: "uint256",
          },
        ],
        internalType: "struct SupplyChain.ProductData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "upc",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "originFarmName",
            type: "string",
          },
          {
            internalType: "string",
            name: "originFarmInformation",
            type: "string",
          },
          {
            internalType: "string",
            name: "originFarmLatitude",
            type: "string",
          },
          {
            internalType: "string",
            name: "originFarmLongitude",
            type: "string",
          },
          {
            internalType: "string",
            name: "productNotes",
            type: "string",
          },
        ],
        internalType: "struct SupplyChain.HarvestData",
        name: "data",
        type: "tuple",
      },
    ],
    name: "harvestItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isConsumer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isDistributor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isFarmer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isOwner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isRetailer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isStopped",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "items",
    outputs: [
      {
        internalType: "uint256",
        name: "sku",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "upc",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "ownerID",
        type: "address",
      },
      {
        internalType: "enum SupplyChain.State",
        name: "itemState",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "distributorID",
        type: "address",
      },
      {
        internalType: "address",
        name: "retailerID",
        type: "address",
      },
      {
        internalType: "address",
        name: "consumerID",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "itemsHistory",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "originData",
    outputs: [
      {
        internalType: "address",
        name: "originFarmerID",
        type: "address",
      },
      {
        internalType: "string",
        name: "originFarmName",
        type: "string",
      },
      {
        internalType: "string",
        name: "originFarmInformation",
        type: "string",
      },
      {
        internalType: "string",
        name: "originFarmLatitude",
        type: "string",
      },
      {
        internalType: "string",
        name: "originFarmLongitude",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "packItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "processItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "productData",
    outputs: [
      {
        internalType: "uint256",
        name: "productID",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "productNotes",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "productPrice",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "purchaseItem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "receiveItem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceConsumer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceDistributor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceFarmer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceRetailer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "sellItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_upc",
        type: "uint256",
      },
    ],
    name: "shipItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sku",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "toggleContractActive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "upc",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]; // ABI for the supply chain contract

const supplyChainAddress = "0xd9D29e8a4E257A8813FF1E8CA1814C742ABb75BD"; // Supply chain contract address

/**
 * Initialize Web3 and set up the contract.
 * Connects to the user's MetaMask account and initializes the supply chain contract.
 */
async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await initContract();
    } catch (error) {
      console.error("User denied account access or other error:", error);
      // Handle the error appropriately
      // For example: Inform the user that account access was denied or a connection issue occurred
      alert("Error: " + error.message); // This is a simple way to inform the user
    }
  } else {
    console.error("Please install MetaMask!");
    // Inform the user that MetaMask is required for this application
    alert("MetaMask is required to use this application.");
  }
}

/**
 * Set up user interface event listeners.
 * Connects various UI elements with corresponding event handlers.
 */
function setupUIEventListeners() {
  // Setup event listeners related to role management
  setupRoleManagementListeners();

  // Setup event listeners for the farmer functionalities
  setupFarmerEventListeners();

  // Setup event listeners for the distributor functionalities
  setupDistributorEventListeners();

  // Setup event listeners for the retailer functionalities
  setupRetailerEventListeners();

  // Setup event listeners for the consumer functionalities
  setupConsumerEventListeners();

  // Event listener for the Connect to MetaMask button
  document
    .getElementById("connectMetamask")
    .addEventListener("click", initWeb3);
  // Add additional event listener setup calls here as needed
}

/**
 * Initialize the supply chain contract.
 * Creates an instance of the contract and sets the current user account.
 */
async function initContract() {
  try {
    supplyChain = new web3.eth.Contract(supplyChainAbi, supplyChainAddress);
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.error("No accounts found. Make sure MetaMask is connected.");
      return;
    }
    userAccount = accounts[0];
    console.log("Contract initialized", supplyChain);
    console.log("User Account:", userAccount);
    updateUI();
    //setupUIEventListeners()
    listenForEvents();
  } catch (error) {
    console.error("Error initializing contract:", error);
  }
}

// Event Listeners and Handlers
const eventTypes = [
  "Harvested",
  "Processed",
  "Packed",
  "ForSale",
  "Sold",
  "Shipped",
  "Received",
  "Purchased",
];

/**
 * Listen for events emitted by the supply chain contract.
 * Sets up listeners for different event types and handles them.
 */
function listenForEvents() {
  eventTypes.forEach((eventType) => {
    supplyChain.events[eventType]({ fromBlock: 0 }, (error, event) => {
      if (error) {
        console.error(`Error in ${eventType} event listener`, error);
      } else {
        console.log(`${eventType} Event Emitted`, event);
        handleEvent(event, eventType);
      }
    });
  });
}

/**
 * Handle a specific event emitted by the contract.
 * @param {Object} event - The event object emitted by the contract.
 * @param {string} eventName - The name of the event.
 */
function handleEvent(event, eventName) {
  console.log(`Handling ${eventName} event`, event);
}

/**
 * Update the user interface based on the current user account and roles.
 * Modifies UI elements to reflect the current state and user permissions.
 */
function updateUI() {
  // Example: Update UI elements based on the connected user account
  const userAccountDisplay = document.getElementById("userAccount");

  const metaMaskButton = document.getElementById("connectMetamask");

  if (userAccount) {
    userAccountDisplay.textContent = `Connected Account: ${userAccount}`;
    // Hide the Connect to MetaMask button after successful connection
    metaMaskButton.style.display = "none";
    // Additional UI updates based on user account
  } else {
    userAccountDisplay.textContent = "Not connected";
    metaMaskButton.style.display = "block";
  }

  // Call the role check function to update UI based on user role
  checkUserRoleAndUpdateUI();
}

/**
 * Check the role of the user and update the UI accordingly.
 * Queries the contract to determine the user's roles and updates the UI.
 */
async function checkUserRoleAndUpdateUI() {
  try {
    const isAdmin = await supplyChain.methods
      .isOwner()
      .call({ from: userAccount });

    // Display all sections for the admin
    if (isAdmin) {
      document.getElementById("farmerSection").style.display = "block";
      document.getElementById("distributorSection").style.display = "block";
      document.getElementById("retailerSection").style.display = "block";
      document.getElementById("consumerSection").style.display = "block";
      document.getElementById("adminPanelSection").style.display = "block";
    } else {
      // Check and display sections for other roles
      const isFarmer = await supplyChain.methods.isFarmer(userAccount).call();
      const isDistributor = await supplyChain.methods
        .isDistributor(userAccount)
        .call();
      const isRetailer = await supplyChain.methods
        .isRetailer(userAccount)
        .call();
      const isConsumer = await supplyChain.methods
        .isConsumer(userAccount)
        .call();

      document.getElementById("farmerSection").style.display = isFarmer
        ? "block"
        : "none";
      document.getElementById("distributorSection").style.display =
        isDistributor ? "block" : "none";
      document.getElementById("retailerSection").style.display = isRetailer
        ? "block"
        : "none";
      document.getElementById("consumerSection").style.display = isConsumer
        ? "block"
        : "none";
      document.getElementById("adminPanelSection").style.display = "none"; // Hide admin panel for non-admin users
    }
  } catch (error) {
    console.error("Error checking user role:", error);
    // Handle errors, for example, show an error message to the user
  }
}

/**
 * Display a message to the user.
 * @param {string} message - The message to be displayed.
 * @param {boolean} isError - Whether the message is an error.
 */
function showMessage(message, isError = false) {
  const messageElement = document.getElementById("transactionStatus");
  messageElement.textContent = message;
  messageElement.className = isError
    ? "alert alert-danger"
    : "alert alert-success";
  messageElement.style.display = "block";
}

/**
 * Validate user input.
 * @param {string} input - The input to be validated.
 * @param {string} inputType - The type of input (e.g., "text", "address", "number").
 * @returns {boolean} - True if the input is valid, false otherwise.
 */
function isInputValid(input, inputType = "text") {
  if (!input || input.trim() === "") {
    console.error("Input is empty");
    return false;
  }

  // Ethereum Address Validation
  if (inputType === "address" && !web3.utils.isAddress(input)) {
    console.error("Invalid Ethereum address");
    return false;
  }

  // Number Validation for UPC and Price fields
  if (inputType === "number") {
    const number = parseFloat(input);
    if (isNaN(number) || number <= 0) {
      console.error("Invalid number input");
      return false;
    }
  }

  // Latitude and Longitude Validation
  if (inputType === "coordinate") {
    const number = parseFloat(input);
    if (isNaN(number) || number < -180 || number > 180) {
      console.error("Invalid coordinate input");
      return false;
    }
  }

  return true;
}

/**
 * Event listener for fetching and displaying item details.
 */
document.getElementById("showDetailsBtn").addEventListener("click", () => {
  const upc = document.getElementById("detailsItemUPC").value;
  fetchDataAndDisplay(upc);
});

/**
 * Event listener for fetching and displaying item history.
 */
document.getElementById("trackItemBtn").addEventListener("click", () => {
  const upc = document.getElementById("trackItemUPC").value;
  fetchHistoryAndDisplay(upc);
});

/**
 * Fetches data of an item and displays it.
 * @param {string} upc - The UPC of the item to fetch data for.
 */
async function fetchDataAndDisplay(upc) {
  // Show loading spinner
  document.getElementById("detailsLoadingSpinner").style.display =
    "inline-block";

  if (!isInputValid(upc, "number")) {
    showMessage("Invalid UPC", true);
    document.getElementById("detailsLoadingSpinner").style.display = "none"; // Hide spinner
    return;
  }
  try {
    const itemBufferOne = await supplyChain.methods
      .fetchItemBufferOne(upc)
      .call();
    const itemBufferTwo = await supplyChain.methods
      .fetchItemBufferTwo(upc)
      .call();
    displayItemData(itemBufferOne, itemBufferTwo);
  } catch (error) {
    console.error("Error fetching item data:", error);
    showMessage("Error fetching item data: " + error.message, true);
  } finally {
    document.getElementById("detailsLoadingSpinner").style.display = "none"; // Hide spinner
  }
}

/**
 * Fetches history of an item and displays it.
 * @param {string} upc - The UPC of the item to fetch history for.
 */
async function fetchHistoryAndDisplay(upc) {
  // Show loading spinner
  document.getElementById("historyLoadingSpinner").style.display =
    "inline-block";

  if (!isInputValid(upc, "number")) {
    showMessage("Invalid UPC", true);
    document.getElementById("historyLoadingSpinner").style.display = "none"; // Hide spinner
    return;
  }
  try {
    const history = await supplyChain.methods.fetchItemHistory(upc).call();
    displayHistoryData(upc, history);
  } catch (error) {
    console.error("Error fetching history:", error);
    showMessage("Error fetching history: " + error.message, true);
  } finally {
    document.getElementById("historyLoadingSpinner").style.display = "none"; // Hide spinner
  }
}

/**
 * Displays detailed information of an item.
 * @param {Object} itemBufferOne - First part of the item data.
 * @param {Object} itemBufferTwo - Second part of the item data.
 */
function displayItemData(itemBufferOne, itemBufferTwo) {
  const detailsHTML = `
      <h4>Item Origin Details</h4>
      <p>SKU: ${itemBufferOne.itemSKU}</p>
      <p>UPC: ${itemBufferOne.itemUPC}</p>
      <p>Owner ID: ${itemBufferOne.ownerID}</p>
      <p>Farmer ID: ${itemBufferOne.originFarmerID}</p>
      <p>Farm Name: ${itemBufferOne.originFarmName}</p>
      <p>Farm Information: ${itemBufferOne.originFarmInformation}</p>
      <p>Farm Latitude: ${itemBufferOne.originFarmLatitude}</p>
      <p>Farm Longitude: ${itemBufferOne.originFarmLongitude}</p>
      <h4>Product Details</h4>
      <p>Product ID: ${itemBufferTwo.productID}</p>
      <p>Product Notes: ${itemBufferTwo.productNotes}</p>
      <p>Product Price: ${itemBufferTwo.productPrice}</p>
      <p>Item State: ${itemBufferTwo.itemState}</p>
      <p>Distributor ID: ${itemBufferTwo.distributorID}</p>
      <p>Retailer ID: ${itemBufferTwo.retailerID}</p>
      <p>Consumer ID: ${itemBufferTwo.consumerID}</p>
  `;

  document.getElementById("itemDetailsResult").innerHTML = detailsHTML;
}

/**
 * Displays the history of an item.
 * @param {string} upc - The UPC of the item.
 * @param {Array} history - Array of history records of the item.
 */
function displayHistoryData(upc, history) {
  let historyHTML = `<h4>History for UPC: ${upc}</h4><ul>`;
  history.forEach((action) => {
    historyHTML += `<li>${action}</li>`;
  });
  historyHTML += `</ul>`;

  document.getElementById("itemHistoryResult").innerHTML = historyHTML;
}

// Consolidated Role Management Functions

/**
 * Adds a user role to the supply chain contract.
 * @param {string} roleType - The type of role to add (e.g., "Farmer", "Distributor").
 * @param {string} account - Ethereum address to add the role to.
 */
async function addUserRole(roleType, account) {
  const spinnerId = `add${roleType}Spinner`; // Correct spinner ID
  const spinnerElement = document.getElementById(spinnerId);

  if (!isInputValid(account, "address")) {
    showMessage("Invalid Ethereum address", true);
    return;
  }

  spinnerElement.style.display = "inline-block"; // Show spinner

  let method;
  switch (roleType) {
    case "Farmer":
      method = supplyChain.methods.addFarmer(account);
      break;
    case "Distributor":
      method = supplyChain.methods.addDistributor(account);
      break;
    case "Retailer":
      method = supplyChain.methods.addRetailer(account);
      break;
    case "Consumer":
      method = supplyChain.methods.addConsumer(account);
      break;
    default:
      showMessage("Invalid role type", true);
      return;
  }

  try {
    await method.send({ from: userAccount });
    showMessage(`${roleType} role added successfully`, false);
  } catch (error) {
    console.error(`Error adding ${roleType} role:`, error);
    showMessage(`Error adding ${roleType} role: ${error.message}`, true);
  } finally {
    spinnerElement.style.display = "none"; // Hide spinner after operation
  }
}

/**
 * Removes a user role from the supply chain contract.
 * @param {string} roleType - The type of role to remove (e.g., "Farmer", "Distributor").
 * @param {string} account - Ethereum address to remove the role from.
 */
async function removeUserRole(roleType, account) {
  const spinnerId = `remove${roleType}Spinner`; // Correct spinner ID
  const spinnerElement = document.getElementById(spinnerId);

  if (!isInputValid(account, "address")) {
    showMessage("Invalid Ethereum address", true);
    return;
  }

  spinnerElement.style.display = "inline-block"; // Show spinner

  let method;
  switch (roleType) {
    case "Farmer":
      method = supplyChain.methods.removeFarmer(account);
      break;
    case "Distributor":
      method = supplyChain.methods.removeDistributor(account);
      break;
    case "Retailer":
      method = supplyChain.methods.removeRetailer(account);
      break;
    case "Consumer":
      method = supplyChain.methods.removeConsumer(account);
      break;
    default:
      showMessage("Invalid role type", true);
      return;
  }

  try {
    await method.send({ from: userAccount });
    showMessage(`${roleType} role removed successfully`, false);
  } catch (error) {
    console.error(`Error removing ${roleType} role:`, error);
    showMessage(`Error removing ${roleType} role: ${error.message}`, true);
  } finally {
    spinnerElement.style.display = "none"; // Hide spinner after operation
  }
}

// Event Listener Setup Functions

/**
 * Sets up event listeners for role management functionalities.
 */
function setupRoleManagementListeners() {
  // Event listeners for adding roles
  document
    .getElementById("addFarmerBtn")
    .addEventListener("click", () =>
      addUserRole("Farmer", document.getElementById("addFarmerAddress").value)
    );
  document
    .getElementById("addDistributorBtn")
    .addEventListener("click", () =>
      addUserRole(
        "Distributor",
        document.getElementById("addDistributorAddress").value
      )
    );
  document
    .getElementById("addRetailerBtn")
    .addEventListener("click", () =>
      addUserRole(
        "Retailer",
        document.getElementById("addRetailerAddress").value
      )
    );
  document
    .getElementById("addConsumerBtn")
    .addEventListener("click", () =>
      addUserRole(
        "Consumer",
        document.getElementById("addConsumerAddress").value
      )
    );

  // Event listeners for removing roles
  document
    .getElementById("removeFarmerBtn")
    .addEventListener("click", () =>
      removeUserRole(
        "Farmer",
        document.getElementById("removeFarmerAddress").value
      )
    );
  document
    .getElementById("removeDistributorBtn")
    .addEventListener("click", () =>
      removeUserRole(
        "Distributor",
        document.getElementById("removeDistributorAddress").value
      )
    );
  document
    .getElementById("removeRetailerBtn")
    .addEventListener("click", () =>
      removeUserRole(
        "Retailer",
        document.getElementById("removeRetailerAddress").value
      )
    );
  document
    .getElementById("removeConsumerBtn")
    .addEventListener("click", () =>
      removeUserRole(
        "Consumer",
        document.getElementById("removeConsumerAddress").value
      )
    );
}

/**
 * Sets up event listeners for farmer functionalities.
 */
function setupFarmerEventListeners() {
  // Listener for harvesting an item
  document
    .getElementById("harvestItemForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      harvestItem();
    });

  // Listener for processing an item
  document.getElementById("processItemBtn").addEventListener("click", () => {
    const upc = document.getElementById("farmerUPC").value;
    processItem(upc);
  });

  // Listener for packing an item
  document.getElementById("packItemBtn").addEventListener("click", () => {
    const upc = document.getElementById("farmerUPC").value;
    packItem(upc);
  });

  // Listener for selling an item
  document
    .getElementById("sellItemForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const upc = document.getElementById("sellUPC").value;
      const price = document.getElementById("sellPrice").value;
      sellItem(upc, price);
    });
}

/**
 * Sets up event listeners for distributor functionalities.
 */
function setupDistributorEventListeners() {
  // Listener for buying an item
  document.getElementById("buyItemBtn").addEventListener("click", () => {
    const upc = document.getElementById("buyItemUPC").value;
    buyItem(upc);
  });

  // Listener for shipping an item
  document.getElementById("shipItemBtn").addEventListener("click", () => {
    const upc = document.getElementById("shipItemUPC").value;
    shipItem(upc);
  });
}

/**
 * Sets up event listeners for retailer functionalities.
 */
function setupRetailerEventListeners() {
  // Listener for receiving an item
  document.getElementById("receiveItemBtn").addEventListener("click", () => {
    const upc = document.getElementById("receiveItemUPC").value;
    receiveItem(upc);
  });
}

/**
 * Sets up event listeners for consumer functionalities.
 */
function setupConsumerEventListeners() {
  // Listener for purchasing an item
  document.getElementById("purchaseItemBtn").addEventListener("click", () => {
    const upc = document.getElementById("purchaseItemUPC").value;
    purchaseItem(upc);
  });
}

// Main Supply Chain Actions

/**
 * Harvests an item and adds it to the supply chain.
 */
async function harvestItem() {
  // Show the loading spinner
  const harvestSpinner = document.getElementById("harvestSpinner");
  harvestSpinner.style.display = "inline-block";

  // Get form values
  const upc = document.getElementById("harvestUPC").value;
  const originFarmName = document.getElementById("originFarmName").value;
  const originFarmInformation = document.getElementById(
    "originFarmInformation"
  ).value;
  const originFarmLatitude =
    document.getElementById("originFarmLatitude").value;
  const originFarmLongitude = document.getElementById(
    "originFarmLongitude"
  ).value;
  const productNotes = document.getElementById("productNotes").value;

  // Validate input
  if (
    !upc ||
    !originFarmName ||
    !originFarmInformation ||
    !originFarmLatitude ||
    !originFarmLongitude ||
    !productNotes
  ) {
    showMessage("All fields are required.", true);
    harvestSpinner.style.display = "none";
    return;
  }

  if (
    !isInputValid(upc, "number") ||
    !isInputValid(originFarmLatitude, "coordinate") ||
    !isInputValid(originFarmLongitude, "coordinate")
  ) {
    showMessage("Invalid input in one of the fields.", true);
    harvestSpinner.style.display = "none";
    return;
  }

  try {
    // Call the smart contract function
    await supplyChain.methods
      .harvestItem({
        upc: upc,
        originFarmName: originFarmName,
        originFarmInformation: originFarmInformation,
        originFarmLatitude: originFarmLatitude,
        originFarmLongitude: originFarmLongitude,
        productNotes: productNotes,
      })
      .send({ from: userAccount });

    showMessage("Item harvested successfully.", false);

    // Optionally, clear the form fields after successful submission
    document.getElementById("harvestItemForm").reset();
  } catch (error) {
    console.error("Error while harvesting item:", error);
    showMessage("Failed to harvest item. Error: " + error.message, true);
  } finally {
    // Hide the loading spinner regardless of the outcome
    harvestSpinner.style.display = "none";
  }
}

/**
 * Processes an item in the supply chain.
 * @param {string} upc - The UPC of the item to process.
 */
async function processItem(upc) {
  //const upc = document.getElementById("farmerUPC").value;
  const processSpinner = document.getElementById("processItemSpinner");

  if (!upc) {
    showMessage("UPC is required", true);
    return;
  }

  if (!isInputValid(upc, "number")) {
    showMessage("Invalid UPC", true);
    return;
  }

  try {
    processSpinner.style.display = "inline-block"; // Show spinner
    await supplyChain.methods.processItem(upc).send({ from: userAccount });
    showMessage("Item processed successfully", false);
  } catch (error) {
    console.error("Error processing item:", error);
    showMessage("Error processing item: " + error.message, true);
  } finally {
    processSpinner.style.display = "none"; // Hide spinner
  }
}

/**
 * Packs an item in the supply chain.
 * @param {string} upc - The UPC of the item to pack.
 */
async function packItem(upc) {
  // const upc = document.getElementById("farmerUPC").value;
  const packSpinner = document.getElementById("packItemSpinner");

  if (!upc) {
    showMessage("UPC is required", true);
    return;
  }

  if (!isInputValid(upc, "number")) {
    showMessage("Invalid UPC", true);
    return;
  }

  try {
    packSpinner.style.display = "inline-block"; // Show spinner
    await supplyChain.methods.packItem(upc).send({ from: userAccount });
    showMessage("Item packed successfully", false);
  } catch (error) {
    console.error("Error packing item:", error);
    showMessage("Error packing item: " + error.message, true);
  } finally {
    packSpinner.style.display = "none"; // Hide spinner
  }
}

/**
 * Puts an item up for sale in the supply chain.
 * @param {string} upc - The UPC of the item to sell.
 * @param {string} price - The selling price of the item.
 */
async function sellItem(upc, price) {
  const sellSpinner = document.getElementById("sellItemSpinner");

  //const upc = document.getElementById("sellUPC").value;
  //const price = document.getElementById("sellPrice").value;

  if (!upc || !price) {
    showMessage("UPC and Price are required", true);
    return;
  }

  if (!isInputValid(upc, "number") || !isInputValid(price, "number")) {
    showMessage("Invalid UPC or Price", true);
    return;
  }

  try {
    sellSpinner.style.display = "inline-block"; // Show spinner
    const priceInWei = web3.utils.toWei(price, "ether");
    await supplyChain.methods
      .sellItem(upc, priceInWei)
      .send({ from: userAccount });
    showMessage("Item put up for sale successfully", false);
    document.getElementById("sellItemForm").reset();
  } catch (error) {
    console.error("Error selling item:", error);
    showMessage("Failed to sell item. Please try again.", true); // More user-friendly error message
  } finally {
    sellSpinner.style.display = "none"; // Hide spinner regardless of outcome
  }
}

/**
 * Buys an item from the supply chain.
 * @param {string} upc - The UPC of the item to buy.
 */
async function buyItem(upc) {
  const buySpinner = document.getElementById("buyItemSpinner");

  // const upc = document.getElementById("buyItemUPC").value;

  if (!upc) {
    showMessage("UPC is required", true);
    return;
  }

  if (!isInputValid(upc, "number")) {
    showMessage("Invalid UPC", true);
    return;
  }

  try {
    buySpinner.style.display = "inline-block"; // Show spinner
    const itemBufferTwo = await supplyChain.methods
      .fetchItemBufferTwo(upc)
      .call();
    const priceInWei = itemBufferTwo.productPrice; // Using productPrice from itemBufferTwo
    await supplyChain.methods
      .buyItem(upc)
      .send({ from: userAccount, value: priceInWei });
    showMessage("Item bought successfully", false);
  } catch (error) {
    console.error("Error buying item:", error);
    showMessage("Failed to buy item. Please try again.", true);
  } finally {
    buySpinner.style.display = "none"; // Hide spinner regardless of outcome
  }
}

/**
 * Ships an item in the supply chain.
 * @param {string} upc - The UPC of the item to ship.
 */
async function shipItem(upc) {
  // const upc = document.getElementById("shipItemUPC").value;
  const spinner = document.getElementById("shipItemSpinner");

  if (!upc) {
    showMessage("UPC is required", true);
    return;
  }

  if (!isInputValid(upc, "number")) {
    showMessage("Invalid UPC", true);
    return;
  }

  try {
    spinner.style.display = "inline-block"; // Show spinner
    await supplyChain.methods.shipItem(upc).send({ from: userAccount });
    showMessage("Item shipped successfully", false);
  } catch (error) {
    console.error("Error shipping item:", error);
    showMessage("Error shipping item: " + error.message, true);
  } finally {
    spinner.style.display = "none"; // Hide spinner
  }
}

/**
 * Receives an item in the supply chain.
 * @param {string} upc - The UPC of the item to receive.
 */
async function receiveItem(upc) {
  const spinner = document.getElementById("receiveItemSpinner");

  if (!upc) {
    showMessage("UPC is required", true);
    return;
  }

  if (!isInputValid(upc, "number")) {
    showMessage("Invalid UPC", true);
    return;
  }

  try {
    spinner.style.display = "inline-block"; // Show spinner

    // Fetch the product price for the given UPC
    const productData = await supplyChain.methods
      .fetchItemBufferTwo(upc)
      .call();
    const productPrice = productData.productPrice;

    // Send the transaction with the required ether value
    await supplyChain.methods
      .receiveItem(upc)
      .send({ from: userAccount, value: productPrice });

    showMessage("Item received successfully", false);
  } catch (error) {
    console.error("Error receiving item:", error);
    showMessage("Error receiving item: " + error.message, true);
  } finally {
    spinner.style.display = "none"; // Hide spinner
  }
}

/**
 * Allows a consumer to purchase an item.
 * @param {string} upc - The UPC of the item to be purchased.
 */
async function purchaseItem(upc) {
  const spinner = document.getElementById("purchaseItemSpinner");

  if (!upc) {
    showMessage("UPC is required", true);
    return;
  }

  if (!isInputValid(upc, "number")) {
    showMessage("Invalid UPC", true);
    return;
  }

  try {
    spinner.style.display = "inline-block"; // Show spinner

    // Fetch the product price for the given UPC
    const productData = await supplyChain.methods
      .fetchItemBufferTwo(upc)
      .call();
    const productPrice = productData.productPrice;

    // Send the transaction with the required ether value
    await supplyChain.methods
      .purchaseItem(upc)
      .send({ from: userAccount, value: productPrice });

    showMessage("Item purchased successfully", false);
  } catch (error) {
    console.error("Error purchasing item:", error);
    showMessage("Error purchasing item: " + error.message, true);
  } finally {
    spinner.style.display = "none"; // Hide spinner
  }
}

// Admin Section Functionality

/**
 * Toggles the active state of the contract.
 * If the contract is active, it will be stopped, and vice versa.
 */
async function toggleContractState() {
  const toggleSpinner = document.getElementById("toggleSpinner");
  toggleSpinner.style.display = "inline-block"; // Show spinner
  try {
    await supplyChain.methods
      .toggleContractActive()
      .send({ from: userAccount });
    showMessage("Contract state toggled successfully", false);
  } catch (error) {
    console.error("Error toggling contract state:", error);
    showMessage("Error toggling contract state: " + error.message, true);
  } finally {
    toggleSpinner.style.display = "none"; // Hide spinner
  }
}

/**
 * Checks the current state of the contract.
 * Displays whether the contract is active or stopped.
 */
async function checkContractState() {
  const checkSpinner = document.getElementById("checkSpinner");
  checkSpinner.style.display = "inline-block"; // Show spinner
  try {
    const isStopped = await supplyChain.methods.isStopped().call();
    showMessage(
      `Contract is currently ${isStopped ? "stopped" : "active"}`,
      false
    );
  } catch (error) {
    console.error("Error checking contract state:", error);
    showMessage("Error checking contract state: " + error.message, true);
  } finally {
    checkSpinner.style.display = "none"; // Hide spinner
  }
}

/**
 * Transfers the ownership of the contract to a new address.
 * @param {string} newOwnerAddress - The Ethereum address of the new owner.
 */
async function transferOwnership() {
  const transferSpinner = document.getElementById("transferSpinner");
  const newOwnerAddress = document.getElementById("newOwnerAddress").value;
  if (!isInputValid(newOwnerAddress, "address")) {
    showMessage("Invalid Ethereum address", true);
    return;
  }
  transferSpinner.style.display = "inline-block"; // Show spinner
  try {
    await supplyChain.methods
      .transferOwnership(newOwnerAddress)
      .send({ from: userAccount });
    showMessage("Ownership transferred successfully", false);
  } catch (error) {
    console.error("Error transferring ownership:", error);
    showMessage("Error transferring ownership: " + error.message, true);
  } finally {
    transferSpinner.style.display = "none"; // Hide spinner
  }
}

/**
 * Renounces the ownership of the contract.
 * After renouncing, the contract will not have an owner.
 */
async function renounceOwnership() {
  const renounceSpinner = document.getElementById("renounceSpinner");
  renounceSpinner.style.display = "inline-block"; // Show spinner
  try {
    await supplyChain.methods.renounceOwnership().send({ from: userAccount });
    showMessage("Ownership renounced successfully", false);
  } catch (error) {
    console.error("Error renouncing ownership:", error);
    showMessage("Error renouncing ownership: " + error.message, true);
  } finally {
    renounceSpinner.style.display = "none"; // Hide spinner
  }
}

/**
 * Sets up event listeners for the admin panel.
 */
document
  .getElementById("toggleContractStateBtn")
  .addEventListener("click", toggleContractState);
document
  .getElementById("checkContractStateBtn")
  .addEventListener("click", checkContractState);
document
  .getElementById("transferOwnershipBtn")
  .addEventListener("click", transferOwnership);
document
  .getElementById("renounceOwnershipBtn")
  .addEventListener("click", renounceOwnership);

// Event Listener Initialization on Window Load

/**
 * Initializes event listeners when the window is loaded.
 * Sets up the UI event listeners if the Ethereum object is found.
 */
window.addEventListener("load", async () => {
  if (window.ethereum) {
    setupUIEventListeners(); // Set up all event listeners
  } else {
    console.error("Ethereum object not found, you need MetaMask!");
    alert("MetaMask is required to use this application.");
  }
});
