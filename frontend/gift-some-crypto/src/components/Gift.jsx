import React, { useState } from "react";
import { Container, Button, Row, Col, Form, Modal, Spinner } from "react-bootstrap";
import NavBar from "./NavBar";
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { FileUploader } from "react-drag-drop-files";
import {abi} from "../resources/abi"



const Gift = () => {

    const [account, setAccount] = useState('')
    const [connectWalletStatus, setConnectWalletStatus] = useState('Connect Wallet')
    const [accountTrimmed, setAccountTrimmed] = useState('')
    const [accountBalance, setAccountBalance] = useState('')
    const [provider, setProvider] = useState()
    const [signer, setSigner] = useState()
    const [mintStatus, setMintStatus] = useState(false)
    const [successModal, setSuccessModal] = useState(false)
    const [mintTxHash, setMintTxHash] = useState()
    const [explorerUrl, setExplorerUrl] = useState()


    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null)
    const [giftCardRecipientAddress, setGiftCardRecipientAddress] = useState("")
    const [giftCardValue, setGiftCardValue] = useState("")


    const handleChange = (file) => {
        const imgUrl = URL.createObjectURL(file)
        setFile(file);
        setImagePreview(imgUrl)
    };
 
    const web3Modal = new Web3Modal({
        theme: "dark",
        network: "mainnet", // optional
        cacheProvider: true, // optional
      });

      const fileTypes = ["JPG", "PNG", "GIF"];


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
  }

  async function performMint(){
    if(!signer){
        alert("Please connect wallet and try again")
        return
    }
    // First upload the image to IPFS
    setMintStatus(true)
    const formData = new FormData() 
    formData.append("file", file) 
    const response = await fetch(process.env.REACT_APP_IPFS_CLIENT_URL , { method: "POST", body: formData }) 
    const responseJSON = await response.json() 
    const imageHash = responseJSON.Hash
    const imageUrl = process.env.REACT_APP_IPFS_GATEWAY_URL_FIRST_PART + "/ipfs/" + imageHash + process.env.REACT_APP_IPFS_GATEWAY_URL_SECOND_PART
    console.log(imageUrl)
    const nftMetadata = {
        name: "Gift Some Crypto NFT",
        description: "This is a NFT that can actually be redeemed for crypto",
        value: `${giftCardValue} ETH`,
        image: imageUrl
    }
    const nftMetadataFile = new Blob([JSON.stringify(nftMetadata)])
    const formDataJSON = new FormData() 
    formDataJSON.append("file", nftMetadataFile)
    const newResponse = await fetch(process.env.REACT_APP_IPFS_CLIENT_URL , { method: "POST", body: formDataJSON }) 
    const newResponseJSON = await newResponse.json() 
    const metadataHash = newResponseJSON.Hash
    console.log(metadataHash)
    const metaDataUrl = process.env.REACT_APP_IPFS_GATEWAY_URL_FIRST_PART + "/ipfs/" + metadataHash + process.env.REACT_APP_IPFS_GATEWAY_URL_SECOND_PART
    console.log(metaDataUrl)
    const contract = new ethers.Contract(process.env.REACT_APP_GIFT_CARD_MANAGER_ADDRESS, abi, signer)
    const valueInWei = ethers.utils.parseUnits(giftCardValue)
    console.log(valueInWei)
    const tx = await contract.issueGiftCard(giftCardRecipientAddress, metaDataUrl, {value: valueInWei})

    await tx.wait()
    setMintTxHash(tx.hash)
    setExplorerUrl(`https://sepolia.explorer.mode.network/tx/${tx.hash}`)
    setMintStatus(false)
    setSuccessModal(true)

  }

  return (
    <>
     <Modal centered show={mintStatus} onHide={()=>setMintStatus(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Minting your Gift Card, please confirm in Metamask</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <p> Uploading your gift card to IPFS and minting your NFT, hold on..</p>  
           <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      <Modal centered show={successModal} onHide={()=>setSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Successfully minted your gift card!</Modal.Title>
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
            <h2 style={{ fontWeight: "bold", marginBottom:"2%"}}>Mint Gift Card</h2>
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
          <Row style={{marginTop:"3%"}}>
            <Col md={6}>
          <p>Select a cover image for your gift card:</p>
          <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
          <br />

          <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Enter receipient address to which you'd like to gift </Form.Label>
        <Form.Control onChange={(e)=>setGiftCardRecipientAddress(e.target.value)} type="text" placeholder="0x80d87.......F84E181" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Enter gift card value in ETH </Form.Label>
        <Form.Control onChange={(e)=>setGiftCardValue(e.target.value)} type="text" placeholder="0.1" />
        </Form.Group>
        </Form>
        <Button onClick={performMint} variant="dark">Mint Gift Card</Button>

            </Col>
            <Col style={{textAlign:"right", padding:"3%", paddingTop:'0%'}} md={6}>
        <h5>Gift Card Preview</h5>
          <img width="256" height="256" src={imagePreview}></img>
          <p style={{marginTop:"2%", fontSize:"0.8rem"}}>Recipient Address: {giftCardRecipientAddress}</p>
          <p style={{fontSize:"0.8rem"}}>Gift Card Value: {giftCardValue}</p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Gift;
