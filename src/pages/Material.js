import React from "react";
import { useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";


const Material = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [materials, setMaterials] = useState([]);

    const loadContractData = async () => {
        if (contract) {
            try {
                //const count = await contract.materialCount();
                //console.log("Material count:", count.toString());
                const loadedMaterials = [];
                
                const materialCount = await contract.materialCount();
    
                for (let i = 1; i <= materialCount; i++) {
                    //const material = await contract.materials(i);
                    const [name, quantity, quantity_unit, cost] = await contract.materials(i);
                    loadedMaterials.push({
                        id: i.toString(),
                        name: name,
                        quantity: quantity.toString(),
                        quantity_unit: quantity_unit,
                        cost: cost.toString()
                    });
                }
    
                setMaterials(loadedMaterials);
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
            <h2>Material page</h2>
            <Toolbar setView={setView} view={view}/>
            
        </Container>
    );
}

export default Material;