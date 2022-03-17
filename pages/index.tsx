import { Box, Button, Center, Heading, Input, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import StartConvoModal from "../components/startConvoModal";
import loadContract, { web3 } from "../web3/loadContract";
import getConversations from "../web3/methods/getConversations";
import RenderConversations from "../components/renderConversations";
import * as IPFS from "ipfs-core";
import { IPFS as IPFSINTERFACE } from "../node_modules/ipfs-core-types/src/index";
import MyTest from "../components/testter";

const IndexPage = () => {
  // const [state, doFetch] = useAsyncFn(async () => {
  //   // const [convos, setconvos] = useState<any[]>();
  //   // @ts-expect-error
  //   if (!window.ethereum) alert("Please install Metamask");
  //   try {
  //     console.log("hi");
  //     console.log("bye");
  //     const contract = await loadContract(); // load contract
  //     console.log("contract has loaded");
  //     const wallet = await web3.eth.requestAccounts(); // grab wallet from metamask
  //     console.log("wallet has been grabbed");
  //     // fetch all active conversations this user has
  //     const conversations = await getConversations(
  //       contract,
  //       wallet,
  //       ipfsClient
  //     );
  //     // setconvos(conversations);

  //     return {
  //       ipfs: ipfsClient,
  //       contract,
  //       wallet: wallet[0],
  //       conversations,
  //     };
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // }, []);

  // useEffect(() => {
  //   doFetch();
  // }, []);

  // if (!state.value?.ipfs) {
  //   return (
  //     <Center h="100vh">
  //       <Spinner size="xl" />
  //     </Center>
  //   );
  // }

  // return (
  //   <Box w="50%" m="0 auto">
  //     <Heading>Welcome to our ERC-1155 messaging app</Heading>

  //     {state.value?.conversations ? (
  //       <RenderConversations state={state.value && state.value} />
  //     ) : (
  //       <Spinner size="xl" />
  //     )}

  //     <StartConvoModal state={state} />
  //   </Box>
  // );
  return <MyTest />;
};

export default IndexPage;

async function toArray(asyncIterator) {
  const arr = [];
  for await (const i of asyncIterator) arr.push(i);
  return arr;
}
