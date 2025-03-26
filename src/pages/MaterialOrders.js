import React from "react";
import { useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";


const MaterialOrders = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [orders, setOrders] = useState([]);

    const loadContractData = async () => {
        if (contract) {
            try {
                const loadedOrders = [];
                
                const materialCount = await contract.orderCount();
    
                for (let i = 1; i <= materialCount; i++) {
                    const [time, materialId, quantity, address] = await contract.orders(i);
                    const timestamp = Number(time.toString());
                    const orderDate = new Date(timestamp * 1000);
                    const formattedDate = orderDate.toISOString().split('T')[0];

                    loadedOrders.push({
                        id: i.toString(),
                        time: formattedDate,
                        materialId: materialId.toString(),
                        quantity: quantity.toString(),
                        address: address
                    });
                }
    
                setOrders(loadedOrders);
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
            <h2>Orders</h2>
            <Toolbar setView={setView} view={view}/>
            {orders.length > 0 ? (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Time</th>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.time}</td>
                            <td>{order.materialId}</td>
                            <td>{order.quantity}</td>
                            <td>{order.address}</td>
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

export default MaterialOrders;