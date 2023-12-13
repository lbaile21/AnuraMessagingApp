import encrypt from "../web3/cryptography/encrypt";

const POST_CONVO_ENDPOINT = "/api/postConvo";
const MAX_MESSAGE_LENGTH = 4096;

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const assertValidConvo = (convo) => {
  if (!convo || typeof convo.tokenID === "undefined") {
    throw new Error("sendMessage: missing convo or tokenID");
  }
};

const assertValidMessage = (message) => {
  if (!isNonEmptyString(message)) {
    throw new Error("sendMessage: message is empty");
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(
      `sendMessage: message exceeds ${MAX_MESSAGE_LENGTH} characters`
    );
  }
};

const sendMessage = async (convo, currentMessage) => {
  assertValidConvo(convo);
  assertValidMessage(currentMessage);

  const payload = JSON.stringify({
    tokenID: convo.tokenID,
    message: currentMessage,
  });

  const response = await fetch(POST_CONVO_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });

  if (!response.ok) {
    throw new Error(`Failed to send message (status ${response.status})`);
  }

  return response;
};

export default sendMessage;
