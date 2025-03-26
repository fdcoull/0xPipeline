import React from "react";
import { useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";


const Material = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [materials, setMaterials] = useState([]);

    

    const loadContractData = async () => {
        if (contract) {
            const count = await contract.materialCount();
            const loadedMaterials = []

            for (let i = 1; i <= count; i++) {
                const material = await contract.materials(i);
                loadedMaterials.push({
                    id: material.id.toString(),
                    name: material.name,
                    quantity: material.quantity.toString(),
                    quantity_unit: material.quantity_unit,
                    cost: material.cost.toString()
                });
            }

            setMaterials(loadedMaterials);
        }
        
    }

    useEffect(() => {
        loadContractData();
    }, []);

    return (
        <Container fluid>
            <h2>Material page</h2>
            <Toolbar setView={setView} view={view}/>
            {materials.length > 0 ? (
                <h3>{material.name}</h3>
            ) : (
                <p>Loading...</p>
            )}
        </Container>
    );
}

export default Material;