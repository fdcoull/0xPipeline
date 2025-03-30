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
    const [transactionProviders, setTransactionProviders] = useState([]);
    const [fabricationProviders, setFabricationProviders] = useState([]);

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

                setMaterialProviders(materialProviders);
                setTransactionProviders(transactionProviders);
                setFabricationProviders(fabricationProviders);
            } catch (error) {
                console.error("Error loading providers:", error);
            }
        }
    }

    const addProvider = async () => {
        return 0;
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
                <Button variant="warning" onClick={() => setShowAddProvider(true)}>Add</Button>
                <h3>Fabricate Providers</h3>
                <Button variant="danger" onClick={() => setShowAddProvider(true)}>Add</Button>
                <h3>Transport Providers</h3>
                <Button variant="primary" onClick={() => setShowAddProvider(true)}>Add</Button>
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