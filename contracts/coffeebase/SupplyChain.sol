// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import statements for Owned, ConsumerRole, DistributorRole, FarmerRole, and RetailerRole...
// Import the role-based access control contracts for each participant in the supply chain
import "../coffeeaccesscontrol/Owned.sol";
import "../coffeeaccesscontrol/ConsumerRole.sol";
import "../coffeeaccesscontrol/DistributorRole.sol";
import "../coffeeaccesscontrol/FarmerRole.sol";
import "../coffeeaccesscontrol/RetailerRole.sol";

// OpenZeppelin's Math library is not necessary for Solidity ^0.8.0 due to built-in overflow checks,
// but I import it here for potential utility functions or consistency in older versions.
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title A Supply Chain tracking contract for a coffee product journey from farm to consumer
 * @notice This contract is a simulation and demonstration of a supply chain for educational purposes.
 * @dev This contract uses Solidity ^0.8.0 which includes automatic arithmetic checks,
 * making the use of the Math library from OpenZeppelin redundant for arithmetic operations.
 */
contract SupplyChain is
    Owned,
    ConsumerRole,
    DistributorRole,
    FarmerRole,
    RetailerRole
{
    /// @dev The Math library from OpenZeppelin is included as a safety measure,
    /// but in Solidity ^0.8.0 it is not required for arithmetic operations.
    using Math for uint;
    /// @notice Universal Product Code (UPC) for product identification
    uint public upc;
    /// @notice Stock Keeping Unit (SKU) for inventory tracking
    uint public sku;
    /// @dev A boolean flag for the circuit breaker pattern that can halt certain contract functionalities
    bool private stopped = false;

    // Mappings...

    /// @notice Mapping to track each item by UPC to its corresponding data structure
    mapping(uint => Item) public items;
    /// @notice Mapping to record the history of actions taken upon each item, indexed by UPC
    mapping(uint => string[]) public itemsHistory;
    /// @notice Mapping from UPC to OriginData, storing origin details for each product.
    mapping(uint => OriginData) public originData;
    /// @notice Mapping from UPC to ProductData, storing product details for each item.
    mapping(uint => ProductData) public productData;

    // Enums...

    /// @dev Enum representing the various states through which an item transitions in the supply chain
    enum State {
        Harvested,
        Processed,
        Packed,
        ForSale,
        Sold,
        Shipped,
        Received,
        Purchased
    }

    // Structs...

    /**
     * @dev Represents an item in the supply chain.
     */
    struct Item {
        uint sku;
        uint upc;
        address ownerID;
        State itemState;
        address distributorID;
        address retailerID;
        address consumerID;
    }

    /**
     * @dev Contains information about the origin of an item.
     */
    struct OriginData {
        address originFarmerID;
        string originFarmName;
        string originFarmInformation;
        string originFarmLatitude;
        string originFarmLongitude;
    }

    /**
     * @dev Holds product-specific data.
     */
    struct ProductData {
        uint productID;
        string productNotes;
        uint productPrice;
    }

    /**
     * @dev Data structure for holding harvest-specific information.
     */
    struct HarvestData {
        uint upc;
        string originFarmName;
        string originFarmInformation;
        string originFarmLatitude;
        string originFarmLongitude;
        string productNotes;
    }

    // Events...

    /**
     * @dev Emitted when an item is harvested by a farmer.
     * @param upc Universal Product Code of the harvested item.
     */
    event Harvested(uint indexed upc);
    /**
     * @dev Emitted when an item is processed by a farmer.
     * @param upc Universal Product Code of the processed item.
     */
    event Processed(uint indexed upc);
    /**
     * @dev Emitted when an item is packed by a farmer.
     * @param upc Universal Product Code of the packed item.
     */
    event Packed(uint indexed upc);
    /**
     * @dev Emitted when an item is put up for sale by a farmer.
     * @param upc Universal Product Code of the item for sale.
     */
    event ForSale(uint indexed upc);
    /**
     * @dev Emitted when an item is sold to a distributor.
     * @param upc Universal Product Code of the sold item.
     */
    event Sold(uint indexed upc);
    /**
     * @dev Emitted when an item is shipped by a distributor.
     * @param upc Universal Product Code of the shipped item.
     */
    event Shipped(uint indexed upc);
    /**
     * @dev Emitted when an item is received by a retailer.
     * @param upc Universal Product Code of the received item.
     */
    event Received(uint indexed upc);
    /**
     * @dev Emitted when an item is purchased by a consumer.
     * @param upc Universal Product Code of the purchased item.
     */
    event Purchased(uint indexed upc);

    // Modifiers...

    /**
     * @dev Modifier that stops a function from executing if the contract is halted.
     * Used as a part of a circuit breaker pattern.
     */
    modifier stopInEmergency() {
        require(!stopped, "Contract is stopped");
        _;
    }

    /**
     * @dev Modifier that tracks the history of actions taken on an item.
     * @param _upc The UPC of the item whose history is being tracked.
     * @param action The action performed on the item.
     */
    modifier trackHistory(uint _upc, string memory action) {
        _;
        itemsHistory[_upc].push(action);
    }

    /**
     * @dev Modifier that checks if enough ether is sent for the transaction.
     * @param _price The price of the item in wei.
     */
    modifier paidEnough(uint _price) {
        require(msg.value >= _price, "Not enough ether provided");
        _;
    }

    /**
     * @dev Modifier that refunds the excess ether sent for a purchase.
     * @param _upc The UPC of the item being purchased.
     */
    modifier checkValue(uint _upc) {
        _;
        uint _price = productData[_upc].productPrice;
        uint amountToReturn = msg.value - _price;
        payable(items[_upc].consumerID).transfer(amountToReturn);
    }

    /**
     * @dev Modifier that checks if an item has been harvested.
     * @param _upc The UPC of the item to check.
     */
    modifier harvested(uint _upc) {
        require(items[_upc].itemState == State.Harvested, "Item not harvested");
        _;
    }

    /**
     * @dev Modifier that checks if an item has been processed.
     * @param _upc The UPC of the item to check.
     */
    modifier processed(uint _upc) {
        require(items[_upc].itemState == State.Processed, "Item not processed");
        _;
    }

    /**
     * @dev Modifier that checks if an item has been packed.
     * @param _upc The UPC of the item to check.
     */
    modifier packed(uint _upc) {
        require(items[_upc].itemState == State.Packed, "Item not packed");
        _;
    }

    /**
     * @dev Modifier that checks if an item is for sale.
     * @param _upc The UPC of the item to check.
     */
    modifier forSale(uint _upc) {
        require(items[_upc].itemState == State.ForSale, "Item not for sale");
        _;
    }

    /**
     * @dev Modifier that checks if an item has been sold.
     * @param _upc The UPC of the item to check.
     */
    modifier sold(uint _upc) {
        require(items[_upc].itemState == State.Sold, "Item not sold");
        _;
    }

    /**
     * @dev Modifier that checks if an item has been shipped.
     * @param _upc The UPC of the item to check.
     */
    modifier shipped(uint _upc) {
        require(items[_upc].itemState == State.Shipped, "Item not shipped");
        _;
    }

    /**
     * @dev Modifier that checks if an item has been received.
     * @param _upc The UPC of the item to check.
     */
    modifier received(uint _upc) {
        require(items[_upc].itemState == State.Received, "Item not received");
        _;
    }

    // Constructor...

    /**
     * @dev Constructor for the SupplyChain contract. Initializes the SKU and UPC counters.
     */
    constructor() Owned() {
        // Call the Owned constructor
        sku = 1;
        upc = 1;
    }

    // Function definitions...

    /**
     * @dev Toggles the active state of the contract. Can only be called by the contract owner.
     * Part of the circuit breaker pattern.
     */
    function toggleContractActive() public onlyOwner {
        stopped = !stopped;
    }

    /**
     * @notice Records the harvesting of an item by a farmer.
     * @dev This function can only be called by a farmer. It records the item's initial details and marks it as harvested.
     * @param data Struct containing harvest-related data such as UPC and farm details.
     */
    function harvestItem(
        HarvestData calldata data
    ) external onlyFarmer stopInEmergency trackHistory(data.upc, "Harvested") {
        require(
            items[data.upc].ownerID == address(0),
            "Item with this UPC already harvested"
        );

        Item storage newItem = items[data.upc];
        newItem.sku = sku;
        newItem.upc = data.upc;
        newItem.ownerID = msg.sender; // Farmer's address
        newItem.itemState = State.Harvested;

        OriginData storage newOrigin = originData[data.upc];
        newOrigin.originFarmerID = msg.sender;
        newOrigin.originFarmName = data.originFarmName;
        newOrigin.originFarmInformation = data.originFarmInformation;
        newOrigin.originFarmLatitude = data.originFarmLatitude;
        newOrigin.originFarmLongitude = data.originFarmLongitude;

        ProductData storage newProduct = productData[data.upc];
        // Creating a unique product ID
        newProduct.productID = sku + data.upc;
        newProduct.productNotes = data.productNotes;
        // Initializing the price to zero
        newProduct.productPrice = 0;

        // Incrementing SKU for the next item
        sku++;
        emit Harvested(data.upc);
    }

    /**
     * @notice Marks an item as processed by the farmer who harvested it.
     * @dev The item must be in the Harvested state and can only be processed by the farmer who harvested it.
     * @param _upc The UPC of the item to be processed.
     */
    function processItem(
        uint _upc
    )
        external
        onlyFarmer
        harvested(_upc)
        stopInEmergency
        trackHistory(_upc, "Processed")
    {
        require(
            items[_upc].itemState == State.Harvested,
            "Item must be harvested before processing"
        );
        require(
            originData[_upc].originFarmerID == msg.sender,
            "Only the farmer who harvested can process this item"
        );

        items[_upc].itemState = State.Processed;
        emit Processed(_upc);
    }

    /**
     * @notice Marks an item as packed by the farmer who processed it.
     * @dev The item must be in the Processed state and can only be packed by the farmer who processed it.
     * @param _upc The UPC of the item to be packed.
     */
    function packItem(
        uint _upc
    )
        external
        onlyFarmer
        processed(_upc)
        stopInEmergency
        trackHistory(_upc, "Packed")
    {
        require(
            items[_upc].itemState == State.Processed,
            "Item must be processed before packing"
        );
        require(
            originData[_upc].originFarmerID == msg.sender,
            "Only the farmer who processed the item can pack it"
        );

        items[_upc].itemState = State.Packed;
        emit Packed(_upc);
    }

    /**
     * @notice Lists an item for sale by the farmer.
     * @dev The item must be in the Packed state. The farmer sets the sale price.
     * @param _upc The UPC of the item to be sold.
     * @param _price The price at which the item is to be sold.
     */
    function sellItem(
        uint _upc,
        uint _price
    )
        external
        onlyFarmer
        packed(_upc)
        stopInEmergency
        trackHistory(_upc, "ForSale")
    {
        require(
            items[_upc].itemState == State.Packed,
            "Item must be packed before selling"
        );
        require(
            originData[_upc].originFarmerID == msg.sender,
            "Only the farmer who packed the item can sell it"
        );

        productData[_upc].productPrice = _price;
        items[_upc].itemState = State.ForSale;
        emit ForSale(_upc);
    }

    /**
     * @notice Allows a distributor to buy an item that is for sale.
     * @dev This function can only be called by a distributor. It transfers ownership to the distributor and marks the item as sold.
     * @param _upc The UPC of the item to be bought.
     */
    function buyItem(
        uint _upc
    )
        external
        payable
        onlyDistributor
        forSale(_upc)
        paidEnough(productData[_upc].productPrice)
        checkValue(_upc)
        stopInEmergency
        trackHistory(_upc, "Sold")
    {
        // Checks
        require(
            items[_upc].itemState == State.ForSale,
            "Item must be for sale to buy"
        );
        require(
            msg.value >= productData[_upc].productPrice,
            "Insufficient payment for the item"
        );

        uint amountToReturn = msg.value - productData[_upc].productPrice;

        // Effects
        Item storage item = items[_upc];
        item.ownerID = msg.sender; // Update to distributor's address
        item.distributorID = msg.sender;
        item.itemState = State.Sold;

        // Interactions
        if (amountToReturn > 0) {
            payable(msg.sender).transfer(amountToReturn);
        }
        payable(originData[_upc].originFarmerID).transfer(
            productData[_upc].productPrice
        );
        emit Sold(_upc);
    }

    /**
     * @notice Allows a distributor to ship a sold item.
     * @dev This function can only be called by the distributor who owns the item. It marks the item as shipped.
     * @param _upc The UPC of the item to be shipped.
     */
    function shipItem(
        uint _upc
    )
        external
        onlyDistributor
        sold(_upc)
        stopInEmergency
        trackHistory(_upc, "Shipped")
    {
        require(
            items[_upc].itemState == State.Sold,
            "Item must be sold before shipping"
        );
        require(
            items[_upc].distributorID == msg.sender,
            "Only the distributor who bought the item can ship it"
        );

        items[_upc].itemState = State.Shipped;
        emit Shipped(_upc);
    }

    /**
     * @notice Allows a retailer to mark an item as received and pay the distributor.
     * @dev This function follows the Checks-Effects-Interactions pattern to prevent reentrancy attacks.
     * It can only be called by the retailer designated to receive the item. Upon receiving, it marks the item as received
     * and transfers payment to the distributor.
     * @param _upc The UPC of the item to be received.
     */
    function receiveItem(
        uint _upc
    )
        external
        payable
        onlyRetailer
        shipped(_upc)
        stopInEmergency
        trackHistory(_upc, "Received")
    {
        // Checks
        Item storage item = items[_upc];
        require(
            item.itemState == State.Shipped,
            "Item must be in 'Shipped' state"
        );
        require(
            msg.value >= productData[_upc].productPrice,
            "Not enough ether provided for the purchase"
        );

        // Effects
        item.ownerID = msg.sender; // Update to retailer's address
        item.retailerID = msg.sender;
        item.itemState = State.Received;
        emit Received(_upc); // Emitting event after state change

        // Interaction
        payable(item.distributorID).transfer(msg.value); // Transfer payment to distributor
    }

    /**
     * @notice Allows a consumer to finalize the purchase of an item, transferring payment to the retailer.
     * @dev This function can only be called by the designated consumer. It updates the item's state to Purchased and handles the payment transaction.
     * @param _upc The UPC of the item to be purchased.
     */
    function purchaseItem(
        uint _upc
    )
        external
        payable
        onlyConsumer
        received(_upc)
        stopInEmergency
        trackHistory(_upc, "Purchased")
    {
        // Checks
        Item storage item = items[_upc];
        require(
            item.itemState == State.Received,
            "Item must be in 'Received' state"
        );
        require(
            msg.value >= productData[_upc].productPrice,
            "Not enough ether provided for the purchase"
        );

        // Effects
        item.ownerID = msg.sender; // Update the item's owner to the consumer
        item.consumerID = msg.sender;
        item.itemState = State.Purchased;

        // Interactions
        uint amountToTransfer = productData[_upc].productPrice;
        payable(item.retailerID).transfer(amountToTransfer);

        // Refund any excess ether sent by the consumer
        uint excessAmount = msg.value - amountToTransfer;
        if (excessAmount > 0) {
            payable(msg.sender).transfer(excessAmount);
        }

        emit Purchased(_upc);
    }

    /**
     * @notice Fetches the first set of data for a given item.
     * @dev Returns details related to the item's origin and initial state.
     * @param _upc The UPC of the item to fetch data for.
     * @return itemSKU SKU of the item.
     * @return itemUPC UPC of the item.
     * @return ownerID Address of the current owner of the item.
     * @return originFarmerID Address of the farmer who harvested the item.
     * @return originFarmName Name of the farm where the item was harvested.
     * @return originFarmInformation Additional information about the farm.
     * @return originFarmLatitude Geographic latitude of the farm.
     * @return originFarmLongitude Geographic longitude of the farm.
     */
    function fetchItemBufferOne(
        uint _upc
    )
        public
        view
        returns (
            uint itemSKU,
            uint itemUPC,
            address ownerID,
            address originFarmerID,
            string memory originFarmName,
            string memory originFarmInformation,
            string memory originFarmLatitude,
            string memory originFarmLongitude
        )
    {
        require(items[_upc].upc != 0, "Item does not exist for the given UPC");
        Item memory item = items[_upc];
        OriginData memory origin = originData[_upc];
        return (
            item.sku,
            item.upc,
            item.ownerID,
            origin.originFarmerID,
            origin.originFarmName,
            origin.originFarmInformation,
            origin.originFarmLatitude,
            origin.originFarmLongitude
        );
    }

    /**
     * @notice Fetches the second set of data for a given item.
     * @dev Returns product-specific details and the current state of the item.
     * @param _upc The UPC of the item to fetch data for.
     * @return itemSKU SKU of the item.
     * @return itemUPC UPC of the item.
     * @return productID Product ID of the item.
     * @return productNotes Notes related to the product.
     * @return productPrice Price of the product in wei.
     * @return itemState Current state of the item in the supply chain.
     * @return distributorID Address of the distributor handling the item.
     * @return retailerID Address of the retailer selling the item.
     * @return consumerID Address of the consumer who purchased the item.
     */
    function fetchItemBufferTwo(
        uint _upc
    )
        public
        view
        returns (
            uint itemSKU,
            uint itemUPC,
            uint productID,
            string memory productNotes,
            uint productPrice,
            State itemState,
            address distributorID,
            address retailerID,
            address consumerID
        )
    {
        require(items[_upc].upc != 0, "Item does not exist for the given UPC");
        Item memory item = items[_upc];
        ProductData memory product = productData[_upc];
        return (
            item.sku,
            item.upc,
            product.productID,
            product.productNotes,
            product.productPrice,
            item.itemState,
            item.distributorID,
            item.retailerID,
            item.consumerID
        );
    }

    /**
     * @notice Fetches the origin data for a given item.
     * @param _upc The UPC of the item to fetch origin data for.
     * @return OriginData struct containing the item's origin details.
     */
    function fetchOriginData(
        uint _upc
    ) public view returns (OriginData memory) {
        require(
            originData[_upc].originFarmerID != address(0),
            "Origin data does not exist for the given UPC"
        );
        return originData[_upc];
    }

    /**
     * @notice Fetches the product data for a given item.
     * @param _upc The UPC of the item to fetch product data for.
     * @return ProductData struct containing the item's product details.
     */
    function fetchProductData(
        uint _upc
    ) public view returns (ProductData memory) {
        require(
            productData[_upc].productID != 0,
            "Product data does not exist for the given UPC"
        );
        return productData[_upc];
    }

    /**
     * @notice Checks if the contract is currently stopped.
     * @dev Part of the circuit breaker pattern.
     * @return Boolean indicating if the contract is stopped.
     */
    function isStopped() public view returns (bool) {
        return stopped;
    }

    /**
     * @notice Fetches the history of actions taken on an item.
     * @param _upc The UPC of the item to fetch history for.
     * @return Array of strings, each representing an action taken on the item.
     */
    function fetchItemHistory(uint _upc) public view returns (string[] memory) {
        return itemsHistory[_upc];
    }
}
