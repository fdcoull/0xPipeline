// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TransportControl {
    address public owner;
    uint256 public shipmentCount;
    uint256[4] public prices;

    // Enums
    enum Status {Pending, InBound, Shipped, Received, Cancelled}
    enum Method {Standard, TwoDay, NextDay, Weekend}

    // Structs
    struct Shipment {
        address sender;
        uint256 senderOrderNo;
        uint256 weight;
        address recipient;
        Status status;
        Method method;
        uint256 cost;
    }

    // Mappings
    mapping(uint256 => Shipment) public shipments;

    constructor() {
        // Set owner to deployer address
        owner = msg.sender;
        shipmentCount = 0;

        prices[uint256(Method.Standard)] = 1;
        prices[uint256(Method.TwoDay)] = 2;
        prices[uint256(Method.NextDay)] = 3;
        prices[uint256(Method.Weekend)] = 4;
    }

    // Modifiers
    // Require user is the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Create shipment
    function ship(uint256 _senderOrderNo, uint256 _weight, address _recipient, Method _method) public payable {
        uint256 cost = prices[uint256(_method)];
        Shipment memory shipment = Shipment(msg.sender, _senderOrderNo, _weight, _recipient, Status.Pending, _method, cost);

        // Require payment to be over or equal to method price
        require(msg.value >= cost);

        shipmentCount++;

        shipments[shipmentCount] = shipment;
    }

    // Update shipment status
    function updateStatus(uint256 _orderNo, Status _status) public onlyOwner {
        shipments[_orderNo].status = _status;
    }
}