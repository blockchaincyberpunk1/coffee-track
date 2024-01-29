# Deployment Instructions

## Introduction
This document outlines the steps for deploying the smart contracts for a blockchain-based supply chain system. The deployment focuses on the Ethereum blockchain using Hardhat as the development environment.

## Prerequisites
- Node.js and npm installed.
- An Ethereum wallet with Ether for deploying contracts (e.g., MetaMask).
- An Infura account and API key for deploying to Ethereum test networks.

## Setup

1. **Clone the Repository**:
```bash
   git clone https://github.com/blockchaincyberpunk1/coffee-track.git
   cd supply-chain-contracts
```

2. **Environment Setup**:
   - Create a .env file in the root directory.
   - Add the following variables:
  
```bash
    INFURA_API_KEY=your_infura_api_key
    PRIVATE_KEY=your_private_key
    REPORT_GAS=true
    GAS_REPORT_FILE=./gas-report.txt
    COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
```

## Compiling Contracts

Run the following command to compile the smart contracts:

```bash
   npx hardhat node
```

## Compiling Contracts
1. **Choose a Network**:
   - For deploying to a testnet (e.g., Sepolia), ensure you have test Ether.
   - For local testing, start Hardhat's local network:

 ```bash
   npx hardhat node
```

2. **Deploy Contracts**:
    - To deploy to the Hardhat local network:

```bash
   npx hardhat run scripts/deploy.js --network localhost
```

   - To deploy to a testnet (e.g., Sepolia):
  
 ```bash
   npx hardhat run scripts/deploy.js --network sepolia
```

## Post-Deployment
- After successful deployment, take note of the deployed contract addresses.
- Update any frontend or server applications with the new contract addresses.

## Troubleshooting
- Ensure that the private key and Infura API key are correct.
- Check for sufficient Ether in the wallet for deployment gas fees.
- For issues related to Hardhat or Ethereum, consult the respective documentation or community forums.

## Conclusion

By following these instructions, you can deploy the smart contracts for the supply chain system to the Ethereum blockchain. Ensure that all steps are carefully followed to avoid common pitfalls during deployment.

