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

/**
 * Announce a status update to assistive technologies via an ARIA live region.
 * Falls back silently in non-browser environments (e.g. SSR, tests).
 */
const announceToScreenReader = (text, politeness = "polite") => {
  if (typeof document === "undefined" || !isNonEmptyString(text)) {
    return;
  }

  const region = document.createElement("div");
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", politeness);
  region.setAttribute("aria-atomic", "true");
  region.style.position = "absolute";
  region.style.width = "1px";
  region.style.height = "1px";
  region.style.overflow = "hidden";
  region.style.clip = "rect(0 0 0 0)";
  region.textContent = text;

  document.body.appendChild(region);
  setTimeout(() => region.remove(), 1000);
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
    announceToScreenReader("Message failed to send.", "assertive");
    throw new Error(`Failed to send message (status ${response.status})`);
  }

  announceToScreenReader("Message sent.");
  return response;
};

export default sendMessage;
