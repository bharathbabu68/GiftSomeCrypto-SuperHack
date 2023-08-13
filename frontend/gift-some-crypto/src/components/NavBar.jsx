import React from 'react'
import {Container, Button, Navbar, Nav} from 'react-bootstrap';

const NavBar = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
    <Container fluid>
      <Navbar.Brand href="#home">Gift Some Crypto</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/gift">Mint Gift</Nav.Link>
        <Nav.Link href="/redeem">Redeem Gift</Nav.Link>
      </Nav>
    </Container>
  </Navbar>
  )
}

export default NavBar