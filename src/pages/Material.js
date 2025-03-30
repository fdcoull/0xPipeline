import React from "react";
import { useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";


const Material = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [materials, setMaterials] = useState([]);

    // List material state
    const [showListMaterial, setShowListMaterial] = useState(false); 
    const [isListMaterialSubmitting, setIsListMaterialSubmitting] = useState(false);
    const [listMaterialName, setListMaterialName] = useState('');
    const [listMaterialQuantity, setListMaterialQuantity] = useState(0);
    const [listMaterialQuantityUnit, setListMaterialQuantityUnit] = useState('');
    const [listMaterialCost, setListMaterialCost] = useState(0);
    const isListMaterialValid = () => {
        return (
            listMaterialName.trim() !== '' &&
            !isNaN(Number(listMaterialQuantity)) &&
            listMaterialQuantityUnit.trim() !== '' &&
            !isNaN(Number(listMaterialCost))
        );
    };

    // Add batch state
    const [showAddBatch, setShowAddBatch] = useState(false); 
    const [isAddBatchSubmitting, setIsAddBatchSubmitting] = useState(false);
    const [addBatchId, setAddBatchId] = useState(0);
    const [addBatchQuantity, setAddBatchQuantity] = useState(0);
    const isAddBatchValid = () => {
        return (
            !isNaN(Number(addBatchId)) &&
            !isNaN(Number(addBatchQuantity))
        );
    };

    const loadContractData = async () => {
        if (contract) {
            try {
                const loadedMaterials = [];
                
                const materialCount = await contract.materialCount();
    
                for (let i = 1; i <= materialCount; i++) {
                    //const material = await contract.materials(i);
                    const [name, quantity, quantity_unit, cost] = await contract.materials(i);
                    loadedMaterials.push({
                        id: i.toString(),
                        name: name,
                        quantity: quantity.toString(),
                        quantity_unit: quantity_unit,
                        cost: cost.toString()
                    });
                }
    
                setMaterials(loadedMaterials);
            } catch (error) {
                console.error("Error loading materials:", error);
            }
            
        }
        
    }

    // Post list material form to blockchain
    const postListMaterial = async () => {
            if (!contract) return;
    
            setIsListMaterialSubmitting(true);
    
            try {
                const transaction = await contract.list(
                    listMaterialName,
                    BigInt(listMaterialQuantity),
                    listMaterialQuantityUnit,
                    BigInt(listMaterialCost)
                );
    
                setShowListMaterial(false);
                loadContractData();
            } catch (err){
                console.error("List material failed:", err);
            } finally {
                setIsListMaterialSubmitting(false);
            }
    }

    useEffect(() => {
        loadContractData();
    }, [contract]);

    return (
        <Container fluid>
            <h2>Material page</h2>
            <Nav.Item>
                <Button variant="warning" onClick={() => setShowListMaterial(true)}>List Material</Button>
                </Nav.Item>
            {materials.length > 0 ? (
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
                    {materials.map(material => (
                        <tr key={material.id}>
                            <td>{material.id}</td>
                            <td>{material.name}</td>
                            <td>{material.quantity}</td>
                            <td>{material.quantity_unit}</td>
                            <td>{material.cost}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            ) : (
            <p>Nothing to show.</p>
            )}
            <Modal show={showListMaterial} onHide={() => setShowListMaterial(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>List Material</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => setListMaterialName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantity">
                            <Form.Label>Initial Quantity</Form.Label>
                            <Form.Control type="number" onChange={(e) => setListMaterialQuantity(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantityUnit">
                            <Form.Label>Quantity Unit</Form.Label>
                            <Form.Control type="text" onChange={(e) => setListMaterialQuantityUnit(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCost">
                            <Form.Label>Cost Per Unit</Form.Label>
                            <Form.Control type="number" onChange={(e) => setListMaterialCost(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowListMaterial(false)}>Close</Button>
                    <Button variant="primary" disabled={!isListMaterialValid() || isListMaterialSubmitting} onClick={postListMaterial}>Save</Button>
                    {isListMaterialSubmitting ? "Processing..." : "List a new material"}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Material;