import encrypt from "../web3/cryptography/encrypt";

const sendMessage = async (convo, ipfs, currentMessage) => {
  // const fullyEncryptedMessage = encrypt(convo.secretHash, message); // encrypt message

  // const messageToSend = { sender: wallet, message: fullyEncryptedMessage }; // create the message object we want to send
  // const parsedMessages = JSON.parse(convo.messages); // since we receive all JSON as strings, we have to parse our array

  // const currentMessages = [...parsedMessages]; // spread it into a new variable so we can edit it without causing errors
  // currentMessages.push(messageToSend); // push new message

  await ipfs.files.write(
    // send it
    `/anura-messography/${convo.IPFSendpoint}.json`,
    JSON.stringify(currentMessage), // write it back to IPFS as a string
    {
      create: true,
    }
  );

  const newCID = await ipfs.files.stat(
    // read it
    `/anura-messography/${convo.IPFSendpoint}.json`
  );
  await fetch("/api/postConvo", {
    method: "POST",
    body: JSON.stringify({
      tokenID: convo.tokenID,
      CID: newCID.cid.toString(),
    }),
  });
  console.log(newCID.cid.toString());
};
export default sendMessage;
