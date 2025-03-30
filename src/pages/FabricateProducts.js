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

const FabricateProducts = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [products, setProducts] = useState([]);

    // Manufacture product state
    const [showManufactureProduct, setShowManufactureProduct] = useState(false); 
    const [isManufactureProductSubmitting, setIsManufactureProductSubmitting] = useState(false);
    const [manufactureProductId, setAManufactureProductId] = useState(0);
    const [manufactureProductQuantity, setManufactureProductQuantity] = useState(0);
    const isManufactureProductValid = () => {
        return (
            !isNaN(Number(manufactureProductId)) &&
            !isNaN(Number(manufactureProductQuantity))
        );
    };
    
    const loadContractData = async () => {
        if (contract) {
            try {
                const loadedProducts = [];
                
                const productCount = await contract.productCount();
    
                for (let i = 1; i <= productCount; i++) {
                    const [name, quantity, quantity_unit, cost] = await contract.products(i);
                    loadedProducts.push({
                        id: i.toString(),
                        name: name,
                        quantity: quantity.toString(),
                        quantity_unit: quantity_unit,
                        cost: cost.toString()
                    });
                }
    
                setProducts(loadedProducts);
            } catch (error) {
                console.error("Error loading products:", error);
            }
        }
    }

    // Post manufacture product form to blockchain
    const postManufactureProduct = async () => {
        if (!contract) return;

        setIsManufactureProductSubmitting(true);

        try {
            const transaction = await contract.manufactureProduct(
                BigInt(manufactureProductId),
                BigInt(manufactureProductQuantity)
            );

            setShowManufactureProduct(false);
            loadContractData();
        } catch (err){
            console.error("Manufacture product failed:", err);
        } finally {
            setIsManufactureProductSubmitting(false);
        }
    }
    
    useEffect(() => {
        loadContractData();
    }, [contract]);

    return (
        <Container fluid>
            <h2>Products</h2>
            <Nav.Item>
                <Button variant="danger" onClick={() => setShowManufactureProduct(true)}>Manufacture Product</Button>
            </Nav.Item>
            {products.length > 0 ? (
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
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{product.quantity_unit}</td>
                            <td>{product.cost}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            ) : (
            <p>Nothing to show.</p>
            )}
            <Modal show={showManufactureProduct} onHide={() => setShowManufactureProduct(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Manufacture Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="number" onChange={(e) => setAManufactureProductId(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" onChange={(e) => setManufactureProductQuantity(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowManufactureProduct(false)}>Close</Button>
                    <Button variant="danger" disabled={!isManufactureProductValid() || isManufactureProductSubmitting} onClick={postManufactureProduct}>Save</Button>
                    {isManufactureProductSubmitting ? "Processing..." : "Manufacture a product"}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default FabricateProducts;