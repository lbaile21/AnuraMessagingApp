import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";
const refreshConvo = async (contract, wallet) => {
  const activeConversations: Conversation[] = await contract.methods // get all active conversations
    .getMyActiveConversations(wallet)
    .call({ from: wallet });

  const allConversations = [];

  for (let i = 0; i < activeConversations.length; i++) {
    const messages = conversations[activeConversations[i].tokenID];
    allConversations.push({
      // push our data so we can use it
      secretHash: activeConversations[i].secretHash,
      tokenID: activeConversations[i].tokenID,
      IPFSendpoint: activeConversations[i].IPFSendpoint,
      messages,
    });
  }

  return allConversations;
};
export default refreshConvo;
