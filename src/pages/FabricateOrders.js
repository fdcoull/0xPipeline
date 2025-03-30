import React from "react";
import { useEffect, useState } from 'react'
import { ethers } from 'ethers';

import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

const FabricateOrders = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [orders, setOrders] = useState([]);

    // Add order state
    const [showAddOrder, setShowAddOrder] = useState(false); 
    const [isAddOrderSubmitting, setIsAddOrderSubmitting] = useState(false);
    const [addOrderId, setAddOrderId] = useState(0);
    const [addOrderQuantity, setAddOrderQuantity] = useState(0);
    const isAddOrderValid = () => {
        return (
            !isNaN(Number(addOrderId)) &&
            !isNaN(Number(addOrderQuantity))
        );
    };
    
    const loadContractData = async () => {
        if (contract) {
            try {
                const loadedOrders = [];
                
                const orderCount = await contract.orderCount();
    
                for (let i = 1; i <= orderCount; i++) {
                    const [time, productId, quantity, buyer] = await contract.orders(i);
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
    
                setOrders(loadedOrders);
            } catch (error) {
                console.error("Error loading orders:", error);
            }
        }
    }

    // Post add order form to blockchain
    const postAddOrder = async () => {
        if (!contract) return;

        setIsAddOrderSubmitting(true);

        try {
            const product = await contract.products(BigInt(addOrderId));
            const costPerUnit = BigInt(product.cost);
            const totalCost = costPerUnit * BigInt(addOrderQuantity);

            const transaction = await contract.buy(
                BigInt(addOrderId),
                BigInt(addOrderQuantity),
                { value: ethers.parseUnits(totalCost.toString(), "ether") }
            );

            setShowAddOrder(false);
            loadContractData();
        } catch (err){
            console.error("Add order failed:", err);
        } finally {
            setIsAddOrderSubmitting(false);
        }
    }
    
    useEffect(() => {
        loadContractData();
    }, [contract]);

    return (
        <Container fluid>
            <h2>Orders</h2>
            <Nav.Item>
                <Button variant="danger" className="m-1" onClick={() => setShowAddOrder(true)}>Add Order</Button>
            </Nav.Item>
            {orders.length > 0 ? (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Time</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Buyer</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.time}</td>
                            <td>{order.productId}</td>
                            <td>{order.quantity}</td>
                            <td>{order.buyer}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            ) : (
            <p>Nothing to show.</p>
            )}
            <Modal show={showAddOrder} onHide={() => setShowAddOrder(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="number" onChange={(e) => setAddOrderId(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" onChange={(e) => setAddOrderQuantity(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {isAddOrderSubmitting ? "Processing..." : "Add a new order"}
                    <Button variant="secondary" onClick={() => setShowAddOrder(false)}>Close</Button>
                    <Button variant="danger" disabled={!isAddOrderValid() || isAddOrderSubmitting} onClick={postAddOrder}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default FabricateOrders;