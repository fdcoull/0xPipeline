// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FabricateControl {
    address public owner;
    uint256 public partCount;
    uint256 public orderCount;
    uint256 public productCount;

    // Structs
    // Individual part
    struct Part {
        string name;
        uint256 quantity;
        string quantity_unit;
        uint256 cost;
    }

    // BOM component
    struct Component {
        uint256 partId;
        uint256 quantity;
    }

    // Finished product
    struct Product {
        string name;
        uint256 quantity;
        string quantity_unit;
        uint256 cost;
    }

    // Order details
    struct Order {
        uint256 time;
        uint256 productId;
        uint256 quantity;
        address buyer;
    }

    // Mappings
    // Mapping for individual parts
    mapping(uint256 => Part) public parts;

    // Mapping for bill of materials for products - id, qty
    mapping(uint256 => Component[]) public boms;

    // Mapping for products (id same as BOM)
    mapping(uint256 => Product) public products;

    // Mapping for orders
    mapping(uint256 => Order) public orders;

    constructor() {
        // Set owner to deployer address
        owner = msg.sender;
        orderCount = 0;
    }

    // Modifiers
    // Require user is the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Add new part
    function addNewPart(
        string memory _name,
        uint256 _quantity,
        string memory _quantity_unit,
        uint256 _cost
    ) public onlyOwner {
        Part memory part = Part(_name, _quantity, _quantity_unit, _cost);

        partCount++;
        parts[partCount] = part;
    }

    // Increase part stock
    function increasePartStock(
        uint256 _id,
        uint256 _quantity
    ) public onlyOwner {
        Part storage part = parts[_id];
        part.quantity += _quantity;
    }

    // Add new BOM
    function addNewBomProduct(Component[] memory _parts, string memory _name, string memory _quantity_unit, uint256 _cost) public onlyOwner {
        productCount++;
        
        for (uint256 i = 0; i < _parts.length; i++) {
            boms[productCount].push(Component({
                partId: _parts[i].partId,
                quantity: _parts[i].quantity
            }));
        }
        products[productCount] = Product(_name, 0, _quantity_unit, _cost);
    }

    // Get BOM by ID
    function getBom(uint256 _id) public view returns (Component[] memory) {
        return boms[_id];
    }

    // Manufacture product
    function manufactureProduct(uint256 _id, uint256 _quantity) public onlyOwner {
        Component[] memory bom = boms[_id];

        for (uint256 i = 0; i < bom.length; i++) {
            Component memory part = bom[i];

            // Calculate total quantity of parts to deduct
            uint256 totalQuantity = part.quantity * _quantity;

            // Subtract quantity from each parts stock level
            parts[part.partId].quantity -= totalQuantity;
        }

        // Add to products stock count
        products[_id].quantity += _quantity;
    }

    function buy(uint256 _id, uint256 _quantity) public payable {
        Product memory product = products[_id];

        // Require payment to be over or qual to material cost * quantity ordering
        require(msg.value >= product.cost * _quantity, "Insufficient funds");

        // Require material quantity to be enough for purchase
        require(product.quantity >= _quantity, "Insufficient stock");

        // Create order
        Order memory order = Order(block.timestamp, _id, _quantity, msg.sender);

        // Increase orderCount
        orderCount++;

        // Subtract stock
        products[_id].quantity = products[_id].quantity - _quantity;

        // Set orders mapping
        orders[orderCount] = order;
    }

    function getComponentCount(uint256 bomId) public view returns (uint256) {
        return boms[bomId].length;
    }
}