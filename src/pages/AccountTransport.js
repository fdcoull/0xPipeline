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
    const [transportProviders, setTransportProviders] = useState([]);

    // Modal state
    const [showShipModal, setShowShipModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState("");
    const [selectedMethod, setSelectedMethod] = useState(0);
    const [selectedOrderNo, setSelectedOrderNo] = useState("");

    // Change this to get from contract
    const methodCost = [1, 2, 3, 4];

    const loadContractData = async () => {
        if (myFabricateContract && pipelineContract && account) {
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
                setTransportProviders(transportProviderAddresses);
                
                const shippedOrderNumbers = [];

                // Loop through transport providers
                for (const address of transportProviderAddresses) {
                    const transportProvider = new ethers.Contract(address, TransportControl, signer);

                    const shipmentCount = await transportProvider.shipmentCount();

                    // Loop through shipments
                    for (let i = 0; i < shipmentCount; i++) {
                        const shipment = await transportProvider.shipments(i);

                        const { senderOrderNo, sender, recipient, status, method, cost, weight } = shipment;

                        if (sender === account) {
                            if (!shippedOrderNumbers.includes(senderOrderNo.toString())) {
                                shippedOrderNumbers.push(senderOrderNo.toString());
                            }

                            const order = loadedOrders.find(order => order.id === senderOrderNo.toString());

                            if (order) {
                                shippedOrders.push({
                                    ...order,
                                    carrier: address,
                                    shipmentMethod: method,
                                    shipmentStatus: status,
                                    shipmentCost: cost,
                                    shipmentWeight: weight,
                                });
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
            } catch (error) {
                console.error("Error loading orders:", error);
            }
        }
    }

    const shipOrder = async () => {
        
        if (!selectedProvider || !selectedOrderNo) {
            return;
        }

        const transportContract = new ethers.Contract(selectedProvider, TransportControl, signer);

        // Set this to calculate from order contents later
        const weight = 1;
        const method = selectedMethod;
        const senderOrderNo = selectedOrderNo;

        try {
            const transaction = await transportContract.ship(
                senderOrderNo,
                weight,
                account,
                method,
                { value: methodCost[selectedMethod] }
            );

            setShowShipModal(false);

            loadContractData();

        } catch (err) {
            console.error("Error shipping order:", err);
        }

    }

    useEffect(() => {
        loadContractData();
    }, []);
    
    return (
        <Container fluid>
            <h2>Transport Providers</h2>
            {account && transportProviders && (
            <>
            <Button variant="secondary" onClick={() => loadContractData()}><i className="bi bi-arrow-clockwise"></i></Button>
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
                            <td><Button variant="primary" onClick={() => {setShowShipModal(true), setSelectedOrderNo(order.id)}}>Ship</Button></td>
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
            
                <Modal show={showShipModal} onHide={() => setShowShipModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Ship Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTransportProvider">
                            <Form.Label>Select Transport Provider</Form.Label>
                            <Form.Control as="select" value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)}>
                                <option value="">Select Provider</option>
                                {transportProviders.map((provider) => (
                                    <option key={provider} value={provider}>
                                        {provider}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formShippingMethod">
                            <Form.Label>Shipping Method</Form.Label>
                            <Form.Control as="select" value={selectedMethod} onChange={(e) => setSelectedMethod(parseInt(e.target.value))}>
                                <option value={0}>Standard</option>
                                <option value={1}>TwoDay</option>
                                <option value={2}>NextDay</option>
                                <option value={3}>Weekend</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowShipModal(false)}>Close</Button>
                    <Button variant="primary" onClick={shipOrder}>Ship Order</Button>
                </Modal.Footer>
            </Modal>
            </>
            )}
        </Container>
    );
}

export default AccountTransport