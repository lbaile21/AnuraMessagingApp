pragma solidity ^0.8.12;
// SPDX-License-Identifier: MIT

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


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
 

/*
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– CHAINLINK VRF ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
*/
 
contract VRFv2Consumer is VRFConsumerBaseV2 {
  VRFCoordinatorV2Interface COORDINATOR;
  LinkTokenInterface LINKTOKEN;
 
  // Your subscription ID.
  uint64 s_subscriptionId;
 
  // BNB TESTNET coordinator. For other networks,
  // see https://docs.chain.link/docs/vrf-contracts/#configurations
  address vrfCoordinator = 0x6A2AAd07396B36Fe02a22b33cf443582f682c82f;
 
  // BNB TESTNET LINK token contract. For other networks,
  // see https://docs.chain.link/docs/vrf-contracts/#configurations
  address link = 0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06;
 
  // The gas lane to use, which specifies the maximum gas price to bump to.
  // For a list of available gas lanes on each network,
  // see https://docs.chain.link/docs/vrf-contracts/#configurations
  bytes32 keyHash = 0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314;
 
  // Depends on the number of requested values that you want sent to the
  // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
  // so 100,000 is a safe default for this example contract. Test and adjust
  // this limit based on the network that you select, the size of the request,
  // and the processing of the callback request in the fulfillRandomWords()
  // function.
  uint32 callbackGasLimit = 100000;
 
  // The default is 3, but you can set this higher.
  uint16 requestConfirmations = 3;
 
  // For this example, retrieve 2 random values in one request.
  // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
  uint32 numWords =  1;
//  
  uint256[] internal s_randomWords;

  uint256 internal s_requestId;
  address s_owner;
 
  constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    LINKTOKEN = LinkTokenInterface(link);
    s_owner = msg.sender;
    s_subscriptionId = subscriptionId;
  }

  // Assumes the subscription is funded sufficiently.
  function requestRandomWords() public  {
    // Will revert if subscription is not set and funded.
    s_requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    );
  }

  function fulfillRandomWords(
    uint256, /* requestId */
    uint256[] memory randomWords
  ) internal override {
    s_randomWords = randomWords;
  }
 
  modifier onlyOwner() {
    require(msg.sender == s_owner);
    _;
  }
}


/*
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– MESSAGING TOKEN ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
*/

contract MessagingToken is ERC1155,VRFv2Consumer{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    address public owner;
    // UPDATE
    // UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE// UPDATE
    uint256 private contractSecretHash=12424214231413243;
    
    struct Secrets {
        address secretHash;
        uint256 tokenID; 
        string IPFSendpoint;
    }

    mapping(uint256=>address) internal secretHashes; // tokenIds => secretEncryptionHashes (every tokenId is a different conversation)
    mapping(uint256=>bool) public activeConversations; // tokenIds=> isConversationActive
    mapping(address=>address[]) public blockedUsers; // user => theirBlockedUsers[]
    mapping(address=>uint256[]) public inbox; // user => theirTokenIds[]
    mapping(address=>string[]) public conversationEndpoints; // user => theirConversationsIPFSEndpoint

    constructor() VRFv2Consumer(217) ERC1155("LOL") {
        _tokenId.set(1); // initialize erc-1155 token to start at 1
        owner=msg.sender; // make owner the person who deployed contract
    }
    
    function getCurrentToken() public view returns (uint256){
        uint256 tokenId=_tokenId.current(); // get current token id
        return tokenId-1; // return the token id that was just minted so we can pin the token to it's CID
    }

    function setContractSecretHash()public{
        require(msg.sender==owner); // only deployer can call this
        contractSecretHash=s_randomWords[0]; // make the secret hash the first element in the array of random words (MUST CALL RIGHT AFTER requestRandomWords())
    }

    function getContractSecretHash()public view returns(uint256){
        require(msg.sender==owner); // only deployer can call this
        return contractSecretHash; // show owner secret hash  (to ensure setContractSecretHash() has successfully fulfilled)
    }


    /* BLOCKLIST FUNCTIONS */
    function areTheyBlocked(address _receiver)internal view returns(bool){ // the user we want to check
        for(uint i=0;i<blockedUsers[msg.sender].length;i++){ // check my blocked users
            if(blockedUsers[msg.sender][i]==_receiver){ // if theyre in my array of blocked users
                return true; // then they are blocked
            }
        }
        return false; // if we reach here, then this means they aren't blocked
    }

    function didTheyBlockMe(address _they)internal view returns(bool){ // _they is the user we want to check blocked me
        for(uint i=0;i<blockedUsers[_they].length;i++){  // check their blocked users
            if(blockedUsers[_they][i]==msg.sender){ // if I am in it then they did block me so return true
                return true; 
            }
        }
        return false; // im not in their blocked users list so I'm not blocked :)
    }

    function blockUser(address _userToBlock) public {
        blockedUsers[msg.sender].push(_userToBlock); // push user to blocked array
    }

    function unblockUser(address _blockedUser) public {
        for(uint i=0;i<blockedUsers[msg.sender].length;i++) { // loop thru caller's blocked users
            if(blockedUsers[msg.sender][i]==_blockedUser) { // find the user that is blocked
                delete blockedUsers[msg.sender][i]; // unblock them by removing them from the blocked users array
            }
        }
    }
    
    /* CONVERSATION FUNCTIONS */
    function startConversation(address _userReceiver,string memory _endpoint)public  {
        require(msg.sender!=address(0),"This is a zero address"); 
        require(areTheyBlocked(_userReceiver)==false,"You have this user blocked!"); // check if the caller blocked them
        require(didTheyBlockMe(_userReceiver)==false,"This user has you blocked!"); // check if receiver blocked caller
        uint256 tokenId=_tokenId.current(); // get current token id

        _mint(msg.sender,tokenId,1,""); // mint erc-721 and send it to both users
        _mint(_userReceiver,tokenId,1,"");     
        inbox[msg.sender].push(tokenId); // add it to both user's token array
        inbox[_userReceiver].push(tokenId);
        
        conversationEndpoints[msg.sender].push(_endpoint); // add conversation IPFS endpoint so it can be fetched on front end
        conversationEndpoints[_userReceiver].push(_endpoint); 

        activeConversations[tokenId]=true; // set conversation as active 

        secretHashes[tokenId]=address(uint160(uint256(keccak256(abi.encodePacked(contractSecretHash,block.timestamp))))); // mix secret hash with timestamp
        _tokenId.increment(); // increment token id
    }


    function getMyActiveConversations(address _me)public view returns(Secrets[] memory) {
        require(msg.sender!=address(0),"This is a zero address"); 
        require(msg.sender==_me,"You can only fetch your own conversations"); // ensure that users can only get THEIR active convos and no one else
        Secrets[] memory mySecretData = new Secrets[](inbox[_me].length); // initialize empty array of structs 
        
        for(uint256 i = 0;i<inbox[_me].length;i++) { 
            if(activeConversations[inbox[_me][i]]==true) { // only push active conversations
                mySecretData[i]=Secrets(secretHashes[inbox[_me][i]],inbox[_me][i],conversationEndpoints[_me][i]); // push new struct to array
            }
        }
        return mySecretData; 
    }

    function deleteConversation(uint256 _conversation)public { // _conversation is tokenId
        activeConversations[_conversation]=false; // set it to inactive so that it wont be fetched on getMyActiveConversations()
    }


}
 