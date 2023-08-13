import React from 'react'
import {Container, Button, Navbar, Nav} from 'react-bootstrap';

const NavBar = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
    <Container fluid>
      <Navbar.Brand href="/">Gift Some Crypto</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/mint">Mint </Nav.Link>
        <Nav.Link href="/redeem">Redeem </Nav.Link>
      </Nav>
    </Container>
  </Navbar>
  )
}

export default NavBar