/**
 * XOR-cipher decryption utilities.
 *
 * This module is the inverse of the corresponding `encrypt` module: it
 * takes a hex-encoded payload produced by XOR-ing each plaintext UTF-16
 * code unit against a salt-derived key, and recovers the original text.
 *
 * The cipher is intentionally simple and is NOT cryptographically secure.
 * It exists for obfuscation / lightweight tamper-evidence only and must
 * not be relied upon to protect secrets.
 *
 * @module web3/cryptography/decrypt
 */

/** Matches a string composed solely of hexadecimal digits. */
const HEX_PATTERN = /^[0-9a-fA-F]+$/;

/** Number of hex characters used to encode a single byte. */
const HEX_CHARS_PER_BYTE = 2;

/** Radix used when parsing hex character pairs into byte values. */
const HEX_RADIX = 16;

/**
 * Returns `true` when `value` is a well-formed hex string of even length.
 *
 * An even length is required because each decoded byte consumes exactly
 * two hex characters; an odd-length string cannot represent a whole
 * number of bytes and is therefore rejected as malformed.
 */
const isValidHex = (value: string): boolean =>
  value.length % HEX_CHARS_PER_BYTE === 0 && HEX_PATTERN.test(value);

/**
 * Validates the arguments passed to {@link decrypt}.
 *
 * Throws a descriptive `Error` if either argument is of the wrong type
 * or fails a structural invariant. Pulled out of `decrypt` itself so
 * the happy-path of that function stays compact and readable.
 *
 * Error messages are phrased to name the offending parameter explicitly
 * so that screen-reader users and log readers can locate the problem
 * without consulting the source.
 */
const assertValidInputs = (
  secretHash: unknown,
  encryptedMessage: unknown,
): void => {
  if (typeof secretHash !== "string" || secretHash.length === 0) {
    throw new Error("decrypt: secretHash must be a non-empty string");
  }
  if (typeof encryptedMessage !== "string") {
    throw new Error("decrypt: encryptedMessage must be a string");
  }
  if (encryptedMessage.length > 0 && !isValidHex(encryptedMessage)) {
    throw new Error("decrypt: encryptedMessage must be a valid hex string");
  }
};

/**
 * Decrypts a hex-encoded message that was encrypted using a XOR cipher
 * with the given secret hash as the salt.
 *
 * @param secretHash - The secret salt used during encryption. Must be a
 *   non-empty string; the exact contents are opaque to this routine.
 * @param encryptedMessage - The hex-encoded encrypted payload. An empty
 *   string is treated as a valid encoding of the empty plaintext.
 * @returns The decrypted plaintext string.
 * @throws If `secretHash` is not a non-empty string, if
 *   `encryptedMessage` is not a string, or if it is a non-empty string
 *   that is not valid hex.
 */
const decrypt = (secretHash: string, encryptedMessage: string): string => {
  assertValidInputs(secretHash, encryptedMessage);
  if (encryptedMessage.length === 0) {
    return "";
  }
  return decipher(secretHash)(encryptedMessage);
};

/**
 * Computes the XOR fold of all UTF-16 char codes in a string in O(n).
 *
 * Because XOR is both associative and commutative, folding the entire
 * salt once yields a single key byte that is equivalent (per output
 * position) to XOR-ing against each salt code in turn.
 */
const xorCharCodes = (text: string): number => {
  let acc = 0;
  for (let i = 0; i < text.length; i++) {
    acc ^= text.charCodeAt(i);
  }
  return acc;
};

/**
 * Builds a decoding function bound to a particular salt.
 *
 * The returned closure precomputes the salt's XOR fold so that decoding
 * each input byte costs O(1) work, independent of the salt's length.
 */
const decipher = (salt: string) => {
  const saltXor = xorCharCodes(salt);
  return (encoded: string): string => {
    const len = encoded.length / HEX_CHARS_PER_BYTE;
    const chars = new Array<string>(len);
    for (let i = 0, j = 0; i < len; i++, j += HEX_CHARS_PER_BYTE) {
      const code = parseInt(encoded.slice(j, j + HEX_CHARS_PER_BYTE), HEX_RADIX);
      chars[i] = String.fromCharCode(code ^ saltXor);
    }
    return chars.join("");
  };
};

export default decrypt;
