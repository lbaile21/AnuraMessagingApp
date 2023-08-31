import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";

/**
 * Projects an on-chain Conversation onto the shape consumed by the UI,
 * attaching any locally cached messages keyed by tokenID.
 */
const mapConversation = ({ secretHash, tokenID, IPFSendpoint }: Conversation) => ({
  secretHash,
  tokenID,
  IPFSendpoint,
  messages: conversations[tokenID] ?? [],
});

const refreshConvo = async (contract, wallet) => {
  if (!contract || !wallet) {
    throw new Error("refreshConvo requires both a contract instance and a wallet address");
  }

  const activeConversations: Conversation[] = await contract.methods
    .getMyActiveConversations(wallet)
    .call({ from: wallet });

  return activeConversations.map(mapConversation);
};

export default refreshConvo;
