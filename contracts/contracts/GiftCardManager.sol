// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract GiftCardManager is ERC721URIStorage, Ownable {

    // Counters to keep track of tokenID and supply
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // This is the Gift Card Value for the given token ID
    mapping(uint => uint) public GiftCardValue;

    constructor(string memory collectionName, string memory symbol)  ERC721(collectionName, symbol) {
        
    }

    // This function creates and issues the Gift Card NFT
    function issueGiftCard(address recipientAddress, string memory tokenURI) public payable returns(uint) {
        require(msg.value > 0, "Can't issue gift card with 0 value");
        _tokenIds.increment();
        uint256 giftCardId = _tokenIds.current();
        GiftCardValue[giftCardId] = msg.value;
        _mint(recipientAddress, giftCardId);
        _setTokenURI(giftCardId, tokenURI);
        return giftCardId;
    }

    // This function redeems the gift card -> can only be called by the owner of the Gift Card
    function redeemGiftCard(uint giftCardId) public returns(uint) {
        address giftCardOwner = ownerOf(giftCardId);
        require(msg.sender == giftCardOwner, "Not owner of said gift card");
        uint giftCardValue = GiftCardValue[giftCardId];
        _burn(giftCardId);
        GiftCardValue[giftCardId] = 0;
        payable(msg.sender).transfer(giftCardValue);
        return 1;
    }

    function transferGiftCard(uint giftCardId, address recipientAddress) public returns(uint) {
        address giftCardOwner = ownerOf(giftCardId);
        require(msg.sender == giftCardOwner, "Not owner of said gift card");
        _transfer(msg.sender, recipientAddress, giftCardId);
        return 1;
    }

}