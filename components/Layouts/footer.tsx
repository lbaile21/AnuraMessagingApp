import { Box, Center, Link } from "@chakra-ui/layout";
import React from "react";
import { FaDiscord } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { useColorMode } from "@chakra-ui/color-mode";

const Footer = () => {
  const { colorMode } = useColorMode();
  return (
    <Center
      // bg="gray.100"
      bg={colorMode == "light" ? "gray.100" : "gray.900"}
      p="2%"
    >
      <Box w="33%" h="1px" />
      <Center w="33%">&copy; Copyright 2022</Center>
      <Center gap={3} justifyContent="flex-end" fontSize="40px" w="33%">
        <Link
          color="#7289DA"
          _hover={{ color: "#5972CB" }}
          isExternal
          href="https://discord.gg/PXXj542v9k"
        >
          <FaDiscord />
        </Link>

        <Link
          _hover={{ color: "#188DD5" }}
          color="#1DA1F2"
          href="https://twitter.com/AnuraDao"
          isExternal
        >
          <BsTwitter />
        </Link>
      </Center>
    </Center>
  );
};
export default Footer;
