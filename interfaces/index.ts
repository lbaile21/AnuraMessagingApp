export interface Conversation {
  tokenID: string;
  secretHash: string;
  IPFSendpoint: string;
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

/**
 * Type guard that verifies whether an arbitrary value conforms to the
 * {@link Message} interface shape at runtime.
 */
export function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.sender !== "string" || typeof v.message !== "string") return false;
  if (v.receiver !== undefined && typeof v.receiver !== "string") return false;
  if (v.ariaLabel !== undefined && typeof v.ariaLabel !== "string") return false;
  if (v.timestamp !== undefined && typeof v.timestamp !== "number") return false;
  return true;
}
