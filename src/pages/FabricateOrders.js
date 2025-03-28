import React from "react";
import { useEffect, useState } from 'react'

import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

const FabricateOrders = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [orders, setOrders] = useState([]);
    
        const loadContractData = async () => {
            if (contract) {
                try {
                    const loadedOrders = [];
                    
                    const orderCount = await contract.orderCount();
        
                    for (let i = 1; i <= orderCount; i++) {
                        const [time, productId, quantity, buyer] = await contract.orders(i);
                        const timestamp = Number(time.toString());
                        const orderDate = new Date(timestamp * 1000);
                        const formattedDate = orderDate.toISOString().split('T')[0];
                        loadedOrders.push({
                            id: i.toString(),
                            time: formattedDate,
                            productId: productId.toString(),
                            quantity: quantity.toString(),
                            buyer: buyer
                        });
                    }
        
                    setOrders(loadedOrders);
                } catch (error) {
                    console.error("Error loading orders:", error);
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
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Buyer</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.time}</td>
                            <td>{order.productId}</td>
                            <td>{order.quantity}</td>
                            <td>{order.buyer}</td>
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

export default FabricateOrders;