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
              await state.value?.ipfs.files.mkdir(
                // create the random directory
                `/messography/${randomHash}`,
                {
                  parents: true,
                }
              );
              const myFiles = await state.value?.ipfs.files.stat(
                // ensure that we successfully created directory
                `/messography/${randomHash}`
              );
              console.log("IT WORKED:", myFiles);
              if (!myFiles) {
                alert("Failed to create a conversation on IPFS"); // prompt user of error if occurs
              }

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
                `/messography/${randomHash}.json`,
                JSON.stringify(message),
                { create: true }
              );

              await state.value?.contract.methods
                .startConversation(conversationReceiver, `${randomHash}`) // start conversation and pass in conversation ID
                .send({ from: state.value?.wallet })
                .then((res) => {
                  console.log(res); // log all the response details
                  router.reload();
                  return toast({
                    title: "Conversation started!", // prompt success message
                    description: `Tx hash: ${res.transactionHash}`,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                })
                .catch((err) => alert(err.message));
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
