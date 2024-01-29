// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Roles.sol";

/** @title MockRoles Contract
 * @dev This contract is a mock to demonstrate the use of a Roles library.
 * It provides basic role management functionalities.
 */
contract MockRoles {
    using Roles for Roles.Role;

    // The roles data structure
    Roles.Role private role;

    /** @notice Adds a role to an account
     * @dev Grants a role to the specified `account`
     * @param account The address to which the role will be added
     */
    function addRole(address account) public {
        role.add(account);
    }

    /** @notice Removes a role from an account
     * @dev Revokes a role from the specified `account`
     * @param account The address from which the role will be removed
     */
    function removeRole(address account) public {
        role.remove(account);
    }

    /** @notice Checks if an account has a role
     * @dev Verifies whether the specified `account` has a role
     * @param account The address to check for the role
     * @return bool True if the account has the role, false otherwise
     */
    function hasRole(address account) public view returns (bool) {
        return role.has(account);
    }
}
