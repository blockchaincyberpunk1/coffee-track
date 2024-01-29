// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Owned.sol";
import "./Roles.sol";

/** @title Consumer Role
 * @dev Contract to manage an 'consumer' role, inheriting from the Owned contract.
 */
contract ConsumerRole is Owned {
    using Roles for Roles.Role;

    // Events for adding and removing consumers
    event ConsumerAdded(address indexed account);
    event ConsumerRemoved(address indexed account);

    // Struct 'consumers' by inheriting from 'Roles' library, struct Role
    Roles.Role private consumers;

    /** @notice Creates the ConsumerRole contract
     * @dev Assigns the deployer as the first consumer
     */
    constructor() {
        _addConsumer(msg.sender);
    }

    /** @notice Modifier to check if the caller has the consumer role
     * @dev Throws if called by any account other than a consumer
     */
    modifier onlyConsumer() {
        require(isConsumer(msg.sender), "Caller is not a consumer");
        _;
    }

    /** @notice Checks if an account is a consumer
     * @dev Verifies consumer role from the Roles library
     * @param account The account to be verified
     * @return Boolean indicating if the account has the consumer role
     */
    function isConsumer(address account) public view returns (bool) {
        return consumers.has(account);
    }

    /** @notice Adds a consumer role to an account
     * @dev Only callable by the owner account
     * @param account The account to add as a consumer
     */
    function addConsumer(address account) public onlyOwner {
        _addConsumer(account);
    }

    /** @notice Renounce the consumer role
     * @dev Removes the consumer role from the caller account
     */
    function renounceConsumer() public {
        _removeConsumer(msg.sender);
    }

    /** @notice Internal function to add a consumer role
     * @dev Adds a new consumer and emits the ConsumerAdded event
     * @param account The account to add as a consumer
     */
    function _addConsumer(address account) internal {
        consumers.add(account);
        emit ConsumerAdded(account);
    }

    /** @notice Internal function to remove a consumer role
     * @dev Removes a consumer and emits the ConsumerRemoved event
     * @param account The account to remove as a consumer
     */
    function _removeConsumer(address account) internal {
        consumers.remove(account);
        emit ConsumerRemoved(account);
    }
}
