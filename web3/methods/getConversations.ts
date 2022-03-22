import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";

const getConversations = async (contract, wallet, ipfs?) => {
  const activeConversations: Conversation[] = await contract.methods // get all active conversations
    .getMyActiveConversations(wallet[0])
    .call({ from: wallet[0] });
  console.log("ACTIVE CONVOS:", activeConversations);

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
export default getConversations;
