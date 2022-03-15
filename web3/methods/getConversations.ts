import { Conversation } from "../../interfaces";

const getConversations = async (contract, wallet, ipfs) => {
  const activeConversations: Conversation[] = await contract.methods // get all active conversations
    .getMyActiveConversations(wallet[0])
    .call({ from: wallet[0] });
  const allConversations = [];

  for (let i = 0; i < activeConversations.length; i++) {
    const messages = await toArray(
      ipfs.files.read(
        `/messography/${activeConversations[i].IPFSendpoint}.json` // grab all messages
      )
    );

    allConversations.push({
      // push our data so we can use it
      secretHash: activeConversations[i].secretHash,
      tokenID: activeConversations[i].tokenID,
      IPFSendpoint: activeConversations[i].IPFSendpoint,
      messages: messages.toString(),
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
