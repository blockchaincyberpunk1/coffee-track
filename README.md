# Ethereum Supply Chain DApp - Coffee Track

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/blockchaincyberpunk1/coffee-track)](https://github.com/blockchaincyberpunk1/coffee-track/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/blockchaincyberpunk1/coffee-track)](https://github.com/blockchaincyberpunk1/coffee-track/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/blockchaincyberpunk1/coffee-track)](https://github.com/blockchaincyberpunk1/coffee-track/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/blockchaincyberpunk1/coffee-track)](https://github.com/blockchaincyberpunk1/coffee-track/pulls)

## Table of Contents

- [Ethereum Supply Chain DApp - Coffee Track](#ethereum-supply-chain-dapp---coffee-track)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Installation](#installation)
  - [Smart Contracts](#smart-contracts)
    - [Access Control](#access-control)
    - [Base Contract](#base-contract)
    - [Core Contract](#core-contract)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Introduction

Coffee Track is an Ethereum-based decentralized application (DApp) that showcases a supply chain flow for coffee from farmers to consumers. This project demonstrates how blockchain technology can enhance transparency and traceability in supply chains.

## Features

Coffee Track offers various features through its smart contracts:

- **Role-Based Access Control**: Different roles for participants like Farmers, Distributors, Retailers, and Consumers.
- **Tracking Coffee Journey**: From harvesting, processing, packing, for sale, sold, shipped, received to purchased stages.
- **Ownership Management**: Smart contract functionalities to manage ownership.

## Installation

To set up Coffee Track locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/blockchaincyberpunk1/coffee-track.git
   ```

2. Navigate to the project directory:

   ```bash
   cd coffee-track
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Compile the smart contracts:

   ```bash
   npx hardhat compile
   ```

## Smart Contracts

### Access Control

- **Owned.sol**: Manages contract ownership.
- **Roles.sol**: Library for managing addresses assigned to a Role.
- **ConsumerRole.sol**: Contract to manage a 'consumer' role.
- **DistributorRole.sol**: Contract for distributor role management.
- **FarmerRole.sol**: Contract for farmer role management.
- **RetailerRole.sol**: Contract for retailer role management.

### Base Contract

- **SupplyChain.sol**: The main contract that tracks the coffee product journey.
- 
### Core Contract

- **Ownable.sol**: Extends SupplyChain with ownership control functionalities.


## Usage

To deploy the smart contracts to a local Ethereum network:

1. Start a local Ethereum node:

   ```bash
   npx hardhat node
   ```

2. Deploy the contracts:

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

## Contributing

Contributions to Coffee Track are welcome! Please read our  [Contribution Guidelines](CONTRIBUTING.md) for more information on how to report bugs, suggest features, or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


Ownable contract deployed to: 0xd9D29e8a4E257A8813FF1E8CA1814C742ABb75BD