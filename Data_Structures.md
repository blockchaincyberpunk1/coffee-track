# Data Structures in Smart Contracts

## Introduction
This document provides an overview of the data structures utilized in the smart contracts for a blockchain-based supply chain system. These structures are pivotal for tracking items through various stages from production to consumption.

## Key Data Structures

### Enums

#### State
- **Purpose**: Represents the various stages of the supply chain.
- **Usage**: Used in `SupplyChain.sol` to track the lifecycle of an item.
- **Values**:
  - `Harvested`
  - `Processed`
  - `Packed`
  - `ForSale`
  - `Sold`
  - `Shipped`
  - `Received`
  - `Purchased`

### Structs

#### Item
- **Purpose**: Holds information about each item in the supply chain.
- **Fields**:
  - `sku` (uint): Stock Keeping Unit.
  - `upc` (uint): Universal Product Code.
  - `ownerID` (address): Current owner's address.
  - `itemState` (State): Current state of the item.
  - `distributorID` (address): Address of the distributor.
  - `retailerID` (address): Address of the retailer.
  - `consumerID` (address): Address of the consumer.

#### OriginData
- **Purpose**: Stores information about the origin of the product.
- **Fields**:
  - `originFarmerID` (address): Address of the farmer.
  - `originFarmName` (string): Name of the farm.
  - `originFarmInformation` (string): Information about the farm.
  - `originFarmLatitude` (string): Geographic latitude.
  - `originFarmLongitude` (string): Geographic longitude.

#### ProductData
- **Purpose**: Contains product-specific details.
- **Fields**:
  - `productID` (uint): Unique product identifier.
  - `productNotes` (string): Notes or descriptions of the product.
  - `productPrice` (uint): Price of the product in wei.

#### HarvestData
- **Purpose**: Used for collecting harvest-related information.
- **Fields**:
  - `upc` (uint): Universal Product Code.
  - `originFarmName` (string): Name of the farm.
  - `originFarmInformation` (string): Information about the farm.
  - `originFarmLatitude` (string): Farm's latitude.
  - `originFarmLongitude` (string): Farm's longitude.
  - `productNotes` (string): Notes about the product.

### Mappings

#### items
- **Purpose**: Maps a UPC to an `Item` struct.
- **Key**: `upc` (uint).
- **Value**: `Item` struct.

#### itemsHistory
- **Purpose**: Records the history of actions taken on each item.
- **Key**: `upc` (uint).
- **Value**: Array of strings describing actions.

#### originData
- **Purpose**: Maps UPC to `OriginData` struct.
- **Key**: `upc` (uint).
- **Value**: `OriginData` struct.

#### productData
- **Purpose**: Maps UPC to `ProductData` struct.
- **Key**: `upc` (uint).
- **Value**: `ProductData` struct.

## Conclusion
The use of enums, structs, and mappings in the smart contracts efficiently encapsulates and manages the complex data involved in a supply chain. These structures ensure that each product's journey is transparent, traceable, and securely recorded on the blockchain.
