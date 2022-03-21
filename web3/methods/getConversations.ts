import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";

const getConversations = async (contract, wallet) => {
  const activeConversations: Conversation[] = await contract.methods // get all active conversations
    .getMyActiveConversations(wallet[0])
    .call({ from: wallet[0] });

  const allConversations = [];

  for (let i = 0; i < activeConversations.length; i++) {
    const response = await fetch(
      `/api/getConvos?q=${activeConversations[i].tokenID}`
    );

    const messages = await response.json();
    console.log("some messages baby:", messages);
    allConversations.push({
      // push our data so we can use it
      secretHash: activeConversations[i].secretHash,
      tokenID: activeConversations[i].tokenID,
      IPFSendpoint: activeConversations[i].IPFSendpoint,
      messages: messages,
    });
  }

  return allConversations;
};
export default getConversations;

async function toArray(asyncIterator) {
  const arr = [];
  for await (const i of asyncIterator) arr.push(i);
  return arr;
}
