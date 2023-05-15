import encrypt from "../web3/cryptography/encrypt";

const POST_CONVO_ENDPOINT = "/api/postConvo";

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const sendMessage = async (convo, currentMessage) => {
  if (!convo || typeof convo.tokenID === "undefined") {
    throw new Error("sendMessage: missing convo or tokenID");
  }
  if (!isNonEmptyString(currentMessage)) {
    throw new Error("sendMessage: message is empty");
  }

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
