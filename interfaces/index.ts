/**
 * A persisted conversation thread, addressable by its token and backed by
 * an IPFS-hosted message log.
 */
export interface Conversation {
  /** Unique token identifier for the conversation. */
  tokenID: string;
  /** Hash of the shared secret used to authenticate participants. */
  secretHash: string;
  /** IPFS endpoint URL where the message history is stored. */
  IPFSendpoint: string;
  /** Ordered list of messages exchanged within the conversation. */
  messages: Message[];
}

export interface Message {
  /** Address or identifier of the message sender. */
  sender: string;
  /** Human-readable text content of the message. */
  message: string;
  /** Optional recipient address; omit for broadcast messages. */
  receiver?: string;
  /** Optional ARIA label for assistive technologies. */
  ariaLabel?: string;
  /** Optional unix timestamp (ms) indicating when the message was created. */
  timestamp?: number;
}

const isOptionalString = (v: unknown): boolean =>
  v === undefined || typeof v === "string";

/**
 * Type guard that verifies whether an arbitrary value conforms to the
 * {@link Message} interface shape at runtime.
 */
export function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.sender !== "string" || typeof v.message !== "string") return false;
  if (!isOptionalString(v.receiver) || !isOptionalString(v.ariaLabel)) return false;
  if (v.timestamp !== undefined && (typeof v.timestamp !== "number" || !Number.isFinite(v.timestamp))) return false;
  return true;
}
