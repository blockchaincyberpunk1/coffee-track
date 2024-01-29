# Interactions and APIs

## Introduction
This document outlines the primary interactions and API endpoints provided by the smart contracts in our blockchain-based supply chain system. It details how external entities like web interfaces or other contracts can interact with our deployed contracts.

## Smart Contract APIs

### SupplyChain Contract

#### Functions
- **harvestItem**
  - **Input**: `HarvestData` struct containing details like UPC, farm information, and product notes.
  - **Output**: Emits `Harvested` event with UPC.
  - **Access**: Restricted to `onlyFarmer` role.

- **processItem**
  - **Input**: `upc` (uint).
  - **Output**: Emits `Processed` event with UPC.
  - **Access**: Restricted to `onlyFarmer` role.

- **packItem**
  - **Input**: `upc` (uint).
  - **Output**: Emits `Packed` event with UPC.
  - **Access**: Restricted to `onlyFarmer` role.

- **sellItem**
  - **Input**: `upc` (uint), `price` (uint).
  - **Output**: Emits `ForSale` event with UPC.
  - **Access**: Restricted to `onlyFarmer` role.

- **buyItem**
  - **Input**: `upc` (uint).
  - **Output**: Emits `Sold` event with UPC.
  - **Access**: Restricted to `onlyDistributor` role.

- **shipItem**
  - **Input**: `upc` (uint).
  - **Output**: Emits `Shipped` event with UPC.
  - **Access**: Restricted to `onlyDistributor` role.

- **receiveItem**
  - **Input**: `upc` (uint).
  - **Output**: Emits `Received` event with UPC.
  - **Access**: Restricted to `onlyRetailer` role.

- **purchaseItem**
  - **Input**: `upc` (uint).
  - **Output**: Emits `Purchased` event with UPC.
  - **Access**: Restricted to `onlyConsumer` role.

- **fetchItemBufferOne**
  - **Input**: `upc` (uint).
  - **Output**: Returns origin data of the item.
  - **Access**: Public.

- **fetchItemBufferTwo**
  - **Input**: `upc` (uint).
  - **Output**: Returns product data and current state of the item.
  - **Access**: Public.

- **fetchItemHistory**
  - **Input**: `upc` (uint).
  - **Output**: Returns history of actions taken on the item.
  - **Access**: Public.

#### Events
- `Harvested`, `Processed`, `Packed`, `ForSale`, `Sold`, `Shipped`, `Received`, `Purchased`

### Role-Based Contracts (FarmerRole, DistributorRole, RetailerRole, ConsumerRole)

#### Functions
- **addRole**
  - **Input**: `account` (address).
  - **Output**: Emits RoleAdded event.
  - **Access**: Restricted to `onlyOwner`.

- **renounceRole**
  - **Output**: Emits RoleRemoved event for sender's address.
  - **Access**: Public, self-renouncement.

- **isRole**
  - **Input**: `account` (address).
  - **Output**: Returns boolean indicating role presence.
  - **Access**: Public.

#### Events
- `RoleAdded`, `RoleRemoved`

### Ownable Contract

#### Functions
- **transferOwnership**
  - **Input**: `newOwner` (address).
  - **Output**: Transfers contract ownership.
  - **Access**: Restricted to `onlyOwner`.

- **renounceOwnership**
  - **Output**: Renounces contract ownership.
  - **Access**: Restricted to `onlyOwner`.

#### Events
- `OwnershipTransferred`

## Conclusion
These APIs facilitate interactions with the supply chain smart contracts, enabling seamless integration with web interfaces, dApps, or other smart contracts. They ensure secure, role-based access to supply chain functions and provide comprehensive data about each item's journey.
