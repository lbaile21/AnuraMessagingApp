import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";
const refreshConvo = async (contract, wallet) => {
  const activeConversations: Conversation[] = await contract.methods // get all active conversations
    .getMyActiveConversations(wallet)
    .call({ from: wallet });

  return activeConversations.map(({ secretHash, tokenID, IPFSendpoint }) => ({
    secretHash,
    tokenID,
    IPFSendpoint,
    messages: conversations[tokenID],
  }));
};
export default refreshConvo;
