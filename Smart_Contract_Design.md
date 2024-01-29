# Smart Contract Design

## Introduction
This document details the design principles and structure of smart contracts for a blockchain-enabled supply chain system. The primary focus is on a coffee supply chain, demonstrating the journey of coffee from farmers to consumers.

## Design Principles

### Modularity
- **Objective**: Create a scalable and maintainable system.
- **Implementation**: Separate contracts for different functionalities, such as role management (`Roles.sol`, `ConsumerRole.sol`, etc.) and core supply chain logic (`SupplyChain.sol`).

### Security and Access Control
- **Objective**: Ensure that functions are accessible only to authorized entities.
- **Implementation**: Use of `onlyOwner` and role-based modifiers to restrict function execution.

### Transparency and Traceability
- **Objective**: Provide a transparent view of the product's journey and actions performed at each stage.
- **Implementation**: Emitting events for each significant action and state change in the supply chain.

## Contract Structure

### Access Control Contracts
- **Purpose**: Manage different roles within the supply chain ecosystem.
- **Contracts**:
  - **Owned.sol**: Manages the ownership of the contracts.
  - **Roles.sol**: A generic library for role management.
  - **ConsumerRole.sol**, **DistributorRole.sol**, **FarmerRole.sol**, **RetailerRole.sol**: Specific contracts for each participant role.

### Core Contract
- **SupplyChain.sol**:
  - **Purpose**: Central contract encapsulating the main business logic of the supply chain.
  - **Features**:
    - Item tracking by SKU and UPC.
    - Enumerated states to represent the lifecycle of a product.
    - Functions for actions like harvest, process, pack, sell, buy, ship, receive, and purchase.
    - Integration with role-based contracts for access control.

### Extension Contract
- **Ownable.sol**:
  - **Purpose**: Extend `SupplyChain` with ownership management.
  - **Features**: Ownership transfer, ownership renouncement, and ownership checks.

## Key Features

### State Management
- **Description**: Tracks the state of each product in the supply chain.
- **Implementation**: Enum `State` in `SupplyChain.sol` with states like `Harvested`, `Processed`, etc.

### Role-Based Actions
- **Description**: Ensure actions are performed by authorized roles.
- **Implementation**: Role-based modifiers in role contracts, used in `SupplyChain.sol`.

### Event Logging
- **Description**: Track and log actions and state changes.
- **Implementation**: Emitting events in `SupplyChain.sol` for each action.

### Circuit Breaker
- **Description**: Emergency stop mechanism.
- **Implementation**: Boolean `stopped` in `SupplyChain.sol`, controlled by `toggleContractActive()`.

## Interaction Flow

### Farmer Interactions
- **Actions**: Harvest, process, pack, and sell items.

### Distributor Interactions
- **Actions**: Buy and ship items.

### Retailer Interactions
- **Actions**: Receive items.

### Consumer Interactions
- **Actions**: Purchase items.

## Security Considerations

- **Reentrancy Protection**: Use of non-reentrant patterns in critical functions.
- **Input Validation**: Ensuring valid inputs in public and external functions.
- **Role Validation**: Verifying roles before allowing role-specific actions.
- **Circuit Breaker**: Ability to halt contract operations in case of vulnerabilities.

## Deployment Strategy

- **Tools**: Hardhat for compilation, testing, and deployment.
- **Networks**: Configured for deployment on Ethereum test networks like Sepolia.
- **Gas Optimization**: Enabled optimizer in Solidity compiler settings for efficient gas usage.

## Conclusion
The smart contract design for the supply chain system is built on the principles of security, modularity, and transparency. It leverages Ethereum blockchain technology to ensure a reliable and efficient tracking system for coffee products from farm to consumer.
