import React from "react";
import { useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";


const Material = ({ setView, view, account, loadBlockchainData, contract }) => {
    //const [materials, setMaterials] = useState([]);

    const materials = []

    const loadContractData = async () => {
        if (contract) {
            for (var i = 0; i < 1; i++) {
                const material = await contract.materials(i + 1);
                materials.push(material);
            }
        }
        
    }

    useEffect(() => {
        loadContractData();
    }, []);

    return (
        <Container fluid>
            <h2>Material page</h2>
            <Toolbar setView={setView} view={view}/>
            {materials[0].name}
        </Container>
    );
}

export default Material;