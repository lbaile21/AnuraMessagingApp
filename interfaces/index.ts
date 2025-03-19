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

/**
 * A single message exchanged within a {@link Conversation}.
 *
 * Only `sender` and `message` are required; the remaining fields are
 * metadata used for routing, accessibility, and ordering.
 */
export interface Message {
  /** Address or identifier of the message sender. */
  sender: string;
  /** Human-readable text content of the message. */
  message: string;
  /** Optional recipient address; omit for broadcast messages. */
  receiver?: string;
  /** Optional ARIA label for assistive technologies. */
  ariaLabel?: string;
  /**
   * Optional ARIA role hint (e.g. "status", "alert", "log").
   * Consumers should treat unknown roles as advisory only.
   */
  ariaRole?: string;
  /** Optional unix timestamp (ms) indicating when the message was created. */
  timestamp?: number;
}

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0;

const isOptionalString = (v: unknown): boolean =>
  v === undefined || typeof v === "string";

const isValidTimestamp = (v: unknown): boolean =>
  v === undefined || (typeof v === "number" && Number.isFinite(v) && v >= 0);

/**
 * Type guard that verifies whether an arbitrary value conforms to the
 * {@link Message} interface shape at runtime.
 *
 * @param value - Candidate value, typically parsed from untrusted JSON.
 * @returns `true` when `value` satisfies the {@link Message} contract.
 */
export function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    isNonEmptyString(v.sender) &&
    typeof v.message === "string" &&
    isOptionalString(v.receiver) &&
    isOptionalString(v.ariaLabel) &&
    isOptionalString(v.ariaRole) &&
    isValidTimestamp(v.timestamp)
  );
}

/**
 * Returns an accessible description for a message, preferring an explicit
 * `ariaLabel` when provided and falling back to a sender-prefixed summary
 * suitable for screen readers.
 *
 * @example
 * ```ts
 * getAccessibleLabel({ sender: "alice", message: "hi" });
 * // => "Message from alice: hi"
 * ```
 */
export function getAccessibleLabel(message: Message): string {
  const label = message.ariaLabel?.trim();
  if (label) return label;
  const body = message.message.trim() || "(empty message)";
  return `Message from ${message.sender}: ${body}`;
}
