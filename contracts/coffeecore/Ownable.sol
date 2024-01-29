// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../coffeebase/SupplyChain.sol";

/** @title Ownable Contract
 * @dev Extends SupplyChain with ownership control functionalities
 */
contract Ownable is SupplyChain {
    // Event for logging ownership transfer
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /** @notice Initializes the contract setting the deployer as the initial owner.
     * @dev Sets the contract's owner to the address that deploys the contract.
     */
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), owner);
    }

    /** @notice Checks if the calling address is the owner of the contract.
     * @return True if the caller is the owner, otherwise false.
     */
    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    /** @notice Allows the current owner to renounce ownership of the contract.
     * @dev Leaves the contract without any owner, unable to call functions with onlyOwner modifier.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(owner, address(0));
        owner = address(0);
    }

    /** @notice Transfers ownership of the contract to a new address.
     * @dev Can only be called by the current owner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
