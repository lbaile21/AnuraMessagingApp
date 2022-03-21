import encrypt from "../web3/cryptography/encrypt";

const sendMessage = async (convo, currentMessage) => {
  try {
    // const fullyEncryptedMessage = encrypt(convo.secretHash, message); // encrypt message

    // const messageToSend = { sender: wallet, message: fullyEncryptedMessage }; // create the message object we want to send
    // const parsedMessages = JSON.parse(convo.messages); // since we receive all JSON as strings, we have to parse our array

    // const currentMessages = [...parsedMessages]; // spread it into a new variable so we can edit it without causing errors
    // currentMessages.push(messageToSend); // push new message

    // await ipfs.files.write(
    //   // send it
    //   `/anura-messography/${convo.IPFSendpoint}.json`,
    //   JSON.stringify(currentMessage), // write it back to IPFS as a string
    //   {
    //     create: true,
    //   }
    // );

    // const newCID = await ipfs.files.stat(
    //   // read it
    //   `/anura-messography/${convo.IPFSendpoint}.json`
    // );
    await fetch("/api/postConvo", {
      method: "POST",
      body: JSON.stringify({
        tokenID: convo.tokenID,
        message: currentMessage,
      }),
    });
    // if (!response.ok) throw new Error("Could not get send message");
    // return response;
    // console.log(newCID.cid.toString());
    // await ipfs.pin.add(newCID.cid.toString());
  } catch (err) {
    alert(err.message);
  }
};
export default sendMessage;
