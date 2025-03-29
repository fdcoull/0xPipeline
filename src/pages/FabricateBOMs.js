import React from "react";
import { useEffect, useState } from 'react'

import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

const FabricateBOMs = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [boms, setBoms] = useState([]);
    
        const loadContractData = async () => {
            if (contract) {
                try {
                    const loadedBoms = [];
                    
                    const bomCount = await contract.productCount();
        
                    for (let i = 1; i <= bomCount; i++) {
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
    
        useEffect(() => {
            loadContractData();
        }, [contract]);
    return (
        <Container fluid>
            <h2>Products</h2>
            <Toolbar setView={setView} view={view}/>
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
        </Container>
    );
}

export default FabricateBOMs;