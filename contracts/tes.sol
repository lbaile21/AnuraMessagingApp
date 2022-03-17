pragma solidity 0.8.12;
// SPDX-License-Identifier: MIT

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
// import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";


library Counters {
    struct Counter {
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
    
    function set(Counter storage counter, uint256 value)internal{
        counter._value=value;
    }
}

contract MyToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounterWhitelist;
    Counters.Counter private _tokenIdCounterNormal;

    struct mintedUsers{
        bool hasMinted;
        uint256 tokenID;
    }

    uint16 public totalMinted;
    string baseURI;
    mapping(address=>bool) public whiteList;
    mapping(uint256=>string) public tokenURIsMap;
    mapping(address=>mintedUsers) public usersMinted;

    constructor(address[] memory _whiteListedUsers,string memory _ipfsBaseURI) ERC721("DigitalFrog", "dFROG") {
        baseURI=_ipfsBaseURI;
        _tokenIdCounterWhitelist.set(1);
        _tokenIdCounterNormal.set(101);
        for(uint i=0;i<_whiteListedUsers.length;i++){
            whiteList[_whiteListedUsers[i]]=true;
        }
    }

    function setTokenURI(uint256 tokenID) internal {
        tokenURIsMap[tokenID]=string(abi.encodePacked(baseURI, '/', Strings.toString(tokenID),'.png'));
    }
    // QmV5iMNihUWJvvYsJktrzqrrYponco4mSSMHpneTS7Czw2
// https://bafybeifd7jrz436o63u3uvjyitsrgf2kbnxpkfmpsgikle7xso7ih5ynvq.ipfs.dweb.link/1.png
// WORKING IPFS URI: https://bafybeifd7jrz436o63u3uvjyitsrgf2kbnxpkfmpsgikle7xso7ih5ynvq.ipfs.dweb.link
// ["0x680546235ecE9af141F0bd02097CB10b12fa96B8", "0xF60A331D22F382b9d4Defd1472Faf1918668629e"]

    function safeMint(address to) public {
        require(hasUserMintedAlready(to)==false);
        require(totalMinted<=500);
        if(whiteList[to]==true) {
        uint256 tokenId = _tokenIdCounterWhitelist.current();
        _tokenIdCounterWhitelist.increment();
        _safeMint(to, tokenId);
        setTokenURI(tokenId);
        usersMinted[to]=mintedUsers(true,tokenId);
        }
        else{
        uint256 tokenId = _tokenIdCounterNormal.current();
        _tokenIdCounterNormal.increment();
        _safeMint(to, tokenId);
        setTokenURI(tokenId);
        usersMinted[to]=mintedUsers(true,tokenId);
        }
        totalMinted++;
    }


    function hasUserMintedAlready(address _user)internal view returns(bool){
        return usersMinted[_user].hasMinted;
    }    

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }


    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
