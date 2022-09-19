pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721 {
    constructor() ERC721("TestNFT", "TN") {
        _mint(msg.sender, 7);
    }
}