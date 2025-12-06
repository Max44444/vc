pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC5192.sol";

contract SoulboundToken is ERC721URIStorage, Ownable, IERC5192 {

    mapping(uint256 => bool) private _locked;
    uint256 private _tokenIdCounter;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable(msg.sender) {

    }

    function safeMint(address owner, string memory uri) public onlyOwner returns (uint256) {
        _tokenIdCounter += 1;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(owner, tokenId);
        _setTokenURI(tokenId, uri);

        _locked[tokenId] = true;
        emit Locked(tokenId);

        return tokenId;
    }

    function locked(uint256 tokenId) external view override returns (bool) {
        require(ownerOf(tokenId) != address(0), "SBT: nonexistent token");
        return _locked[tokenId];
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = super._update(to, tokenId, auth);

        if (from != address(0) && to != address(0)) {
            require(!_locked[tokenId], "SBT: token is soulbound");
        }

        return from;
    }

    function revoke(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId) || msg.sender == owner(), "SBT: not authorized");
        _burn(tokenId);
        delete _locked[tokenId];
        emit Unlocked(tokenId);
    }

    function burn(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId) || msg.sender == owner(), "SBT: not authorized");
        _burn(tokenId);
        delete _locked[tokenId];
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return
                interfaceId == type(IERC5192).interfaceId ||
                super.supportsInterface(interfaceId);
    }

}
