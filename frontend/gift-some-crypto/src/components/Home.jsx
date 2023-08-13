import React from 'react'
import {Container, Button, Navbar, Nav, Row, Col} from 'react-bootstrap';
import NavBar from './NavBar';

const Home = () => {
  return (
    <div fluid className='home-page' >
        <NavBar/>
        <Container style={{textAlign:"center", marginTop:"7%"}}fluid>
            <h1 style={{fontWeight:"bold", fontSize:"6rem"}}>Gift Some Crypto</h1>
            <h4 style={{fontSize:"1.5rem"}}>Your One Stop Platform for Crypto Gift Cards</h4>
        </Container>
        <Container style={{marginTop:"5%", textAlign:'center'}}>
            <Row>
                <Col md={4}>
                    <img width="64" height="64" src="https://img.icons8.com/pastel-glyph/64/nft-checked.png" alt="nft-checked"/>
                    <p style={{marginTop:"5%"}}>Create NFTs that unlock value</p>
                </Col>
                <Col md={4}>
                    <img width="64" height="64" src="https://img.icons8.com/ios/50/bot.png" alt="bot"/>
                    <p style={{marginTop:"5%"}}>AI Powered Customization</p>
                </Col>
                <Col md={4}>
                <img width="64" height="64" src="https://img.icons8.com/external-outline-geotatah/64/external-forever-sustainable-competitive-advantage-outline-geotatah.png" alt="external-forever-sustainable-competitive-advantage-outline-geotatah"/>
                <p style={{marginTop:"5%"}}>Once minted, forever valid. </p>
                </Col>
            </Row>
            <h5 style={{marginTop:"5%"}}>There isn't a better gift than crypto. </h5>
            <Button href='/mint' variant="dark">Mint your first Gift Card</Button>{' '}
        </Container>
        
    </div>
  )
}

export default Home