export interface Conversation {
  tokenID: string;
  secretHash: string;
  IPFSendpoint: string;
  messages: Message[];
}
export interface Message {
  sender: string;
  message: string;
  receiver?: string;
}
