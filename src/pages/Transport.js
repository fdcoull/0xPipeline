import React from "react";
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
                    const [sender, senderOrderNo, weight, recipient, status, method, cost] = await contract.materials(i);
                    loadedMaterials.push({
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
            <h2>Transport page</h2>
            <Toolbar setView={setView} view={view}/>
        </Container>
    );
}

export default Transport;