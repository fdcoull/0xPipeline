import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers'

import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";

// ABI
import FabricateControl from '../abis/FabricateControl.json';
import TransportControl from '../abis/TransportControl.json';

const AccountTransport = ({ setView, account, loadBlockchainData, pipelineContract, signer, myFabricateContract }) => {
    //const [providerProducts, setProviderProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [shippedOrders, setShippedOrders] = useState([]);

    const loadContractData = async () => {
        if (myFabricateContract && pipelineContract) {
            try {
                const loadedOrders = [];
                const shippedOrders = [];
                const unshippedOrders = [];

                const orderCount = await myFabricateContract.orderCount();
                const account = await signer.getAddress();

                for (let i = 1; i <= orderCount; i++) {
                    const [time, productId, quantity, buyer] = await myFabricateContract.orders(i);
                    const timestamp = Number(time.toString());
                    const orderDate = new Date(timestamp * 1000);
                    const formattedDate = orderDate.toISOString().split('T')[0];
                    loadedOrders.push({
                        id: i.toString(),
                        time: formattedDate,
                        productId: productId.toString(),
                        quantity: quantity.toString(),
                        buyer: buyer
                    });
                }

                const transportProviderAddresses = await pipelineContract.getAllTransportProviders();
                const shippedOrderNumbers = [];

                for (const address of transportProviderAddresses) {
                    const transportProvider = new ethers.Contract(address, TransportControl, signer);

                    const shipmentCount = await transportProvider.shipmentCount();

                    for (let i = 0; i < shipmentCount; i++) {
                        const shipment = await transportProvider.shipments(i);

                        const { senderOrderNo, sender, recipient, status, method, cost, weight } = shipment;

                        if (sender === account) {
                            shippedOrderNumbers.add(senderOrderNo.toString());

                            const order = loadedOrders.find(order => order.id === senderOrderNo.toString());

                            if (order) {
                                shippedOrders.push({
                                    ...order,
                                    carrier: address,
                                    shipmentMethod: method,
                                    shipmentStatus: status,
                                    shipmentCost: cost,
                                    shipmentWeight: weight,
                                })
                            }
                        }
                    }
                }

                loadedOrders.forEach(order => {
                    if (!shippedOrderNumbers.includes(order.id)) {
                        unshippedOrders.push(order);
                    }
                });

                setOrders(unshippedOrders);
                setShippedOrders(shippedOrders);

                console.log(unshippedOrders);
                console.log(shippedOrders);
            } catch (error) {
                console.error("Error loading orders:", error);
            }
        }
    }

    useEffect(() => {
        loadContractData();
    }, []);
    
    return (
        <Container fluid>
            <h3>Unshipped Orders</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Product ID</th>
                        <th>Quantity</th>
                        <th>Buyer</th>
                        <th>Order Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.productId}</td>
                            <td>{order.quantity}</td>
                            <td>{order.buyer}</td>
                            <td>{order.time}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h3>Shipped Orders</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Product ID</th>
                        <th>Quantity</th>
                        <th>Buyer</th>
                        <th>Shipped Date</th>
                        <th>Carrier</th>
                    </tr>
                </thead>
                <tbody>
                    {shippedOrders.map((shipment) => (
                        <tr key={shipment.id}>
                            <td>{shipment.id}</td>
                            <td>{shipment.productId}</td>
                            <td>{shipment.quantity}</td>
                            <td>{shipment.buyer}</td>
                            <td>{shipment.time}</td>
                            <td>{shipment.carrier}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default AccountTransport