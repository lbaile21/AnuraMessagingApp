const decrypt = (secretHash: string, encryptedMessage: string): string => {
  const decipher = (salt: string) => {
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code: number) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);
    return (encoded: string) =>
      encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
  };
  const myDecryption = decipher(secretHash);
  return myDecryption(encryptedMessage);
};
export default decrypt;
