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
import FabricateControl from '../abis/FabricateControl.json';

const AccountMaterial = ({ setView, account, loadBlockchainData, pipelineContract, signer, myFabricateContract }) => {
    const [providerProducts, setProviderProducts] = useState([]);
    
    const loadMaterialData = async () => {
        if (!pipelineContract || !signer) return;

        try {
            const fabricateProviders = await pipelineContract.getAllFabricateProviders();
            const providerProductsArray = [];

            // Loop through providers
            for (const provider of fabricateProviders) {
                const fabricateContract = new ethers.Contract(provider, FabricateControl, signer);

                const productCount = await fabricateContract.productCount();

                const products = [];

                // Loop through products
                for (let i = 1; i <= productCount; i++) {
                    const product = await fabricateContract.products(i);

                    products.push({
                        id: i.toString(),
                        name: product.name,
                        quantity: product.quantity.toString(),
                        quantity_unit: product.quantity_unit,
                        cost: product.cost.toString(),
                    });
                }

                providerProductsArray.push({ provider, products })
            }

            setProviderProducts(providerProductsArray);
            
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
            <h2>Fabricate Providers</h2>
            {providerProducts.map((providerData) => (
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
                        {providerData.products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>{product.quantity_unit}</td>
                                <td>{product.cost}</td>
                                <td><Button variant="warning" onClick={() => {setSelectedProvider(providerData.provider); setSelectedProduct(product); setQuantity(1); setShowBuyModal(true);}}>Buy</Button></td>
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