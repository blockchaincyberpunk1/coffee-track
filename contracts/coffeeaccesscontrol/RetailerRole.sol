// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Owned.sol";
import "./Roles.sol";

/** @title Retailer Role Management Contract
 * @dev Manages retailer roles using the Roles library, extends from the Owned contract
 */
contract RetailerRole is Owned {
    using Roles for Roles.Role;

    /// @notice Emitted when a new retailer is added
    /// @param account The address of the retailer added
    event RetailerAdded(address indexed account);

    /// @notice Emitted when a retailer is removed
    /// @param account The address of the retailer removed
    event RetailerRemoved(address indexed account);

    // Using Roles struct from Roles library to manage retailer roles
    Roles.Role private retailers;

    /** @notice Creates a RetailerRole contract and assigns the deployer as the first retailer
     * @dev The msg.sender is assigned the retailer role upon deployment
     */
    constructor() {
        _addRetailer(msg.sender);
    }

    /** @notice Modifier to restrict functions to only retailers
     * @dev Reverts if the msg.sender is not a retailer
     */
    modifier onlyRetailer() {
        require(isRetailer(msg.sender), "Caller is not a retailer");
        _;
    }

    /** @notice Checks if an address is a retailer
     * @dev Returns true if the address has the retailer role
     * @param account Address to check
     * @return Boolean indicating whether the address is a retailer
     */
    function isRetailer(address account) public view returns (bool) {
        return retailers.has(account);
    }

    /** @notice Adds the retailer role to a given address
     * @dev Can only be called by the contract owner
     * @param account Address to be added as a retailer
     */
    function addRetailer(address account) public onlyOwner {
        _addRetailer(account);
    }

    /** @notice Allows a retailer to renounce their role
     * @dev Removes the retailer role from msg.sender
     */
    function renounceRetailer() public {
        _removeRetailer(msg.sender);
    }

    /** @dev Internal function to add a new retailer
     * @param account Address to be added as a retailer
     */
    function _addRetailer(address account) internal {
        retailers.add(account);
        emit RetailerAdded(account);
    }

    /** @dev Internal function to remove a retailer
     * @param account Address to be removed as a retailer
     */
    function _removeRetailer(address account) internal {
        retailers.remove(account);
        emit RetailerRemoved(account);
    }
}
