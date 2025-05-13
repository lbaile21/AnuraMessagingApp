/**
 * Encrypts a message using a simple XOR cipher keyed by `secretHash`.
 *
 * Note: this is a lightweight obfuscation routine and is not intended
 * for use as a cryptographically secure encryption primitive. Prefer
 * a vetted library (e.g. WebCrypto) for any security-sensitive data.
 *
 * @param secretHash - Key used to derive the XOR salt. Must be a non-empty string.
 * @param message - Plaintext message to encrypt. May be empty (returns an empty string).
 * @returns Hex-encoded encrypted string (lowercase, two hex chars per input character).
 *          Pair with `decrypt` using the same `secretHash` to recover the plaintext.
 */
const encrypt = (secretHash: string, message: string): string => {
  // Precompute the combined XOR value from the salt once, rather than
  // reducing over the salt characters for every character of the message.
  let saltXor = 0;
  for (let i = 0; i < secretHash.length; i++) {
    saltXor ^= secretHash.charCodeAt(i);
  }

  const byteHex = (n: number) => ("0" + n.toString(16)).slice(-2);

  let out = "";
  for (let i = 0; i < message.length; i++) {
    out += byteHex(message.charCodeAt(i) ^ saltXor);
  }
  return out;
};
export default encrypt;
