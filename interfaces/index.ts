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
  /** Optional ARIA role hint (e.g. "status", "alert", "log"). */
  ariaRole?: string;
  /** Optional unix timestamp (ms) indicating when the message was created. */
  timestamp?: number;
}

const isOptionalString = (v: unknown): boolean =>
  v === undefined || typeof v === "string";

const isValidTimestamp = (v: unknown): boolean => {
  if (v === undefined) return true;
  return typeof v === "number" && Number.isFinite(v) && v >= 0;
};

/**
 * Type guard that verifies whether an arbitrary value conforms to the
 * {@link Message} interface shape at runtime.
 */
export function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.sender !== "string" || typeof v.message !== "string") return false;
  if (!isOptionalString(v.receiver)) return false;
  if (!isOptionalString(v.ariaLabel) || !isOptionalString(v.ariaRole)) return false;
  if (!isValidTimestamp(v.timestamp)) return false;
  return true;
}

/**
 * Returns an accessible description for a message, preferring an explicit
 * `ariaLabel` when provided and falling back to a sender-prefixed summary
 * suitable for screen readers.
 */
export function getAccessibleLabel(message: Message): string {
  if (message.ariaLabel && message.ariaLabel.trim().length > 0) {
    return message.ariaLabel;
  }
  return `Message from ${message.sender}: ${message.message}`;
}
