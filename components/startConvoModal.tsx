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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { web3 } from "../web3/loadContract";

const startConvoModal = ({ state }) => {
  const [conversationReceiver, setConversationReceiver] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const initialRef = React.useRef();
  const finalRef = React.useRef();

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
              await state.value?.contract.methods
                .startConversation(conversationReceiver)
                .send({ from: state.value?.wallet })
                .then((res) => {
                  console.log(res);
                  return toast({
                    title: "Conversation started!",
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
