// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role. This is used to assign specific roles to addresses, like admin, moderator, etc.
 */
library Roles {
    struct Role {
        mapping(address => bool) bearer;
    }

    /**
     * @dev Give an account access to this role.
     * @notice Assigns a role to an account.
     * @param role The Role structure to modify.
     * @param account The address to be given access to the role.
     */
    function add(Role storage role, address account) internal {
        require(account != address(0), "Roles: account is the zero address");
        require(!has(role, account), "Account already has role");

        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     * @notice Removes a role from an account.
     * @param role The Role structure to modify.
     * @param account The address to remove access from the role.
     */
    function remove(Role storage role, address account) internal {
        require(account != address(0), "Roles: account is the zero address");
        require(has(role, account), "Roles: account does not have role");

        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @notice Verifies if the account has a specific role.
     * @param role The Role structure to check.
     * @param account The address to verify.
     * @return bool True if the account has the role, false otherwise.
     */
    function has(
        Role storage role,
        address account
    ) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}
