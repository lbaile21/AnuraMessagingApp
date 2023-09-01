export interface Conversation {
  tokenID: string;
  secretHash: string;
  IPFSendpoint: string;
  messages: Message[];
}
export interface Message {
  sender: string;
  /** Human-readable text content of the message. */
  message: string;
  /** Optional recipient address; omit for broadcast messages. */
  receiver?: string;
  /** Optional ARIA label for assistive technologies. */
  ariaLabel?: string;
}
