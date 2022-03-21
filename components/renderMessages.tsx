import { Flex, Center, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import decrypt from "../web3/cryptography/decrypt";

const RenderMessages = ({ convo, wallet, messages }) => {
  const { colorMode } = useColorMode();
  return messages.map((message, i) => {
    // parse since it's a string
    if (!i) {
      return (
        <Flex
          fontSize="14px"
          // bg="gray.200"
          bg={colorMode == "light" ? "gray.200" : "gray.900"}
          borderRadius={5}
          w="100%"
          p="2.5%"
          key={i}
          flexDir="column"
        >
          <Center flexDir="column">{message.message}</Center>
        </Flex>
      );
    }

    return (
      <Flex
        maxW="50%"
        p={2}
        // borderRadius={10}
        borderTopRightRadius={10}
        borderLeftRadius={10}
        ml={message.sender == wallet ? "auto" : 0}
        mr={message.sender == wallet ? 0 : "auto"}
        color={message.sender == wallet ? "white" : "black"}
        bg={message.sender == wallet ? "#0079d3" : "gray.200"}
        textAlign={message.sender == wallet ? "right" : "left"}
        key={i}
        flexDir="column"
      >
        {decrypt(convo.secretHash, message.message)}
      </Flex>
    );
  });
};
export default RenderMessages;
