import encrypt from "../web3/cryptography/encrypt";

const POST_CONVO_ENDPOINT = "/api/postConvo";

const sendMessage = async (convo, currentMessage) => {
  if (!convo || typeof convo.tokenID === "undefined") {
    throw new Error("sendMessage: missing convo or tokenID");
  }
  if (!currentMessage) {
    throw new Error("sendMessage: message is empty");
  }

  try {
    const response = await fetch(POST_CONVO_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tokenID: convo.tokenID,
        message: currentMessage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message (status ${response.status})`);
    }

    return response;
  } catch (err) {
    alert(err.message);
  }
};
export default sendMessage;
