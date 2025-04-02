import React from "react";
import { useEffect, useState } from 'react'

import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";


const Fabricate = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [parts, setParts] = useState([]);

    // Add part state
    const [showAddPart, setShowAddPart] = useState(false); 
    const [isAddPartSubmitting, setIsAddPartSubmitting] = useState(false);
    const [addPartName, setAddPartName] = useState('');
    const [addPartQuantity, setAddPartQuantity] = useState(0);
    const [addPartQuantityUnit, setAddPartQuantityUnit] = useState('');
    const [addPartCost, setAddPartCost] = useState(0);
    const isAddPartValid = () => {
        return (
            addPartName.trim() !== '' &&
            !isNaN(Number(addPartQuantity)) &&
            addPartQuantityUnit.trim() !== '' &&
            !isNaN(Number(addPartCost))
        );
    };
    
    const loadContractData = async () => {
        if (contract) {
            try {
                const loadedParts = [];
                
                const partCount = await contract.partCount();
    
                for (let i = 1; i <= partCount; i++) {
                    const [name, quantity, quantity_unit, cost] = await contract.parts(i);
                    loadedParts.push({
                        id: i.toString(),
                        name: name,
                        quantity: quantity.toString(),
                        quantity_unit: quantity_unit,
                        cost: cost.toString()
                    });
                }
    
                setParts(loadedParts);
            } catch (error) {
                console.error("Error loading parts:", error);
            }
        }
    }

    // Post add part form to blockchain
    const postAddPart = async () => {
        if (!contract) return;

        setIsAddPartSubmitting(true);

        try {
            const transaction = await contract.addNewPart(
                addPartName,
                BigInt(addPartQuantity),
                addPartQuantityUnit,
                BigInt(addPartCost)
            )

            setShowAddPart(false);
            loadContractData();
        } catch (err){
            console.error("Add part failed:", err);
        } finally {
            setIsAddPartSubmitting(false);
        }
    }
    
    useEffect(() => {
        loadContractData();
    }, [contract]);

    return (
        <Container fluid>
            <h2>Parts</h2>
            <Nav.Item>
                <Button variant="danger" onClick={() => setShowAddPart(true)}>Add Part</Button>
                <Button variant="secondary" onClick={() => loadContractData()}><i className="bi bi-arrow-clockwise"></i></Button>
            </Nav.Item>
            {parts.length > 0 ? (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>QTY</th>
                        <th>QTY Unit</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {parts.map(part => (
                        <tr key={part.id}>
                            <td>{part.id}</td>
                            <td>{part.name}</td>
                            <td>{part.quantity}</td>
                            <td>{part.quantity_unit}</td>
                            <td>{part.cost}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            ) : (
            <p>Nothing to show.</p>
            )}
            <Modal show={showAddPart} onHide={() => setShowAddPart(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Part</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => setAddPartName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantity">
                            <Form.Label>Initial Quantity</Form.Label>
                            <Form.Control type="number" onChange={(e) => setAddPartQuantity(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantityUnit">
                            <Form.Label>Quantity Unit</Form.Label>
                            <Form.Control type="text" onChange={(e) => setAddPartQuantityUnit(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCost">
                            <Form.Label>Cost Per Unit</Form.Label>
                            <Form.Control type="number" onChange={(e) => setAddPartCost(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddPart(false)}>Close</Button>
                    <Button variant="danger" disabled={!isAddPartValid() || isAddPartSubmitting} onClick={postAddPart}>Save</Button>
                    {isAddPartSubmitting ? "Processing..." : "Add a new part"}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Fabricate;