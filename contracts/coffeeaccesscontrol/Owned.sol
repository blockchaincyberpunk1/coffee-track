// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/** @title Ownership Management Contract
 * @notice This contract sets and restricts access to certain functions exclusively to the contract owner.
 * @dev The `onlyOwner` modifier is used to restrict function access to the owner.
 */
contract Owned {
    address public owner;

    /** @notice Sets the creator of the contract as the initial owner.
     * @dev Assigns the `owner` variable to the Ethereum address that deploys the contract.
     */
    constructor() {
        owner = msg.sender;
    }

    /** @notice Ensures that a function is callable only by the contract owner.
     * @dev Modifier that uses require to restrict function access.
     * @custom:modifier onlyOwner Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}
