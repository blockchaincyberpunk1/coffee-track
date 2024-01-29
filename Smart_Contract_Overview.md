# Smart Contract Overview

## Project Overview
This document outlines the smart contract development for a blockchain-based supply chain application, focusing on the journey of a coffee product from farm to consumer.

## Contract Structure

### Access Control Contracts
Responsible for role management in the supply chain.

#### `Owned.sol`
- **Purpose**: Establish ownership of contracts.
- **Features**: 
  - `onlyOwner` modifier for owner-exclusive function access.

#### `Roles.sol`
- **Purpose**: Library for role management.
- **Features**: 
  - Assign and remove roles.
  - Check role assignment.

#### Role-Specific Contracts
Includes `ConsumerRole.sol`, `DistributorRole.sol`, `FarmerRole.sol`, `RetailerRole.sol`.
- **Purpose**: Manage specific roles in the supply chain.
- **Features**:
  - Add and remove roles.
  - Verify role assignments.
  - Events for role changes.

### Base Contract

#### `SupplyChain.sol`
- **Purpose**: Core supply chain logic.
- **Features**:
  - Track items by UPC.
  - Represent item states and data.
  - Handle supply chain actions (harvest, process, etc.).
  - State transition events.
  - Emergency stop functionality (Circuit Breaker pattern).

### Core Contract

#### `Ownable.sol`
- **Purpose**: Extend `SupplyChain` with ownership functionalities.
- **Features**:
  - Ownership transfer and renouncement.
  - Ownership verification.

## Deployment Script

### `deploy.js`
- **Purpose**: Deploy the `Ownable` contract.
- **Process**: 
  - Compile contracts.
  - Deploy and log the `Ownable` contract address.

## Hardhat Configuration

### `hardhat.config.js`
- **Configuration**:
  - Solidity version and settings.
  - Network and deployment settings.
  - Gas reporter plugin configuration.

## Project Metadata

### `package.json`
- **Contents**: 
  - Project dependencies (Hardhat, OpenZeppelin, etc.).
  - Test and task scripts.

---

This overview provides insights into the architecture and components of the supply chain smart contract system, including role management, core logic, deployment, and configuration.
