// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MaterialControl {
    address public owner;

    // Structs
    struct Material {
        string name;
        uint256 quantity;
        string quantity_unit;
        uint256 cost;
    }

    // Mappings
    mapping(uint256 => Material) public materials;

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

    // List new material
    function list(
        uint256 _id, 
        string memory _name,
        uint256 _quantity,
        string memory _quantity_unit,
        uint256 _cost
    ) public onlyOwner {
        Material memory material = Material(_name, _quantity, _quantity_unit, _cost);

        materials[_id] = material;
    }

    // Add batch to material entry
    function addBatch(
        uint256 _id,
        uint256 _quantity
    ) public onlyOwner {
        materials[_id].quantity += _quantity;
    }


}