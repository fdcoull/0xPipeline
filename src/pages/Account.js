import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from 'react';

import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";

const Account = ({ setView, account, loadBlockchainData, pipelineContract }) => {
    const [materialProviders, setMaterialProviders] = useState([]);
    const [transportProviders, setTransportProviders] = useState([]);
    const [fabricateProviders, setFabricateProviders] = useState([]);

    // Form state
    const [showAddProvider, setShowAddProvider] = useState(false);
    const [selectedProviderType, setSelectedProviderType] = useState("");
    const [newProviderAddress, setNewProviderAddress] = useState("");

    const loadProviderData = async () => {
        if (pipelineContract) {
            try {
                const [materials, transactions, fabrications] = await Promise.all([
                    pipelineContract.getAllMaterialProviders(),
                    pipelineContract.getAllTransportProviders(),
                    pipelineContract.getAllFabricateProviders()
                ]);

                setMaterialProviders(materials);
                setTransportProviders(transactions);
                setFabricateProviders(fabrications);
                
            } catch (error) {
                console.error("Error loading providers:", error);
            }
        }
    }

    const addProvider = async () => {
        if (!pipelineContract || !newProviderAddress) return;

        try {
            let transaction;
            
            if (selectedProviderType === "material") {
                transaction = await pipelineContract.addMaterialProvider(newProviderAddress);
            } else if (selectedProviderType === "fabricate") {
                transaction = await pipelineContract.addFabricateProvider(newProviderAddress);
            } else if (selectedProviderType === "transport") {
                transaction = await pipelineContract.addTransportProvider(newProviderAddress);
            }
    
            setShowAddProvider(false);
            setNewProviderAddress("");
            loadProviderData();
        } catch (error) {
            console.error("Error adding provider:", error);
        }
    }

    useEffect(() => {
            loadProviderData();
        }, [pipelineContract]);

    return (
        <Container fluid>
            <h2>Account page</h2>

            <Button variant="info" onClick={() => loadBlockchainData()}>Login</Button>
            <p>Connected account: {account}</p>

            {account ? (
                <>
                <h3>Material Providers</h3>
                <Button variant="warning" onClick={() => {setShowAddProvider(true); setSelectedProviderType("material");}}>Add</Button>
                <ul>
                    {materialProviders.length > 0 ? (
                        materialProviders.map((provider, index) => (
                            <li key={index}>{provider}</li>
                        ))
                    ) : (
                        <p>No material providers added yet.</p>
                    )}
                </ul>
                
                <h3>Fabricate Providers</h3>
                <Button variant="danger" onClick={() => {setShowAddProvider(true); setSelectedProviderType("fabricate");}}>Add</Button>
                <ul>
                    {fabricateProviders.length > 0 ? (
                        fabricateProviders.map((provider, index) => (
                            <li key={index}>{provider}</li>
                        ))
                    ) : (
                        <p>No fabricate providers added yet.</p>
                    )}
                </ul>
                
                <h3>Transport Providers</h3>
                <Button variant="primary" onClick={() => {setShowAddProvider(true); setSelectedProviderType("transport");}}>Add</Button>
                <ul>
                    {transportProviders.length > 0 ? (
                        transportProviders.map((provider, index) => (
                            <li key={index}>{provider}</li>
                        ))
                    ) : (
                        <p>No transport providers added yet.</p>
                    )}
                </ul>
                </>
            ) : (
                <p>Please connect to your wallet.</p>
            )}
            <Modal show={showAddProvider} onHide={() => setShowAddProvider(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add {selectedProviderType.charAt(0).toUpperCase() + selectedProviderType.slice(1)} Provider</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Provider Address</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="0x..." 
                            value={newProviderAddress} 
                            onChange={(e) => setNewProviderAddress(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddProvider(false)}>Close</Button>
                <Button variant="info" onClick={addProvider}>Save</Button>
            </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Account;