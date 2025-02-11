import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";

type CachedMessages = Conversation extends { messages: infer M } ? M : unknown[];

/**
 * Normalises a `tokenID` value to the string key used by the local message
 * cache. Centralising the conversion ensures that numeric literals, decimal
 * strings and `BigNumber`-like values from web3 all resolve consistently.
 */
const cacheKey = (tokenID: Conversation["tokenID"]) => String(tokenID);

/**
 * Looks up any locally cached messages for a given NFT token identifier.
 *
 * Returns an empty array when no cached thread exists, ensuring callers
 * always receive an iterable value safe for rendering.
 */
const getCachedMessages = (tokenID: Conversation["tokenID"]): CachedMessages =>
  ((conversations as Record<string, CachedMessages>)[cacheKey(tokenID)] ??
    ([] as unknown as CachedMessages));

/**
 * Projects an on-chain {@link Conversation} onto the shape consumed by the UI,
 * attaching any locally cached messages keyed by `tokenID`.
 */
const mapConversation = ({ secretHash, tokenID, IPFSendpoint }: Conversation) => ({
  secretHash,
  tokenID,
  IPFSendpoint,
  messages: getCachedMessages(tokenID),
});

/**
 * Validates the arguments passed to {@link refreshConvo}. Extracted so the
 * main function reads as a straight-line description of the happy path.
 */
const assertArgs = (contract: any, wallet: unknown) => {
  if (!contract) {
    throw new Error("refreshConvo requires a contract instance");
  }
  if (!wallet || typeof wallet !== "string" || wallet.trim() === "") {
    throw new Error("refreshConvo requires a wallet address");
  }
  if (!contract.methods?.getMyActiveConversations) {
    throw new Error(
      "refreshConvo: contract is missing getMyActiveConversations",
    );
  }
};

/**
 * Invokes the on-chain view that returns the caller's active conversations.
 * Isolated to keep the web3 surface area in one place and to make the call
 * trivial to stub in unit tests.
 */
const fetchActiveConversations = async (
  contract: any,
  wallet: string,
): Promise<Conversation[]> => {
  const result = await contract.methods
    .getMyActiveConversations(wallet)
    .call({ from: wallet });
  return Array.isArray(result) ? result : [];
};

/**
 * Fetches the caller's active conversations from the contract and hydrates
 * each one with locally cached messages.
 *
 * @param contract - A web3 contract instance exposing `getMyActiveConversations`.
 * @param wallet  - The address of the wallet whose conversations should be loaded.
 * @returns A list of UI-ready conversation objects, one per active conversation.
 */
const refreshConvo = async (contract: any, wallet: string) => {
  assertArgs(contract, wallet);
  const active = await fetchActiveConversations(contract, wallet);
  return active.map(mapConversation);
};

export default refreshConvo;
