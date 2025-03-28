import React from "react";
import { useEffect, useState } from 'react'

import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

const Fabricate = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [parts, setParts] = useState([]);
    
        const loadContractData = async () => {
            if (contract) {
                try {
                    const loadedParts = [];
                    
                    const partCount = await contract.partCount();
        
                    for (let i = 1; i <= partCount; i++) {
                        const [name, quantity, quantity_unit, cost] = await contract.parts(i);
                        loadedParts.push({
                            id: i.toString(),
                            name: name,
                            quantity: quantity.toString(),
                            quantity_unit: quantity_unit,
                            cost: cost.toString()
                        });
                    }
        
                    setParts(loadedParts);
                } catch (error) {
                    console.error("Error loading parts:", error);
                }
            }
        }
    
        useEffect(() => {
            loadContractData();
        }, [contract]);
    return (
        <Container fluid>
            <h2>Parts</h2>
            <Toolbar setView={setView} view={view}/>
            {parts.length > 0 ? (
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
                    {parts.map(part => (
                        <tr key={part.id}>
                            <td>{part.id}</td>
                            <td>{part.name}</td>
                            <td>{part.quantity}</td>
                            <td>{part.quantity_unit}</td>
                            <td>{part.cost}</td>
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

export default Fabricate;