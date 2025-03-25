import React from "react";
import Toolbar from '../components/Toolbar';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Fabricate = ({ setView, view }) => {
    return (
        <Container fluid>
            <h2>Fabricate page</h2>
            <Toolbar setView={setView} view={view}/>
        </Container>
    );
}

export default Fabricate;