import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const Home = ({ setView }) => {
    return (
        <Container className="text-center">
            <Row className="justify-content-center">
            <img src="logo-full.png" alt="Logo" className="m-4" />
            </Row>
            <hr/>
            <Row className="justify-content-center g-3">
                <Col xs={12} sm={4} className="d-flex justify-content-center mb-4">
                <Card onClick={() => setView("material")}>
                    <Card.Img variant="top" src="0xP-Material.png"/>
                    <Card.Body>
                        <Card.Title>Handle raw materials</Card.Title>
                    </Card.Body>
                </Card>
                <Card onClick={() => setView("fabricate")}>
                    <Card.Img variant="top" src="0xP-Fabricate.png"/>
                    <Card.Body>
                        <Card.Title>Build new products</Card.Title>
                    </Card.Body>
                </Card>
                <Card onClick={() => setView("transport")}>
                    <Card.Img variant="top" src="0xP-Transport.png"/>
                    <Card.Body>
                        <Card.Title>Ship goods</Card.Title>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;