// import EthCrypto from "eth-crypto";

// console.log("hello world");

// export async function buttonClick(message) {

//   const signature = EthCrypto.sign(
//     logan.privateKey,
//     EthCrypto.hash.keccak256(message)
//   );

//   const secretMessage = {
//     msg: message,
//     signature,
//   };

//   const encrypted = await EthCrypto.encryptWithPublicKey(
//     logan.publicKey,
//     JSON.stringify(secretMessage)
//   );

//   const encryptedString = EthCrypto.cipher.stringify(encrypted);

//   const encryptedObject = EthCrypto.cipher.parse(encryptedString);

//   const decrypt = await EthCrypto.decryptWithPrivateKey(
//     logan.privateKey,
//     encryptedObject
//   );

//   const decryptedPayload = JSON.parse(decrypt);

// }

// export async function unEncrypt() {
//   //   const senderAddress = EthCrypto.recover(
//   //     decryptedPayload.signature,
//   //     EthCrypto.hash.keccak256(decryptedPayload.message)
//   //   );
//   //   console.log(
//   //     "Got message from " + senderAddress + ": " + decryptedPayload.message
//   //   );
//   // const answerMessage = "Joe is lame";
//   // const answerSignature = EthCrypto.sign(
//   //   joe.privateKey,
//   //   EthCrypto.hash.keccak256(answerMessage)
//   // );
//   // const answerPayload = {
//   //   message: answerMessage,
//   //   signature: answerSignature,
//   // };
//   // const loganPublicKey = EthCrypto.recoverPublicKey(
//   //   decryptedPayload.signature,
//   //   EthCrypto.hash.keccak256(payload.message)
//   // );
//   // const encryptedAnswer = await EthCrypto.encryptWithPublicKey(
//   //   loganPublicKey,
//   //   JSON.stringify(answerPayload)
//   // );
//   // console.log(message);
// }
