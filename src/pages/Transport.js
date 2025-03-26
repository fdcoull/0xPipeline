import React from "react";
import { useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

const Transport = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [shipments, setShipments] = useState([]);
    
    const loadContractData = async () => {
        if (contract) {
            try {
                const loadedShipments = [];
                
                const shipmentCount = await contract.shipmentCount();
    
                for (let i = 1; i <= shipmentCount; i++) {
                    const [sender, senderOrderNo, weight, recipient, status, method, cost] = await contract.shipments(i);
                    loadedShipments.push({
                        id: i.toString(),
                        sender: sender,
                        senderOrderNo: senderOrderNo,
                        weight: weight.toString(),
                        recipient: recipient,
                        status: status.toString(),
                        method: method.toString(),
                        cost: cost.toString()
                    });
                }
    
                setShipments(loadedShipments);
            } catch (error) {
                console.error("Error loading materials:", error);
            }
        }
    }

    useEffect(() => {
        loadContractData();
    }, [contract]);

    return (
        <Container fluid>
            <h2>Transport page</h2>
            <Toolbar setView={setView} view={view}/>
            {shipments.length > 0 ? (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sender</th>
                        <th>Sender Order No.</th>
                        <th>Weight</th>
                        <th>Recipient</th>
                        <th>Status</th>
                        <th>Method</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {shipments.map(shipment => (
                        <tr key={shipment.id}>
                            <td>{shipment.id}</td>
                            <td>{shipment.sender}</td>
                            <td>{shipment.senderOrderNo}</td>
                            <td>{shipment.weight}</td>
                            <td>{shipment.recipient}</td>
                            <td>{shipment.status}</td>
                            <td>{shipment.method}</td>
                            <td>{shipment.cost}</td>
                        </tr>
                    ))}
                    {console.log(shipments)}
                </tbody>
            </Table>
            ) : (
            <p>Nothing to show.</p>
            )}
        </Container>
    );
}

export default Transport;