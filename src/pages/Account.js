import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const Account = ({ setView, account, loadBlockchainData }) => {
    return (
        <Container fluid>
            <h2>Account page</h2>

            <Button variant="info" onClick={() => loadBlockchainData()}>Login</Button>
            <p>Connected account: {account}</p>
        </Container>
    );
}

export default Account;