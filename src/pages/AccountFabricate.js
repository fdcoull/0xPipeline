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

const AccountFabricate = ({ setView, account, loadBlockchainData, pipelineContract, signer, myFabricateContract }) => {
    const [providerProducts, setProviderProducts] = useState([]);

    // Modal state
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState("");
    const [quantity, setQuantity] = useState(1);
    
    const loadFabricateData = async () => {
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

    const buyProduct = async (provider, productId, quantity, costPerUnit) => {
        if (!signer || !myFabricateContract) return;

        try {
            const fabricateContract = new ethers.Contract(provider, FabricateControl, signer);
            const totalCost = BigInt(costPerUnit * quantity);

            // Purchase product
            const transaction = await fabricateContract.buy(productId, quantity, { value: totalCost });

            // Get material details
            const product = await fabricateContract.products(productId);
            const productName = product.name;
            const productUnit = product.quantity_unit;
            const productCost = product.cost;

            // Check if exists in users fabricate parts list
            const partCount = await myFabricateContract.partCount();
            let existingPartId = null;

            for (let i = 1; i <= partCount; i++) {
                const part = await myFabricateContract.parts(i);
                if (part.name === productName) {
                    existingPartId = i;
                    break;
                }
            }

            if (existingPartId !== null) {
                // Add to stock level
                const transaction2 = await myFabricateContract.increasePartStock(
                    existingPartId,
                    quantity
                );

            } else {
                // Create new part
                const transaction2 = await myFabricateContract.addNewPart(
                    productName,
                    quantity,
                    productUnit,
                    productCost
                );
            }

            setShowBuyModal(false);

            loadFabricateData();

        } catch (err) {
            console.error("Error purchasing material:", err);
        }
    }

    useEffect(() => {
            if (signer && pipelineContract) {
                loadFabricateData();
            }
    }, []);
    
    return (
        <Container fluid>
            <h2>Fabricate Providers</h2>
            {providerProducts.map((providerData) => (
                <>
                <Button variant="secondary" onClick={() => loadFabricateData()}><i className="bi bi-arrow-clockwise"></i></Button>
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
                                <td><Button variant="danger" onClick={() => {setSelectedProvider(providerData.provider); setSelectedProduct(product); setQuantity(1); setShowBuyModal(true);}}>Buy</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            </>
        ))}
        <Modal show={showBuyModal} onHide={() => setShowBuyModal(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Buy {selectedProduct?.name}</Modal.Title>
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
                <Button variant="danger" onClick={() => buyProduct(selectedProvider, selectedProduct.id, quantity, selectedProduct.cost)}>Confirm Purchase</Button>
            </Modal.Footer>
        </Modal>
        </Container>
    );
}

export default AccountFabricate;