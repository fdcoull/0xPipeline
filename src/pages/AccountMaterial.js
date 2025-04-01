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

const AccountMaterial = ({ setView, account, loadBlockchainData, pipelineContract, signer }) => {
    const [providerMaterials, setProviderMaterials] = useState([]);

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
                                <td><Button variant="warning" onClick={() => buyMaterial(providerData.provider, material.id, material.cost)}>Buy</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        ))}
        </Container>
    );
}

export default AccountMaterial;