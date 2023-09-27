/**
 * Decrypts a hex-encoded message that was encrypted using a XOR cipher
 * with the given secret hash as the salt.
 *
 * @param secretHash - The secret salt used during encryption.
 * @param encryptedMessage - The hex-encoded encrypted payload.
 * @returns The decrypted plaintext string.
 * @throws If the encrypted message is not a valid hex string.
 */
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
  if (encryptedMessage.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(encryptedMessage)) {
    throw new Error("decrypt: encryptedMessage must be a valid hex string");
  }

  return decipher(secretHash)(encryptedMessage);
};

/** Converts a string into an array of its UTF-16 char codes. */
const textToCharCodes = (text: string): number[] => {
  const codes = new Array<number>(text.length);
  for (let i = 0; i < text.length; i++) {
    codes[i] = text.charCodeAt(i);
  }
  return codes;
};

/** XORs `code` against every value in `codes`, returning the accumulated result. */
const xorReduce = (codes: number[], code: number): number => {
  let acc = code;
  for (let i = 0; i < codes.length; i++) {
    acc ^= codes[i];
  }
  return acc;
};

const decipher = (salt: string) => {
  const saltCodes = textToCharCodes(salt);
  return (encoded: string): string => {
    const len = encoded.length >> 1;
    const chars = new Array<string>(len);
    for (let i = 0; i < len; i++) {
      const code = parseInt(encoded.slice(i * 2, i * 2 + 2), 16);
      chars[i] = String.fromCharCode(xorReduce(saltCodes, code));
    }
    return chars.join("");
  };
};

export default decrypt;
