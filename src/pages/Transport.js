import React from "react";
import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Transport = ({ setView, view }) => {
    return (
        <Container fluid>
            <h2>Transport page</h2>
            <Toolbar setView={setView} view={view}/>
        </Container>
    );
}

export default Transport;