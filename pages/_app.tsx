import { ChakraProvider, theme } from "@chakra-ui/react";
import { AppProps } from "next/app";
import React from "react";
import Layout from "../components/Layouts";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider theme={theme}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ChakraProvider>
);

export default MyApp;
