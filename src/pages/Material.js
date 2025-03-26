import React from "react";
import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";


const Material = ({ setView, view, account, loadBlockchainData }) => {
    return (
        <Container fluid>
            <h2>Material page</h2>
            <Toolbar setView={setView} view={view}/>
            <Button variant="warning" onClick={() => loadBlockchainData()}>Login</Button>
            <p>Connected account: {account}</p>

        </Container>
    );
}

export default Material;