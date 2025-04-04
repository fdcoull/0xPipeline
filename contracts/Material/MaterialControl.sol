// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MaterialControl {
    address public owner;
    uint256 public orderCount;
    uint256 public materialCount;

    // Structs
    struct Material {
        string name;
        uint256 quantity;
        string quantity_unit;
        uint256 cost;
    }

    struct Order {
        uint256 time;
        uint256 materialId;
        uint256 quantity;
        address buyer;
    }

    // Mappings
    mapping(uint256 => Material) public materials;
    mapping(uint256 => Order) public orders;

    constructor() {
        // Set owner to deployer address
        owner = msg.sender;
        orderCount = 0;
        materialCount = 0;

    }

    // Modifiers
    // Require user is the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // List new material
    function list(
        string memory _name,
        uint256 _quantity,
        string memory _quantity_unit,
        uint256 _cost
    ) public onlyOwner {
        // Create material type with parameters
        Material memory material = Material(_name, _quantity, _quantity_unit, _cost);

        // Increase material count
        materialCount++;

        // Save to materials mapping at _id parameter
        materials[materialCount] = material;
    }

    // Add batch to material entry
    function addBatch(
        uint256 _id,
        uint256 _quantity
    ) public onlyOwner {
        // Increase material in mapping by quantity
        materials[_id].quantity += _quantity;
    }

    function buy(uint256 _id, uint256 _quantity) public payable {
        // Get material with parameter _id
        Material memory material = materials[_id];

        // Require payment to be over or qual to material cost * quantity ordering
        require(msg.value >= material.cost * _quantity);

        // Require material quantity to be enough for purchase
        require(material.quantity >= _quantity);

        // Increase orderCount
        orderCount++;

        // Create order
        Order memory order = Order(block.timestamp, _id, _quantity, msg.sender);

        // Subtract stock
        materials[_id].quantity = materials[_id].quantity - _quantity;

        // Set orders mapping
        orders[orderCount] = order;
    }
}