import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";

/**
 * Projects an on-chain {@link Conversation} onto the shape consumed by the UI,
 * attaching any locally cached messages keyed by `tokenID`.
 *
 * The on-chain record only stores the metadata required to reconstruct a
 * conversation (the shared secret hash, the NFT token identifier and the
 * IPFS endpoint hosting the encrypted thread). Message bodies are kept in
 * the local `conversations.json` cache so the UI can render instantly while
 * fresh messages are fetched in the background.
 */
const mapConversation = ({ secretHash, tokenID, IPFSendpoint }: Conversation) => ({
  secretHash,
  tokenID,
  IPFSendpoint,
  messages: conversations[String(tokenID)] ?? [],
});

/**
 * Fetches the caller's active conversations from the contract and hydrates
 * each one with locally cached messages.
 *
 * The contract call is scoped to `wallet` via the `from` field so that
 * `msg.sender`-gated views resolve correctly. A `null`/`undefined` response
 * from the contract is treated as an empty list rather than an error.
 *
 * @param contract - A web3 contract instance exposing `getMyActiveConversations`.
 * @param wallet  - The address of the wallet whose conversations should be loaded.
 * @returns A list of UI-ready conversation objects, one per active conversation.
 * @throws If either `contract` or `wallet` is missing, or if the underlying
 *   contract call rejects (errors are propagated to the caller unchanged).
 */
const refreshConvo = async (contract, wallet) => {
  if (!contract) {
    throw new Error("refreshConvo requires a contract instance");
  }
  if (!wallet) {
    throw new Error("refreshConvo requires a wallet address");
  }

  const activeConversations: Conversation[] = await contract.methods
    .getMyActiveConversations(wallet)
    .call({ from: wallet });

  return (activeConversations ?? []).map(mapConversation);
};

export default refreshConvo;
