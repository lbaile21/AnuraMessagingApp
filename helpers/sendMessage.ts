import encrypt from "../web3/cryptography/encrypt";

const POST_CONVO_ENDPOINT = "/api/postConvo";
const MAX_MESSAGE_LENGTH = 4096;
const LIVE_REGION_TTL_MS = 1000;
const DEFAULT_REQUEST_TIMEOUT_MS = 15000;

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
 * Lazily create and cache a single ARIA live region rather than allocating
 * a fresh DOM node on every status announcement. Reusing the node avoids
 * layout thrash and reduces GC pressure on chatty conversations.
 */
let cachedLiveRegion = null;
let clearRegionTimer = null;

const getLiveRegion = () => {
  if (typeof document === "undefined" || !document.body) {
    return null;
  }
  if (cachedLiveRegion && cachedLiveRegion.isConnected) {
    return cachedLiveRegion;
  }
  const region = document.createElement("div");
  region.setAttribute("role", "status");
  region.setAttribute("aria-atomic", "true");
  region.style.cssText =
    "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);";
  document.body.appendChild(region);
  cachedLiveRegion = region;
  return region;
};

const announceToScreenReader = (text, politeness = "polite") => {
  const region = getLiveRegion();
  if (!region || !isNonEmptyString(text)) {
    return;
  }
  region.setAttribute("aria-live", politeness);
  region.textContent = text;

  if (clearRegionTimer) {
    clearTimeout(clearRegionTimer);
  }
  clearRegionTimer = setTimeout(() => {
    if (cachedLiveRegion) {
      cachedLiveRegion.textContent = "";
    }
    clearRegionTimer = null;
  }, LIVE_REGION_TTL_MS);
};

const buildPayload = (convo, message) =>
  JSON.stringify({
    tokenID: convo.tokenID,
    message,
  });

/**
 * Race a promise against a timeout so a stalled network does not leave
 * the UI hanging indefinitely. Uses AbortController when supported.
 */
const withTimeout = (input, init, timeoutMs) => {
  if (typeof AbortController === "undefined") {
    return fetch(input, init);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
};

const sendMessage = async (convo, currentMessage, options = {}) => {
  assertValidConvo(convo);
  assertValidMessage(currentMessage);

  const timeoutMs = options.timeoutMs || DEFAULT_REQUEST_TIMEOUT_MS;

  let response;
  try {
    response = await withTimeout(
      POST_CONVO_ENDPOINT,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: buildPayload(convo, currentMessage),
      },
      timeoutMs
    );
  } catch (err) {
    announceToScreenReader("Message failed to send.", "assertive");
    throw err;
  }

  if (!response.ok) {
    announceToScreenReader("Message failed to send.", "assertive");
    throw new Error(`Failed to send message (status ${response.status})`);
  }

  announceToScreenReader("Message sent.");
  return response;
};

export default sendMessage;
