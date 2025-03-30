import React from "react";
import { useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar';

import { parseEther } from 'ethers';
import { ethers } from 'ethers';

import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';

const Transport = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [shipments, setShipments] = useState([]);
    const [showAddMenu, setShowAddMenu] = useState(false); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add shipment fields
    const [orderNo, setOrderNo] = useState('');
    const [weight, setWeight] = useState('');
    const [recipient, setRecipient] = useState('');
    const [method, setMethod] = useState(0);

    // Validation
    const isFormValid = () => {
        return (
            orderNo.trim() !== '' &&
            !isNaN(Number(weight)) &&
            Number(weight) > 0 &&
            recipient.trim() !== ''
        );
    };

    
    const methodPrices = [1, 2, 3, 4];
    
    const loadContractData = async () => {
        if (contract) {
            try {
                const loadedShipments = [];
                
                const shipmentCount = await contract.shipmentCount();
    
                for (let i = 1; i <= shipmentCount; i++) {
                    const [sender, senderOrderNo, weight, recipient, status, method, cost] = await contract.shipments(i);
                    loadedShipments.push({
                        id: i.toString(),
                        sender: sender,
                        senderOrderNo: senderOrderNo,
                        weight: weight.toString(),
                        recipient: recipient,
                        status: status.toString(),
                        method: method.toString(),
                        cost: cost.toString()
                    });
                }
    
                setShipments(loadedShipments);
            } catch (error) {
                console.error("Error loading materials:", error);
            }
        }
    }

    const postShipment = async () => {
        if (!contract) return;

        setIsSubmitting(true);

        try {
            const transaction = await contract.ship(
                BigInt(orderNo),
                BigInt(weight),
                recipient,
                method,
                { value: ethers.parseUnits(methodPrices[method].toString(), "ether") }
            );

            setShowAddMenu(false);
            loadContractData();
        } catch (err){
            console.error("Shipment failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        loadContractData();
    }, [contract]);

    return (
        <Container fluid>
            <h2>Transport page</h2>
            <Nav.Item>
                <Button variant="primary" onClick={() => setShowAddMenu(true)}>Add</Button>
            </Nav.Item>
            {shipments.length > 0 ? (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sender</th>
                        <th>Sender Order No.</th>
                        <th>Weight</th>
                        <th>Recipient</th>
                        <th>Status</th>
                        <th>Method</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {shipments.map(shipment => (
                        <tr key={shipment.id}>
                            <td>{shipment.id}</td>
                            <td>{shipment.sender}</td>
                            <td>{shipment.senderOrderNo}</td>
                            <td>{shipment.weight}</td>
                            <td>{shipment.recipient}</td>
                            <td>{shipment.status}</td>
                            <td>{shipment.method}</td>
                            <td>{shipment.cost}</td>
                        </tr>
                    ))}
                    {console.log(shipments)}
                </tbody>
            </Table>
            ) : (
            <p>Nothing to show.</p>
            )}
            <Modal show={showAddMenu} onHide={() => setShowAddMenu(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Shipment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formSenderOrderNo">
                            <Form.Label>Sender Order No.</Form.Label>
                            <Form.Control type="number" onChange={(e) => setOrderNo(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formWeight">
                            <Form.Label>Weight</Form.Label>
                            <Form.Control type="number" onChange={(e) => setWeight(parseInt(e.target.value))}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formRecipient">
                            <Form.Label>Recipient</Form.Label>
                            <Form.Control type="text" onChange={(e) => setRecipient(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formMethod">
                            <Form.Label>Method</Form.Label>
                            <Form.Select onChange={(e) => setMethod(parseInt(e.target.value))}>
                                <option value="0">Standard</option>
                                <option value="1">Two Day</option>
                                <option value="2">Next Day</option>
                                <option value="3">Weekend</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddMenu(false)}>Close</Button>
                    <Button variant="primary" disabled={!isFormValid() || isSubmitting} onClick={postShipment}>Save</Button>
                    {isSubmitting ? "Processing..." : "Create Shipment"}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Transport;