// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Owned.sol";
import "./Roles.sol";

/**
 * @title Distributor Role
 * @dev Contract to manage a distributor role, inherited from the Owned contract
 */
contract DistributorRole is Owned {
    using Roles for Roles.Role;

    // Event for logging the addition of a distributor
    event DistributorAdded(address indexed account);
    // Event for logging the removal of a distributor
    event DistributorRemoved(address indexed account);

    // Structure to hold distributor roles
    Roles.Role private distributors;

    /**
     * @dev Assigns the deployer as the first distributor on contract initialization
     */
    constructor() {
        _addDistributor(msg.sender);
    }

    /**
     * @dev Modifier to check if the caller has distributor role
     */
    modifier onlyDistributor() {
        require(isDistributor(msg.sender), "Caller is not a distributor");
        _;
    }

    /**
     * @notice Check if an account is a distributor
     * @dev Queries the distributors role structure for the account presence
     * @param account The address to verify
     * @return True if the account is a distributor, false otherwise
     */
    function isDistributor(address account) public view returns (bool) {
        return distributors.has(account);
    }

    /**
     * @notice Add a new distributor
     * @dev Adds a new account to the distributors role structure
     * @param account The address to grant distributor role
     */
    function addDistributor(address account) public onlyOwner {
        _addDistributor(account);
    }

    /**
     * @notice Renounce the distributor role
     * @dev Removes the calling account from the distributors role structure
     */
    function renounceDistributor() public {
        _removeDistributor(msg.sender);
    }

    /**
     * @dev Internal function to add a new distributor
     * @param account The address to add as a distributor
     */
    function _addDistributor(address account) internal {
        distributors.add(account);
        emit DistributorAdded(account);
    }

    /**
     * @dev Internal function to remove a distributor
     * @param account The address to remove from the distributor role
     */
    function _removeDistributor(address account) internal {
        distributors.remove(account);
        emit DistributorRemoved(account);
    }
}
