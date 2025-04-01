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

// ABI
import MaterialControl from '../abis/MaterialControl.json';

const AccountMaterial = ({ setView, account, loadBlockchainData, pipelineContract, signer }) => {
    const [materialProviders, setMaterialProviders] = useState([]);
    const [transportProviders, setTransportProviders] = useState([]);
    const [fabricateProviders, setFabricateProviders] = useState([]);

    // Form state
    const [showAddProvider, setShowAddProvider] = useState(false);
    const [selectedProviderType, setSelectedProviderType] = useState("");
    const [newProviderAddress, setNewProviderAddress] = useState("");

    const loadMaterialData = async () => {
        if (!pipelineContract || !signer) return;

        try {
            const materialProviders = await pipelineContract.getAllMaterialProviders();
            const providerMaterialsMap = {};

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

                console.log(materials);

                providerMaterialsMap[provider] = materials;
            }
            
        } catch (err) {
            console.error("Error loading provider data:", err);
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
                </>
            ) : (
                <p>Please connect to your wallet.</p>
            )}
        </Container>
    );
}

export default AccountMaterial;