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
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/textarea";
import React, { useState } from "react";
import { Conversation } from "../interfaces";

const RenderConversations = ({
  conversations,
}: {
  conversations: Conversation[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef();
  const [message, setMessage] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");

  return (
    <Center flexDir="column">
      {conversations.map((convo, i) => {
        return (
          <Box key={i} w="100%">
            <Center bg="red" mt={3} onClick={onOpen} w="100%" flexDir="column">
              <Text>#Conversation ID: {convo.tokenID}</Text>
            </Center>

            <Modal
              size="4xl"
              initialFocusRef={initialRef}
              isOpen={isOpen}
              onClose={onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>#Conversation ID: {convo.tokenID}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <Text>Conversation ID: {convo.tokenID}</Text>
                    <Textarea
                      onChange={(e) => {
                        setMessage(e.currentTarget.value);
                      }}
                    />
                    <Flex mt={3} gap={2} justifyContent="flex-end">
                      <Button
                        onClick={() => {
                          const decipher = (salt) => {
                            const textToChars = (text) =>
                              text.split("").map((c) => c.charCodeAt(0));
                            const applySaltToChar = (code) =>
                              textToChars(salt).reduce((a, b) => a ^ b, code);
                            return (encoded) =>
                              encoded
                                .match(/.{1,2}/g)
                                .map((hex) => parseInt(hex, 16))
                                .map(applySaltToChar)
                                .map((charCode) =>
                                  String.fromCharCode(charCode)
                                )
                                .join("");
                          };
                          const myDecryption = decipher(convo.secretHash);
                          myDecryption(encryptedMessage);
                          console.log(myDecryption(encryptedMessage));
                        }}
                      >
                        Decrypt
                      </Button>
                      <Button
                        colorScheme="linkedin"
                        onClick={() => {
                          const cipher = (salt) => {
                            const textToChars = (text) =>
                              text.split("").map((c) => c.charCodeAt(0));
                            const byteHex = (n) =>
                              ("0" + Number(n).toString(16)).substr(-2);
                            const applySaltToChar = (code) =>
                              textToChars(salt).reduce((a, b) => a ^ b, code);

                            return (text) =>
                              text
                                .split("")
                                .map(textToChars)
                                .map(applySaltToChar)
                                .map(byteHex)
                                .join("");
                          };
                          const encryptMyMessage = cipher(convo.secretHash);
                          setEncryptedMessage(encryptMyMessage(message));
                          console.log(encryptedMessage);
                        }}
                      >
                        Encrypt
                      </Button>
                    </Flex>
                  </FormControl>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        );
      })}
    </Center>
  );
};
export default RenderConversations;
