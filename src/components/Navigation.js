import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Navigation = ({ setView, view }) => {
    {/* Return null if home page */}
    if (view === "home") return null;

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Nav className="me-auto">
              {view === "material" && (
                <>
                  <Navbar.Brand onClick={() => setView("home")}><img src="0xP-Fabricate.png" alt="0xPipeline Logo" width="50"/></Navbar.Brand>
                  
                  <Nav.Link onClick={() => setView("home")}>Home</Nav.Link>
                  <Nav.Link onClick={() => setView("home")}>Test1</Nav.Link>
                </>
              )}
              {view === "fabricate" && (
                <>
                  <Navbar.Brand onClick={() => setView("home")}><img src="logo-full.png" alt="0xPipeline Logo" width="100"/></Navbar.Brand>
                  <Nav.Link onClick={() => setView("home")}>Home</Nav.Link>
                  <Nav.Link onClick={() => setView("home")}>Test2</Nav.Link>
                </>
              )}
              {view === "transport" && (
                <>
                  <Navbar.Brand onClick={() => setView("home")}><img src="logo-full.png" alt="0xPipeline Logo" width="100"/></Navbar.Brand>
                  <Nav.Link onClick={() => setView("home")}>Home</Nav.Link>
                  <Nav.Link onClick={() => setView("home")}>Test3</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              <Navbar.Brand onClick={() => setView("home")}><img src="logo-full.png" alt="0xPipeline Logo" width="100"/></Navbar.Brand>
            </Nav>
          </Container>
        </Navbar>
    );
}

export default Navigation;