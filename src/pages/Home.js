import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const Home = ({ setView }) => {
    return (
        <>
        <Container className="text-center">
            <Row className="justify-content-center">
            <img src="logo-full.png" alt="Logo" className="m-4" />
            </Row>
            <hr/>
            <Row className="justify-content-center g-3">
                <Col xs={8} className="d-flex justify-content-center mb-4">
                <Card onClick={() => setView("material")} className="m-4">
                    <Card.Img variant="top" src="0xp-short.png"/>
                    <Card.Body className="mt-auto">
                        <Card.Title>Manage Account</Card.Title>
                    </Card.Body>
                </Card>
                <Card onClick={() => setView("material")} className="m-4">
                    <Card.Img variant="top" src="0xp-material.png"/>
                    <Card.Body>
                        <Card.Title>Handle Raw Materials</Card.Title>
                    </Card.Body>
                </Card>
                <Card onClick={() => setView("fabricate")} className="m-4">
                    <Card.Img variant="top" src="0xp-fabricate.png"/>
                    <Card.Body>
                        <Card.Title>Build New Products</Card.Title>
                    </Card.Body>
                </Card>
                <Card onClick={() => setView("transport")} className="m-4">
                    <Card.Img variant="top" src="0xp-transport.png"/>
                    <Card.Body>
                        <Card.Title>Ship Goods</Card.Title>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
        </Container>
        </>
    );
}

export default Home;