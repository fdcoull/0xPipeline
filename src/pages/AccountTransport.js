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
import TransportControl from '../abis/TransportControl.json';

const AccountTransport = ({ setView, account, loadBlockchainData, pipelineContract, signer, myFabricateContract }) => {
    //const [providerProducts, setProviderProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [shippedOrders, setShippedOrders] = useState([]);

    const loadContractData = async () => {
        if (myFabricateContract && pipelineContract) {
            try {
                const loadedOrders = [];
                const shippedOrders = [];
                const unshippedOrders = [];

                const orderCount = await myFabricateContract.orderCount();
                const account = await signer.getAddress();

                for (let i = 1; i <= orderCount; i++) {
                    const [time, productId, quantity, buyer] = await myFabricateContract.orders(i);
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

                const transportProviderAddresses = await pipelineContract.getAllTransportProviders();
                const shippedOrderNumbers = [];

                for (const address of transportProviderAddresses) {
                    const transportProvider = new ethers.Contract(address, TransportControl, signer);

                    const shipments = await transportProvider.shipments();

                    const myShipments = shipments.filter(([senderOrderNo, sender]) => sender === account);

                    myShipments.forEach(([senderOrderNo]) => {
                        shippedOrderNumbers.add(orderNumber.toString());
                        shippedOrders.push({
                            ...loadedOrders.find(order => order.id === orderNumber.toString()),
                            carrier: address
                        });
                    });
                }

                loadedOrders.forEach(order => {
                    if (!shippedOrderNumbers.includes(order.id)) {
                        unshippedOrders.push(order);
                    }
                });

                setOrders(unshippedOrders);
                setShippedOrders(shippedOrders);

                console.log(unshippedOrders);
                console.log(shippedOrders);
            } catch (error) {
                console.error("Error loading orders:", error);
            }
        }
    }

    useEffect(() => {
        loadContractData();
    }, []);
    
    return "test";
}

export default AccountTransport