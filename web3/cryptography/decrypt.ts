/**
 * Decrypts a hex-encoded message that was encrypted using a XOR cipher
 * with the given secret hash as the salt.
 *
 * @param secretHash - The secret salt used during encryption.
 * @param encryptedMessage - The hex-encoded encrypted payload.
 * @returns The decrypted plaintext string.
 * @throws If the encrypted message is not a valid hex string.
 */
const HEX_PATTERN = /^[0-9a-fA-F]+$/;

const isValidHex = (value: string): boolean =>
  value.length % 2 === 0 && HEX_PATTERN.test(value);

const decrypt = (secretHash: string, encryptedMessage: string): string => {
  if (typeof secretHash !== "string" || secretHash.length === 0) {
    throw new Error("decrypt: secretHash must be a non-empty string");
  }
  if (typeof encryptedMessage !== "string") {
    throw new Error("decrypt: encryptedMessage must be a string");
  }
  if (encryptedMessage.length === 0) {
    return "";
  }
  if (!isValidHex(encryptedMessage)) {
    throw new Error("decrypt: encryptedMessage must be a valid hex string");
  }

  return decipher(secretHash)(encryptedMessage);
};

/** Computes the XOR fold of all UTF-16 char codes in a string in O(n). */
const xorCharCodes = (text: string): number => {
  let acc = 0;
  for (let i = 0; i < text.length; i++) {
    acc ^= text.charCodeAt(i);
  }
  return acc;
};

const decipher = (salt: string) => {
  // Precompute the XOR fold of all salt char codes once; XOR-ing each
  // input byte against this constant is equivalent to folding it against
  // every salt code individually, but runs in O(1) per byte.
  const saltXor = xorCharCodes(salt);
  return (encoded: string): string => {
    const len = encoded.length >> 1;
    const chars = new Array<string>(len);
    for (let i = 0, j = 0; i < len; i++, j += 2) {
      const code = parseInt(encoded.slice(j, j + 2), 16);
      chars[i] = String.fromCharCode(code ^ saltXor);
    }
    return chars.join("");
  };
};

export default decrypt;
