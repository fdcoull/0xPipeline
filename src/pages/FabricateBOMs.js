import React from "react";
import { useEffect, useState } from 'react'

import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

const FabricateBOMs = ({ setView, view, account, loadBlockchainData, contract }) => {
    const [boms, setBoms] = useState([]);
    const [expandedBoms, setExpandedBoms] = useState({});
    
        const loadContractData = async () => {
            if (contract) {
                try {
                    const loadedBoms = [];
                    
                    const bomCount = await contract.productCount();
        
                    for (let i = 1; i <= bomCount; i++) {
                        const [name] = await contract.products(i);
                        const componentCount = await contract.getComponentCount(i);
                        const components = [];

                        for (let j = 0; j < componentCount; j++) {
                            const component = await contract.boms(i, j);
                            components.push({
                                partId: component.partId,
                                quantity: component.quantity
                            });
                        }

                        loadedBoms.push({
                            id: i.toString(),
                            name: name,
                            components: components,
                            componentCount: componentCount
                        });
                    }
        
                    setBoms(loadedBoms);
                } catch (error) {
                    console.error("Error loading boms:", error);
                }
            }
        }
    
        useEffect(() => {
            loadContractData();
        }, [contract]);

        const toggleBom = (bomId) => {
            setExpandedBoms(prev => ({
              ...prev,
              [bomId]: !prev[bomId]
            }));
        };

    return (
        <Container fluid>
            <h2>BOMs</h2>
            <Toolbar setView={setView} view={view}/>
            {boms.length > 0 ? (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Component Count</th>
                    </tr>
                </thead>
                <tbody>
                    {boms.map(bom => (
                        <>
                        <tr key={bom.id} onClick={() => toggleBom(bom.id)} style={{ cursor: 'pointer' }}>
                            <td>{bom.id}</td>
                            <td>{bom.name}</td>
                            <td>{bom.componentCount}</td>
                        </tr>
                        {expandedBoms[bom.id] && (
                        <tr key={`components-${bom.id}`}>
                        <td colSpan="3">
                            <div style={{ padding: '10px 20px' }}>
                            <h4>Components:</h4>
                            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                                {bom.components.map((comp, i) => (
                                <li key={i}>
                                    Part {comp.partId} - Quantity: {comp.quantity}
                                </li>
                                ))}
                            </ul>
                            </div>
                        </td>
                        </tr>
                        )}
                        </>
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