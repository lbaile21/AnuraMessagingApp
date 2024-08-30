/**
 * Encrypts a message using a simple XOR cipher keyed by `secretHash`.
 *
 * Note: this is a lightweight obfuscation routine and is not intended
 * for use as a cryptographically secure encryption primitive. Prefer
 * a vetted library (e.g. WebCrypto) for any security-sensitive data.
 *
 * @param secretHash - Key used to derive the XOR salt.
 * @param message - Plaintext message to encrypt.
 * @returns Hex-encoded encrypted string. Pair with `decrypt` to recover the plaintext.
 */
const encrypt = (secretHash, message): string => {
  const cipher = (salt) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).slice(-2);
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return (text) =>
      text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
  };
  const encryptMyMessage = cipher(secretHash);
  return encryptMyMessage(message);
};
export default encrypt;
