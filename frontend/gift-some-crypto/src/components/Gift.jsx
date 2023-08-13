import React, { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import NavBar from "./NavBar";
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'



const Gift = () => {

    const [account, setAccount] = useState('')
    const [accountTrimmed, setAccountTrimmed] = useState('')
    const [accountBalance, setAccountBalance] = useState('')
 
    const web3Modal = new Web3Modal({
        theme: "dark",
        network: "mainnet", // optional
        cacheProvider: true, // optional
      });


  async function connectWallet() {
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner()
    const account = await signer.getAddress()
    setAccount(account)
    var account_trimmed = account.substring(0, 4) + "..." + account.substring(account.length - 4, account.length)
    setAccountTrimmed(account_trimmed)
    const network = await provider.getNetwork()
    const balance = await provider.getBalance(account)
    const balanceinEther =  ethers.utils.formatEther(balance)
    console.log(balanceinEther)
    setAccountBalance(balanceinEther)
    console.log(account)
  }

  return (
    <>
      <div fluid className="home-page">
        <NavBar />
        <Container fluid style={{ marginTop: "2%", textAlign: "center" }}>
          <Row>
            <Col md={9}></Col>
            <Col style={{ textAlign: "right" }} md={3}>
              <Button onClick={connectWallet} variant="dark">
                Connect Wallet
              </Button>
            </Col>
          </Row>
          <h2 style={{ fontWeight: "bold" }}>Mint Gift Card</h2>
          <p>Connected Address: {accountTrimmed}</p>
          <p>Balance: {String(accountBalance)} ETH</p>
        </Container>
      </div>
    </>
  );
};

export default Gift;
