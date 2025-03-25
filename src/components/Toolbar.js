import React from "react";
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

const Toolbar = ({ setView, view }) => {
    return (
        <Nav>
            {view === "material" && (
                <Nav.Item>
                <Button variant="warning" onClick={() => setView("material.add")}>Add</Button>
                </Nav.Item>
            )}
            {view === "fabricate" && (
                <Nav.Item>
                <Button variant="danger" onClick={() => setView("material.add")}>Add</Button>
                </Nav.Item>
            )}
            {view === "transport" && (
                <Nav.Item>
                <Button variant="primary" onClick={() => setView("material.add")}>Add</Button>
                </Nav.Item>
            )}
        </Nav>
    );
    
}

export default Toolbar;