import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Navigation = ({ setView, view, account }) => {
    {/* Return null if home page */}
    if (view === "home") return null;

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Nav className="me-auto">
              {view.startsWith("material") && (
                <>
                  <Navbar.Brand onClick={() => setView("material")}><img src="0xp-material.png" alt="0xP Material Logo" width="55"/></Navbar.Brand>
                  
                  <Nav.Link onClick={() => setView("material")}>Materials</Nav.Link>
                  <Nav.Link onClick={() => setView("material.orders")}>Orders</Nav.Link>
                </>
              )}
              {view.startsWith("fabricate") && (
                <>
                  <Navbar.Brand onClick={() => setView("fabricate")}><img src="0xp-fabricate.png" alt="0xP Fabricate Logo" width="55"/></Navbar.Brand>
                  <Nav.Link onClick={() => setView("fabricate")}>Parts</Nav.Link>
                  <Nav.Link onClick={() => setView("fabricate.boms")}>BOMs</Nav.Link>
                  <Nav.Link onClick={() => setView("fabricate.products")}>Products</Nav.Link>
                  <Nav.Link onClick={() => setView("fabricate.orders")}>Orders</Nav.Link>
                </>
              )}
              {view.startsWith("transport") && (
                <>
                  <Navbar.Brand onClick={() => setView("transport")}><img src="0xp-transport.png" alt="0xP Transport Logo" width="55"/></Navbar.Brand>
                  <Nav.Link onClick={() => setView("transport")}>Transport</Nav.Link>
                </>
              )}
              {view.startsWith("account") && (
                <>
                  <Navbar.Brand onClick={() => setView("account")}><img src="0xp-short.png" alt="0xP Short Logo" width="55"/></Navbar.Brand>
                  <Nav.Link onClick={() => setView("account.material")}>Material Providers</Nav.Link>
                  <Nav.Link onClick={() => setView("account.fabricate")}>Fabricate Providers</Nav.Link>
                  <Nav.Link onClick={() => setView("account.transport")}>Transport Providers</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              <Nav.Link onClick={() => setView("account")}>
                {account && (
                  account.slice(0,5) + '...' + account.slice(-5)
                )} 
                
              </Nav.Link>
              <Nav.Link onClick={() => setView("account")}><i className="bi bi-person-fill"></i></Nav.Link>
              <Nav.Link onClick={() => setView("home")}><i className="bi bi-house-fill"></i></Nav.Link>
            </Nav>
          </Container>
        </Navbar>
    );
}

export default Navigation;