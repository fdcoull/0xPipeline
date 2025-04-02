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

const FabricateBOMs = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [boms, setBoms] = useState([]);
    const [expandedBoms, setExpandedBoms] = useState({});

    // Add bom state
    const [showAddBom, setShowAddBom] = useState(false); 
    const [isAddBomSubmitting, setIsAddBomSubmitting] = useState(false);
    const [addBomParts, setAddBomParts] = useState([{ partId: "", quantity: "" }]);
    const [addBomName, setAddBomName] = useState('');
    const [addBomQuantityUnit, setAddBomQuantityUnit] = useState('');
    const [addBomCost, setAddBomCost] = useState(0);
    const isAddBomValid = () => {
        return (
            addBomName.trim() !== '' &&
            addBomQuantityUnit.trim() !== '' &&
            !isNaN(Number(addBomCost))
        );
    };

    // Update BOM components
    const addBomComponent = () => {
        setAddBomParts([...addBomParts, { partId: "", quantity: "" }]);
    };
    const removeBomComponent = (index) => {
        const updatedParts = [...addBomParts];
        updatedParts.splice(index, 1);
        setAddBomParts(updatedParts);
    };
    const updateBomComponent = (index, field, value) => {
        const updatedParts = [...addBomParts];
        updatedParts[index][field] = value;
        setAddBomParts(updatedParts);
    };
    
    const loadContractData = async () => {
        if (contract) {
            try {
                const loadedBoms = [];
                
                const bomCount = await contract.productCount();
    
                for (let i = 1; i <= bomCount; i++) {
                    const [name] = await contract.products(i);
                    const componentCount = await contract.getComponentCount(i);
                    const components = [];

                    for (let j = 0; j < componentCount; j++) {
                        const component = await contract.boms(i, j);
                        components.push({
                            partId: component.partId,
                            quantity: component.quantity
                        });
                    }

                    loadedBoms.push({
                        id: i.toString(),
                        name: name,
                        components: components,
                        componentCount: componentCount
                    });
                }
    
                setBoms(loadedBoms);
            } catch (error) {
                console.error("Error loading boms:", error);
            }
        }
    }

    const postAddBom = async () => {
        if (!contract) return;

        setIsAddBomSubmitting(true);

        try {
            const componentsArray = addBomParts.map(part => ({
                partId: BigInt(part.partId),
                quantity: BigInt(part.quantity),
            }));
            const transaction = await contract.addNewBomProduct(
                componentsArray,
                addBomName,
                addBomQuantityUnit,
                BigInt(addBomCost)
            );

            setShowAddBom(false);
            loadContractData();
        } catch (err){
            console.error("Add BOM failed:", err);
        } finally {
            setIsAddBomSubmitting(false);
        }
    }

    useEffect(() => {
        loadContractData();
    }, [contract]);

    const toggleBom = (bomId) => {
        setExpandedBoms(prev => ({
            ...prev,
            [bomId]: !prev[bomId]
        }));
    };

    return (
        <Container fluid>
            <h2>BOMs</h2>
            <Nav.Item>
                <Button variant="danger" className="m-1" onClick={() => setShowAddBom(true)}>Add BOM</Button>
                <Button variant="secondary" onClick={() => loadContractData()}><i className="bi bi-arrow-clockwise"></i></Button>
            </Nav.Item>
            {boms.length > 0 ? (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Component Count</th>
                    </tr>
                </thead>
                <tbody>
                    {boms.map(bom => (
                        <>
                        <tr key={bom.id} onClick={() => toggleBom(bom.id)} style={{ cursor: 'pointer' }}>
                            <td>{bom.id}</td>
                            <td>{bom.name}</td>
                            <td>{bom.componentCount}</td>
                            <td><i className="bi bi-list"></i></td>
                        </tr>
                        {expandedBoms[bom.id] && (
                        <tr key={`components-${bom.id}`}>
                        <td colSpan="3">
                            <div style={{ padding: '10px 20px' }}>
                            <h4>Components:</h4>
                            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                                {bom.components.map((comp, i) => (
                                <li key={i}>
                                    Part {comp.partId} - Quantity: {comp.quantity}
                                </li>
                                ))}
                            </ul>
                            </div>
                        </td>
                        </tr>
                        )}
                        </>
                    ))}
                </tbody>
            </Table>
            ) : (
            <p>Nothing to show.</p>
            )}
            <Modal show={showAddBom} onHide={() => setShowAddBom(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New BOM</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => setAddBomName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantityUnit">
                            <Form.Label>Quantity Unit</Form.Label>
                            <Form.Control type="text" onChange={(e) => setAddBomQuantityUnit(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCost">
                            <Form.Label>Cost</Form.Label>
                            <Form.Control type="number" onChange={(e) => setAddBomCost(e.target.value)}></Form.Control>
                        </Form.Group>
                        <h4>BOM Components</h4>
                        {addBomParts.map((part, index) => (
                            <div key={index} className="d-flex mb-2">
                                <Form.Control type="number" placeholder="Part ID" value={part.partId} onChange={(e) => updateBomComponent(index, "partId", e.target.value)}></Form.Control>
                                <Form.Control type="number" placeholder="Quantity" value={part.quantity} onChange={(e) => updateBomComponent(index, "quantity", e.target.value)}></Form.Control>
                                <Button variant="secondary" onClick={() => removeBomComponent(index)}>Remove</Button>
                            </div>
                        ))}
                        <Button variant="secondary" onClick={addBomComponent}>Add Extra Component</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {isAddBomSubmitting ? "Processing..." : "Add a new BOM"}
                    <Button variant="secondary" onClick={() => setShowAddBom(false)}>Close</Button>
                    <Button variant="danger" disabled={!isAddBomValid() || isAddBomSubmitting} onClick={postAddBom}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default FabricateBOMs;