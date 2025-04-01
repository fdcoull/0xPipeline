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
import MaterialControl from '../abis/MaterialControl.json';

const AccountMaterial = ({ setView, account, loadBlockchainData, pipelineContract, signer, fabricateContract }) => {
    const [providerMaterials, setProviderMaterials] = useState([]);

    // Modal state
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState("");
    const [quantity, setQuantity] = useState(1);

    const loadMaterialData = async () => {
        if (!pipelineContract || !signer) return;

        try {
            const materialProviders = await pipelineContract.getAllMaterialProviders();
            const providerMaterialsArray = [];

            // Loop through providers
            for (const provider of materialProviders) {
                const materialContract = new ethers.Contract(provider, MaterialControl, signer);

                const materialCount = await materialContract.materialCount();

                const materials = [];

                // Loop through materials
                for (let i = 1; i <= materialCount; i++) {
                    const material = await materialContract.materials(i);

                    materials.push({
                        id: i.toString(),
                        name: material.name,
                        quantity: material.quantity.toString(),
                        quantity_unit: material.quantity_unit,
                        cost: material.cost.toString(),
                    });
                }

                providerMaterialsArray.push({ provider, materials })
            }

            setProviderMaterials(providerMaterialsArray);
            
        } catch (err) {
            console.error("Error loading provider data:", err);
        }
    }

    const buyMaterial = async (provider, materialId, quantity, costPerUnit) => {
        if (!signer || !fabricateContract) return;

        try {
            const materialContract = new ethers.Contract(provider, MaterialControl, signer);
            const totalCost = BigInt(costPerUnit * quantity);

            // Purchase material
            const transaction = await materialContract.buy(materialId, quantity, { value: totalCost });

            // Get material details
            const material = await materialContract.materials(materialId);
            const materialName = material.name;
            const materialUnit = material.quantity_unit;
            const materialCost = material.cost;

            // Check if exists in users fabricate parts list
            const partCount = await fabricateContract.partCount();
            let existingPartId = null;

            for (let i = 1; i <= partCount; i++) {
                const part = await fabricateContract.parts(i);
                if (part.name === materialName) {
                    existingPartId = i;
                    break;
                }
            }

            if (existingPartId !== null) {
                // Add to stock level
                const transaction2 = await fabricateContract.increasePartStock(
                    existingPartId,
                    quantity
                );

            } else {
                // Create new part
                const transaction2 = await fabricateContract.addNewPart(
                    materialName,
                    quantity,
                    materialUnit,
                    materialCost
                );
            }

            setShowBuyModal(false);

            loadMaterialData();

        } catch (err) {
            console.error("Error purchasing material:", err);
        }
    }

    useEffect(() => {
        if (signer && pipelineContract) {
            loadMaterialData();
        }
    }, []);

    return (
        <Container fluid>
            <h2>Material Providers</h2>
            {providerMaterials.map((providerData) => (
            <div key={providerData.provider}>
                <h4>{providerData.provider}</h4>
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
                        {providerData.materials.map((material) => (
                            <tr key={material.id}>
                                <td>{material.id}</td>
                                <td>{material.name}</td>
                                <td>{material.quantity}</td>
                                <td>{material.quantity_unit}</td>
                                <td>{material.cost}</td>
                                <td><Button variant="warning" onClick={() => {setSelectedProvider(providerData.provider); setSelectedMaterial(material); setQuantity(1); setShowBuyModal(true);}}>Buy</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        ))}
        <Modal show={showBuyModal} onHide={() => setShowBuyModal(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Buy {selectedMaterial?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control 
                        type="number" 
                        value={quantity} 
                        min="1"
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowBuyModal(false)}>Cancel</Button>
                <Button variant="warning" onClick={() => buyMaterial(selectedProvider, selectedMaterial.id, quantity, selectedMaterial.cost)}>Confirm Purchase</Button>
            </Modal.Footer>
        </Modal>
        </Container>
    );
}

export default AccountMaterial;