import { Conversation } from "../../interfaces";

const getConversations = async (contract, wallet) => {
  const activeConversations: Conversation[] = await contract.methods
    .getMyActiveConversations(wallet[0])
    .call({ from: wallet[0] });

  const filteredactiveConversations = activeConversations.map((convo) => {
    return { secretHash: convo.secretHash, tokenID: convo.tokenID };
  });
  return filteredactiveConversations;
};
export default getConversations;
