import { Box, Center, Flex } from "@chakra-ui/layout";
import React from "react";
import Footer from "./footer";

const Layout = ({ children }) => {
  return (
    <Flex flexDir="column" minH="100vh" justifyContent="space-between">
      {children}
      <Footer />
    </Flex>
  );
};
export default Layout;
