import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";

const isValidWallet = (wallet: unknown): wallet is string[] =>
  Array.isArray(wallet) && wallet.length > 0 && typeof wallet[0] === "string";

const isValidConversation = (c: unknown): c is Conversation =>
  !!c && typeof c === "object" && (c as Conversation).tokenID != null;

const fetchActiveConversations = async (
  contract,
  account: string
): Promise<Conversation[]> => {
  try {
    const result = await contract.methods
      .getMyActiveConversations(account)
      .call({ from: account });
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error("Failed to fetch active conversations:", err);
    return [];
  }
};

const getConversations = async (contract, wallet, ipfs?) => {
  if (!contract || !isValidWallet(wallet)) {
    return [];
  }

  const account = wallet[0];
  const activeConversations = await fetchActiveConversations(contract, account);

  return activeConversations
    .filter(isValidConversation)
    .map(({ secretHash, tokenID, IPFSendpoint }) => ({
      secretHash,
      tokenID,
      IPFSendpoint,
      messages: conversations[tokenID] || [],
    }));
};

export default getConversations;
