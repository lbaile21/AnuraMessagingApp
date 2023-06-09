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

const textToCharCodes = (text: string): number[] =>
  text.split("").map((c) => c.charCodeAt(0));

const xorReduce = (codes: number[], code: number): number =>
  codes.reduce((a, b) => a ^ b, code);

const decipher = (salt: string) => {
  const saltCodes = textToCharCodes(salt);
  return (encoded: string): string => {
    const hexPairs = encoded.match(/.{1,2}/g) ?? [];
    return hexPairs
      .map((hex) => parseInt(hex, 16))
      .map((code) => xorReduce(saltCodes, code))
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  };
};

export default decrypt;
