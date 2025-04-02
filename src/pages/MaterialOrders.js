import React from "react";
import { useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar';
import { ethers } from 'ethers';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";


const MaterialOrders = ({ setView, view, account, loadBlockchainData, contract }) => {
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
                
                const materialCount = await contract.orderCount();
    
                for (let i = 1; i <= materialCount; i++) {
                    const [time, materialId, quantity, address] = await contract.orders(i);
                    const timestamp = Number(time.toString());
                    const orderDate = new Date(timestamp * 1000);
                    const formattedDate = orderDate.toISOString().split('T')[0];

                    loadedOrders.push({
                        id: i.toString(),
                        time: formattedDate,
                        materialId: materialId.toString(),
                        quantity: quantity.toString(),
                        address: address
                    });
                }
    
                setOrders(loadedOrders);
            } catch (error) {
                console.error("Error loading materials:", error);
            }
            
        }
        
    }

    // Post add order form to blockchain
    const postAddOrder = async () => {
        if (!contract) return;

        setIsAddOrderSubmitting(true);

        try {
            const material = await contract.materials(BigInt(addOrderId));
            const costPerUnit = BigInt(material.cost);
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
                <Button variant="warning" className="m-1" onClick={() => setShowAddOrder(true)}>Add Order</Button>
                <Button variant="secondary" onClick={() => loadContractData()}><i className="bi bi-arrow-clockwise"></i></Button>
            </Nav.Item>
            {orders.length > 0 ? (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Time</th>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.time}</td>
                            <td>{order.materialId}</td>
                            <td>{order.quantity}</td>
                            <td>{order.address}</td>
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
                    <Button variant="primary" disabled={!isAddOrderValid() || isAddOrderSubmitting} onClick={postAddOrder}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default MaterialOrders;