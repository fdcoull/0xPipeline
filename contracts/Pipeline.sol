// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Pipeline {
    address public owner;
    address[] public materialProviders;
    address[] public fabricateProviders;
    address[] public transportProviders;

    constructor() {
        // Set owner to deployer address
        owner = msg.sender;
    }

    // Modifiers
    // Require user is the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Getters
    function getAllMaterialProviders() public view returns (address[] memory) {
        return materialProviders;
    }

    function getAllFabricateProviders() public view returns (address[] memory) {
        return fabricateProviders;
    }

    function getAllTransportProviders() public view returns (address[] memory) {
        return transportProviders;
    }

    // Setters
    function addMaterialProvider(string memory _provider) public onlyOwner {
        materialProviders.push(_provider);
    }

    function addFabricateProvider(string memory _provider) public onlyOwner {
        fabricateProviders.push(_provider);
    }

    function addTransportProvider(string memory _provider) public onlyOwner {
        transportProviders.push(_provider);
    }
}