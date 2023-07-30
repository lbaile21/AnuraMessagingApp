import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";

const getConversations = async (contract, wallet, ipfs?) => {
  const account = wallet[0];

  const activeConversations: Conversation[] = await contract.methods
    .getMyActiveConversations(account)
    .call({ from: account });

  if (!activeConversations || activeConversations.length === 0) {
    return [];
  }

  return activeConversations.map(({ secretHash, tokenID, IPFSendpoint }) => ({
    secretHash,
    tokenID,
    IPFSendpoint,
    messages: conversations[tokenID],
  }));
};

export default getConversations;
