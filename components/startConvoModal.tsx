import {
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { web3 } from "../web3/loadContract";
import moment from "moment";
import { useRouter } from "next/router";
import { IPFS as IPFSINTERFACE } from "../node_modules/ipfs-core-types/src/index";

const startConvoModal = ({ state }) => {
  const [conversationReceiver, setConversationReceiver] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const router = useRouter();

  return (
    <>
      <Button onClick={onOpen} colorScheme="linkedin">
        Start conversation
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start a convo!</ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const randomHash = web3.utils.randomHex(64); // generate random hash
              // const data = await state.value?.ipfs.files.mkdir(
              //   // create the random directory
              //   `/anura-messography`,
              //   {
              //     parents: true,
              //   }
              // );
              // console.log("SOME DATA:", data);

              // ensure that we successfully created directory
              // const myFiles = await state.value?.ipfs.files.stat(
              //   `/anura-messography`
              // );

              // console.log("IT WORKED:", myFiles.cid.toString());

              // if (!myFiles) {
              //   alert("Failed to create a conversation on IPFS"); // prompt user of error if occurs
              // }

              const message = [
                {
                  sender: state.value?.wallet,

                  message: `Conversation with ${conversationReceiver} started on ${moment().format(
                    "MMMM Do YYYY"
                  )}`, // initialize first message
                },
              ];

              await state.value?.ipfs.files.write(
                // write it so that we can find a file under randomHash.json
                `/anura-messography/${randomHash}.json`,
                JSON.stringify(message),
                { create: true }
              );

              const newConversationCID = await state.value?.ipfs.files.stat(
                `/anura-messography/${randomHash}.json`
              );

              console.log(
                "heres the cid of the json conversation:",
                newConversationCID.cid.toString()
              );

              const newConversationTokenID = await state.value?.contract.methods
                .startConversation(conversationReceiver, `${randomHash}`) // start conversation and pass in conversation ID
                .send({ from: state.value?.wallet })
                .then(async (res) => {
                  try {
                    const currentTokenId = await state.value?.contract.methods
                      .getCurrentToken()
                      .call();
                    console.log("current token id babyyy:", currentTokenId);
                    const response = await fetch("/api/postConvo", {
                      method: "POST",
                      body: JSON.stringify({
                        tokenID: currentTokenId,
                        CID: newConversationCID.cid.toString(),
                      }),
                    });
                    if (!response.ok)
                      throw new Error(
                        "Could not start conversation, please try again"
                      );
                    console.log(res); // log all the response details
                    // router.reload();
                    return toast({
                      title: "Conversation started!", // prompt success message
                      description: `Tx hash: ${res.transactionHash}`,
                      status: "success",
                      duration: 9000,
                      isClosable: true,
                    });
                  } catch (err) {
                    alert(err.message);
                  }
                })
                .catch((err) => alert(err.message));
              console.log(newConversationTokenID);
            }}
          >
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>
                  Public address of person you'd like to chat with:
                </FormLabel>
                <Input
                  onChange={(e) =>
                    // @ts-expect-error
                    setConversationReceiver(e.currentTarget.value)
                  }
                  ref={initialRef}
                  placeholder="0xd6C...380f"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3}>
                Start
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
export default startConvoModal;

async function toArray(asyncIterator) {
  const arr = [];
  for await (const i of asyncIterator) arr.push(i);
  return arr;
}
