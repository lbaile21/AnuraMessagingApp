import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";

const isValidWallet = (wallet: unknown): wallet is string[] =>
  Array.isArray(wallet) && wallet.length > 0 && typeof wallet[0] === "string";

const getConversations = async (contract, wallet, ipfs?) => {
  if (!contract || !isValidWallet(wallet)) {
    return [];
  }

  const account = wallet[0];

  let activeConversations: Conversation[] = [];
  try {
    activeConversations = await contract.methods
      .getMyActiveConversations(account)
      .call({ from: account });
  } catch (err) {
    console.error("Failed to fetch active conversations:", err);
    return [];
  }

  if (!Array.isArray(activeConversations) || activeConversations.length === 0) {
    return [];
  }

  return activeConversations
    .filter((c) => c && c.tokenID != null)
    .map(({ secretHash, tokenID, IPFSendpoint }) => ({
      secretHash,
      tokenID,
      IPFSendpoint,
      messages: conversations[tokenID] || [],
    }));
};

export default getConversations;
