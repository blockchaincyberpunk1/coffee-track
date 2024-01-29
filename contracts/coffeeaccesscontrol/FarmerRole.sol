// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Owned.sol";
import "./Roles.sol";

/** @title A contract for managing Farmer roles
 * @dev Extends an 'Owned' contract with specific role management logic for a Farmer role
 */
contract FarmerRole is Owned {
    using Roles for Roles.Role;

    // Events to indicate the addition or removal of a farmer
    event FarmerAdded(address indexed account);
    event FarmerRemoved(address indexed account);

    Roles.Role private farmers;

    /** @notice Initializes the contract by adding the deployer as a Farmer
     * @dev Calls internal function _addFarmer with the contract deployer's address
     */
    constructor() {
        _addFarmer(msg.sender);
    }

    /** @notice Modifier to restrict function access to only Farmer role
     * @dev Modifier that uses isFarmer to check the role before proceeding with the function
     */
    modifier onlyFarmer() {
        require(isFarmer(msg.sender), "Caller is not a farmer");
        _;
    }

    /** @notice Check if an address is a Farmer
     * @dev Checks if the provided address belongs to the farmers role
     * @param account Address to check for Farmer role
     * @return Boolean indicating if the address is a Farmer
     */
    function isFarmer(address account) public view returns (bool) {
        return farmers.has(account);
    }

    /** @notice Adds a new Farmer
     * @dev Adds a new Farmer by calling the internal _addFarmer function
     * @param account Address to be added as a Farmer
     */
    function addFarmer(address account) public onlyOwner {
        _addFarmer(account);
    }

    /** @notice Allows a Farmer to renounce their role
     * @dev Removes the sender's address from the Farmer role
     */
    function renounceFarmer() public {
        _removeFarmer(msg.sender);
    }

    /** @notice Internal function to add a new Farmer
     * @dev Adds a new address to the farmers role and emits FarmerAdded event
     * @param account Address to be added to the farmers role
     */
    function _addFarmer(address account) internal {
        farmers.add(account);
        emit FarmerAdded(account);
    }

    /** @notice Internal function to remove a Farmer
     * @dev Removes an address from the farmers role and emits FarmerRemoved event
     * @param account Address to be removed from the farmers role
     */
    function _removeFarmer(address account) internal {
        farmers.remove(account);
        emit FarmerRemoved(account);
    }
}
