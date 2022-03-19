import { Box, Button, Center, Heading, Input, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import StartConvoModal from "../components/startConvoModal";
import loadContract, { web3 } from "../web3/loadContract";
import getConversations from "../web3/methods/getConversations";
import RenderConversations from "../components/renderConversations";
import IPFS from "ipfs-core";
// import IPFS from "ipfs";

// import { IPFS as IPFSINTERFACE } from "../node_modules/ipfs-core-types/src/index";
import MyTest from "../components/testter";
import io from "Socket.IO-client";
import { create } from "ipfs-http-client";

const IndexPage = () => {
  console.log(IPFS);
  const [state, doFetch] = useAsyncFn(async () => {
    // const [convos, setconvos] = useState<any[]>();
    // @ts-expect-error
    if (!window.ethereum) alert("Please install Metamask");
    try {
      const ipfs = create();

      // const addFile = async () => {
      //   const file = { path: 'testfile', content: Buffer.from('hello') };
      //   const filesAdded = await ipfs.add(file);
      //   console.log(filesAdded);
      // };

      // addFile();
      // console.log("hi");
      // console.log("bye");
      // const contract = await loadContract(); // load contract
      // console.log("contract has loaded");
      // const wallet = await web3.eth.requestAccounts(); // grab wallet from metamask
      // console.log("wallet has been grabbed");
      // const ipfs = await IPFS.create;
      // console.log(IPFS);
      // return ipfs;
      // const doesThisWOrk = await ipfs.swarm.connect(
      //   "/ip4/167.172.244.34/tcp/4001/p2p/12D3KooWAjqrYGPWDWHEXdKgCbFevgo6JDUDZHi6AqB4EATDMiYi"
      // );
      // console.log(doesThisWOrk);

      // console.log(doesThisWOrk);
      // client.pin.remote.add();
      // call Core API methods
      // const { cid } = await client.add("Hello world!");
      // console.log(cid);
      // FIXME:
      // const client = create({ url: "wss://ipfs.anuramessaging.live:4002" });
      // const { cid } = await client.add("Lol d00d!");
      // console.log(cid);
      // return ipfsClient;
      // return cid;
      // ipfsClient.pin.add
      // // fetch all active conversations this user has
      // const conversations = await getConversations(
      //   contract,
      //   wallet,
      //   ipfsClient
      // );
      // // setconvos(conversations);
      // return {
      //   ipfs: ipfsClient,
      //   contract,
      //   wallet: wallet[0],
      //   conversations,
      // };
    } catch (err) {
      alert(err.message);
    }
  }, []);

  useEffect(() => {
    doFetch();
  }, []);

  // if (!state.value) {
  //   return (
  //     <Button onClick={}>click for emit</Button>
  //     // <Center h="100vh">
  //     //   <Spinner size="xl" />
  //     // </Center>
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
  return <Button onClick={async () => {}}>Click me</Button>;
};

export default IndexPage;

async function toArray(asyncIterator) {
  const arr = [];
  for await (const i of asyncIterator) arr.push(i);
  return arr;
}
