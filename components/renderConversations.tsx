import { Button } from "@chakra-ui/button";
import {
  FormControl,
  Box,
  Center,
  Modal,
  ModalBody,
  Text,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/textarea";
import React, { useRef, useState } from "react";
import { Conversation } from "../interfaces";
import encrypt from "../web3/cryptography/encrypt";
import { IPFS as IpfsInterface } from "ipfs-core/types/src/index";
import decrypt from "../web3/cryptography/decrypt";
import sendMessage from "../helpers/sendMessage";
import RenderMessages from "./renderMessages";

const RenderConversations = ({
  state: { wallet, ipfs, conversations },
}: {
  state: { wallet: string; ipfs: IpfsInterface; conversations: Conversation[] };
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const [message, setMessage] = useState("");
  const [currentModalOpen, setCurrentModalOpen] = useState<number>();
  const messageBox = useRef();
  // const [first, setfirst] = useState(second)

  return (
    <Center flexDir="column">
      {conversations.map((convo, i) => {
        console.log("MY CONVERSATIONS:", convo);
        // const [allMessages, setAllMessages] = useState(
        //   JSON.parse(convo.messages)
        // );
        return (
          <Box key={i} w="100%">
            <Button
              p="2.5%"
              mt={3}
              onClick={() => {
                setCurrentModalOpen(i);
                onOpen();
              }}
              w="100%"
              flexDir="column"
            >
              <Heading>Click me to open conversation #{convo.tokenID}</Heading>
            </Button>
            {currentModalOpen == i && (
              <Modal
                size="4xl"
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay />
                <ModalContent h="85vh">
                  <ModalHeader>#Conversation ID: {convo.tokenID}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl h="100%">
                      <Flex h="100%" flexDir="column">
                        <Flex
                          overflowY="scroll"
                          border="1px solid black"
                          borderRadius={10}
                          h="52.5vh"
                          // bg="red"
                          p={3}
                          gap={3}
                          flexDir="column"
                        >
                          {/* <RenderMessages
                            messages={allMessages}
                            convo={convo}
                            wallet={wallet}
                          />
                        </Flex>

                        <Flex
                          flexDir="column"
                          mt={3}
                          gap={2}
                          justifyContent="flex-end"
                        >
                          <Textarea
                            ref={messageBox}
                            onChange={(e) => {
                              setMessage(e.currentTarget.value);
                            }}
                          />
                          <Button
                            ml="auto"
                            colorScheme="linkedin"
                            onClick={async () => {
                              // encrypt message
                              const encryptedMessageToSend = {
                                sender: wallet,
                                message: encrypt(convo.secretHash, message),
                              };
                              // add it to the current messages
                              allMessages.push(encryptedMessageToSend);
                              // update array of messages and rerender for instant changes
                              setAllMessages([...allMessages]);
                              // send message
                              sendMessage(convo, ipfs, allMessages);
                              // @ts-ignore
                              messageBox.current.value = ""; // set message box as empty
                              setMessage("");
                            }}
                          >
                            Send
                          </Button> */}
                        </Flex>
                      </Flex>
                    </FormControl>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
          </Box>
        );
      })}
    </Center>
  );
};
export default RenderConversations;
