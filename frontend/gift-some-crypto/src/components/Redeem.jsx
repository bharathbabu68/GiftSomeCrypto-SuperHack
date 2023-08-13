import React, { useState } from "react";
import { Container, Button, Row, Col, Form, Modal, Spinner } from "react-bootstrap";
import NavBar from "./NavBar";
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { FileUploader } from "react-drag-drop-files";
import {abi} from "../resources/abi"


const Redeem = () => {

    const [account, setAccount] = useState('')
    const [connectWalletStatus, setConnectWalletStatus] = useState('Connect Wallet')
    const [accountTrimmed, setAccountTrimmed] = useState('')
    const [accountBalance, setAccountBalance] = useState('')
    const [provider, setProvider] = useState()
    const [signer, setSigner] = useState()
    const [explorerUrl, setExplorerUrl] = useState()

    const [redeemNftTokenId, setRedeemNftTokenId] = useState()
    const [giftCardsBalance, setGiftCardsBalance] = useState()
    const [redeemStatus, setRedeemStatus] = useState(false)
    const [successModal, setSuccessModal] = useState(false)


    const web3Modal = new Web3Modal({
        theme: "dark",
        network: "mainnet", // optional
        cacheProvider: true, // optional
      });


      async function performRedeem() {
        if(!signer){
            alert("Please connect your wallet and try again")
            return
        }
        setRedeemStatus(true)
        const contract = new ethers.Contract(process.env.REACT_APP_GIFT_CARD_MANAGER_ADDRESS, abi, signer)
        const tx = await contract.redeemGiftCard(redeemNftTokenId)
        await tx.wait()
        setExplorerUrl(`https://sepolia.explorer.mode.network/tx/${tx.hash}`)
        setRedeemStatus(false)
        setSuccessModal(true)
      }


    async function connectWallet() {
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner()
        setProvider(provider)
        setSigner(signer)
        const account = await signer.getAddress()
        setAccount(account)
        var account_trimmed = account.substring(0, 4) + "..." + account.substring(account.length - 4, account.length)
        setAccountTrimmed(account_trimmed)
        const network = await provider.getNetwork()
        const balance = await provider.getBalance(account)
        const balanceinEther =  Number(ethers.utils.formatEther(balance))
        // round it to two decimals
        const balanceinEtherFormatted = balanceinEther.toFixed(2)
        console.log(balanceinEther)
        setAccountBalance(balanceinEtherFormatted)
        setConnectWalletStatus("Connected")
        console.log(account)
        const contract = new ethers.Contract(process.env.REACT_APP_GIFT_CARD_MANAGER_ADDRESS, abi, signer)
        const giftCardBalance = await contract.balanceOf(account)
        setGiftCardsBalance(giftCardBalance)

      }

  return (
   <>
     <Modal centered show={redeemStatus} onHide={()=>setRedeemStatus(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Redeeming your Gift Card, please confirm in Metamask</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <p> Redeeming your gift card !</p>  
           <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
      <Modal centered show={successModal} onHide={()=>setSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Successfully redeemed your gift card!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <p> Track your tx status in the <a href={explorerUrl}> block explorer</a></p>  
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
     <div fluid className="home-page">
        <NavBar />
        <Container fluid style={{ marginTop: "2%", textAlign: "" }}>
          <Row>
            <Col md={5}>
            <h2 style={{ fontWeight: "bold", marginBottom:"2%"}}>Redeem your Gift Card</h2>
            <p>Connected Address: {accountTrimmed} Balance: {String(accountBalance)} ETH</p>
            </Col>
            <Col md={4}>
            </Col>
            <Col style={{ textAlign: "right" }} md={3}>
              <Button onClick={connectWallet} variant="dark">
                {connectWalletStatus}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
                {signer && <p>You have {String(giftCardsBalance)} gift cards in your wallet. </p>}
            <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Enter the token ID of the NFT you would like to redeem ! </Form.Label>
        <Form.Control onChange={(e)=>setRedeemNftTokenId(e.target.value)} type="text" placeholder="" />
        </Form.Group>
        </Form>
        <Button onClick={performRedeem} variant="dark">Redeem Gift Card</Button>
                
            </Col>
          </Row>
          </Container>
          </div>
   </>
  )
}

export default Redeem