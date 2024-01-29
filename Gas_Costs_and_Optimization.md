# Gas Costs and Optimization in Ethereum Supply Chain DApp v1

## Summary
This document provides an analysis of the gas costs associated with the deployment and function calls of the smart contracts in the Ethereum Supply Chain DApp v1. It also explores strategies and practices implemented for gas optimization.

### Compilation and Optimization Settings
- **Solc Version**: 0.8.20
- **Optimizer Enabled**: true
- **Runs**: 200
- **Block Limit**: 30000000 gas

### Gas Price Assumptions
- **Gas Price**: 9 gwei/gas
- **ETH Price**: 2271.82 USD/ETH

## Contract Deployment Costs
The following table summarizes the gas used for deploying each contract, represented as a percentage of the block limit:

| Contract         | Gas Used | % of Block Limit | Cost (USD) |
|------------------|---------:|-----------------:|-----------:|
| ConsumerRole     |  331287  |             1.1% |      $6.77 |
| DistributorRole  |  331275  |             1.1% |      $6.77 |
| FarmerRole       |  331299  |             1.1% |      $6.77 |
| MockRoles        |  219654  |             0.7% |      $4.49 |
| Ownable          | 3476528  |            11.6% |     $71.08 |
| RetailerRole     |  331287  |             1.1% |      $6.77 |
| SupplyChain      | 3372633  |            11.2% |     $68.96 |

## Function Call Gas Costs
The following table outlines the gas costs for various function calls within the smart contracts:

| Contract         | Method                | Min Gas | Max Gas | Avg Gas | # Calls | USD (Avg) |
|------------------|-----------------------|--------:|--------:|--------:|--------:|----------:|
| ConsumerRole     | addConsumer           |     -   |     -   |   47583 |      5  |     $0.97 |
| ConsumerRole     | renounceConsumer      |     -   |     -   |   23062 |      3  |     $0.47 |
| DistributorRole  | addDistributor        |     -   |     -   |   47605 |      5  |     $0.97 |
| DistributorRole  | renounceDistributor   |     -   |     -   |   23040 |      3  |     $0.47 |
| FarmerRole       | addFarmer             |     -   |     -   |   47583 |      5  |     $0.97 |
| FarmerRole       | renounceFarmer        |     -   |     -   |   23062 |      3  |     $0.47 |
| MockRoles        | addRole               |     -   |     -   |   44247 |      2  |     $0.90 |
| MockRoles        | removeRole            |     -   |     -   |   22360 |      1  |     $0.46 |
| Ownable          | renounceOwnership     |     -   |     -   |   23296 |      1  |     $0.48 |
| Ownable          | transferOwnership     |     -   |     -   |   28685 |      1  |     $0.59 |
| RetailerRole     | addRetailer           |     -   |     -   |   47627 |      5  |     $0.97 |
| RetailerRole     | renounceRetailer      |     -   |     -   |   23106 |      3  |     $0.47 |
| SupplyChain      | addConsumer           |     -   |     -   |   47674 |     80  |     $0.97 |
| SupplyChain      | addDistributor        |     -   |     -   |   47682 |     82  |     $0.97 |
| SupplyChain      | addFarmer             |     -   |     -   |   47651 |     85  |     $0.97 |
| SupplyChain      | addRetailer           |     -   |     -   |   47650 |     78  |     $0.97 |
| SupplyChain      | buyItem               |     -   |     -   |  102176 |     18  |     $2.09 |
| SupplyChain      | harvestItem           | 306451  | 306679  | 306647  |    109  |     $6.27 |
| SupplyChain      | packItem              |     -   |     -   |   62642 |     31  |     $1.28 |
| SupplyChain      | processItem           |     -   |     -   |   62600 |     37  |     $1.28 |
| SupplyChain      | purchaseItem          |     -   |     -   |   96504 |      2  |     $1.97 |
| SupplyChain      | receiveItem           |     -   |     -   |   96280 |      4  |     $1.97 |
| SupplyChain      | renounceConsumer      |     -   |     -   |   23174 |      1  |     $0.47 |
| SupplyChain      | renounceDistributor   |     -   |     -   |   23107 |      1  |     $0.47 |
| SupplyChain      | renounceFarmer        |     -   |     -   |   23130 |      1  |     $0.47 |
| SupplyChain      | renounceRetailer      |     -   |     -   |   23128 |      1  |     $0.47 |
| SupplyChain      | sellItem              |     -   |     -   |   84990 |     26  |     $1.74 |
| SupplyChain      | shipItem              |     -   |     -   |   62670 |     12  |     $1.28 |
| SupplyChain      | toggleContractActive  |   23678 |   45578 |   36818 |      5  |     $0.75 |

## Optimization Strategies
1. **Use of Optimizer**: The compiler optimizer was enabled with 200 runs, significantly reducing the gas costs for deployment and function calls.
2. **Efficient Storage Management**: Struct packing and minimal storage operations were used to reduce gas costs.
3. **Reduced External Calls**: Minimizing external contract calls and transferring only essential data.
4. **Selective Function Visibility**: Setting appropriate function visibility (e.g., external, public) based on usage.

## Conclusion
The application of these optimization strategies has led to efficient gas usage across the Supply Chain DApp v1. Continuous monitoring and optimization are necessary to maintain efficiency, especially in response to Ethereum network changes and gas price fluctuations.
