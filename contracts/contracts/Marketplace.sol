// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        address beneficiary;
        address tokenContract;
        uint256 tokenId;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;
    mapping(address tokenContract => mapping(uint256 tokenId => uint256 listingId))
        public tokenListings;
    uint256 private listingCounter;

    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        address beneficiary,
        address indexed tokenContract,
        uint256 tokenId,
        uint256 price
    );
    event Sold(uint256 indexed listingId, address indexed buyer);
    event ListingCancelled(uint256 indexed listingId);

    function list(
        address beneficiary,
        address tokenContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(price > 0, "Price must be greater than zero");
        IERC721(tokenContract).transferFrom(msg.sender, address(this), tokenId);

        listingCounter++;
        listings[listingCounter] = Listing(
            msg.sender,
            beneficiary,
            tokenContract,
            tokenId,
            price
        );

        tokenListings[tokenContract][tokenId] = listingCounter;

        emit Listed(
            listingCounter,
            msg.sender,
            beneficiary,
            tokenContract,
            tokenId,
            price
        );
    }

    function buy(uint256 listingId) external payable nonReentrant {
        Listing memory listing = listings[listingId];
        require(msg.value == listing.price, "Incorrect price");
        require(listing.seller != address(0), "Listing does not exist");

        delete listings[listingId];
        delete tokenListings[listing.tokenContract][listing.tokenId];
        payable(listing.beneficiary).transfer(msg.value);
        IERC721(listing.tokenContract).transferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );

        emit Sold(listingId, msg.sender);
    }

    function cancelListing(uint256 listingId) external nonReentrant {
        Listing memory listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");

        delete listings[listingId];
        delete tokenListings[listing.tokenContract][listing.tokenId];
        IERC721(listing.tokenContract).transferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );

        emit ListingCancelled(listingId);
    }
}
