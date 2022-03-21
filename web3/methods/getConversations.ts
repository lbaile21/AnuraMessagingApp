import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";

const getConversations = async (contract, wallet, ipfs?) => {
  const activeConversations: Conversation[] = await contract.methods // get all active conversations
    .getMyActiveConversations(wallet[0])
    .call({ from: wallet[0] });

  const allConversations = [];

  for (let i = 0; i < activeConversations.length; i++) {
    const messages = conversations[activeConversations[i].tokenID];
    console.log("my mesasges:", messages);

    allConversations.push({
      // push our data so we can use it
      secretHash: activeConversations[i].secretHash,
      tokenID: activeConversations[i].tokenID,
      IPFSendpoint: activeConversations[i].IPFSendpoint,
      messages,
    });
  }
  console.log("ALL CONVERSATIONS:", allConversations);
  return allConversations;
};
export default getConversations;

async function toArray(asyncIterator) {
  const arr = [];
  for await (const i of asyncIterator) arr.push(i);
  return arr;
}
// const response = await fetch(
//   `/api/getConvos?q=${activeConversations[i].tokenID}`
// );
// console.log("some responses: ", response);
// const messages = await response.json();
// console.log("some messages baby:", messages);
// const messages = await ipfs.ipns.online.cache.lru.get(
//   activeConversations[i].IPFSendpoint
// );

// console.log("my messages", messages);
// const messages = await toArray(
//   ipfs.files.read(
//     `/anura-messography/${activeConversations[i].IPFSendpoint}.json` // grab all messages
//   )
// );
