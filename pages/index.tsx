import { Box, Button, Center, Heading, Input, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import StartConvoModal from "../components/startConvoModal";
import loadContract, { web3 } from "../web3/loadContract";
import getConversations from "../web3/methods/getConversations";
import RenderConversations from "../components/renderConversations";
import { multiaddr } from "multiaddr";
// 12D3KooWNBkmHJa8apJiiAS9yEbZwNY9m7ThNvT1V9biEq8e8Z95
import * as IPFS from "ipfs-core";
import fs from "fs";

// import IPFS from "ipfs";
// import { IPFS as IPFSINTERFACE } from "../node_modules/ipfs-core-types/src/index";
import MyTest from "../components/testter";
import { create } from "ipfs-http-client";

const IndexPage = () => {
  const [state, doFetch] = useAsyncFn(async () => {
    // const [convos, setconvos] = useState<any[]>();
    // @ts-expect-error
    if (!window.ethereum) alert("Please install Metamask");
    try {
      console.log("hi");
      const contract = await loadContract(); // load contract
      console.log("contract has loaded");
      const wallet = await web3.eth.requestAccounts(); // grab wallet from metamask
      console.log("wallet has been grabbed");
      const ipfsClient = await IPFS.create();
      // @ts-expect-error
      window.ipfsClient = ipfsClient;
      console.log("ipfs has loaded", ipfsClient);
      const addr = multiaddr(
        "/ip4/167.172.244.34/tcp/4001/p2p/12D3KooWAjqrYGPWDWHEXdKgCbFevgo6JDUDZHi6AqB4EATDMiYi"
      );

      // @ts-expect-error
      const here = await window.ipfsClient.bootstrap.add(addr);

      // @ts-expect-error
      const unDaemon = await window.ipfsClient.bootstrap.list();
      console.log(unDaemon);
      var enc = new TextEncoder(); // always utf-8
      // // console.log(enc.encode("This is a string converted to a Uint8Array"));
      const doesThisFUckingWord = await ipfsClient.pubsub.publish(
        "anuramessages",
        enc.encode("fuck this fucking ipfs bull fucking shit")
      );

      const myPeers = await ipfsClient.pubsub.peers("anuramessages");
      console.log("my peers baby:", myPeers);

      // fetch all active conversations this user has
      const conversations = await getConversations(
        contract,
        wallet,
        ipfsClient
      );
      // setconvos(conversations);
      return {
        ipfs: ipfsClient,
        contract,
        wallet: wallet[0],
        conversations,
      };
      // return ipfsClient;
    } catch (err) {
      alert(err.message);
    }
  }, []);

  useEffect(() => {
    doFetch();
  }, []);

  if (!state.value) {
    return (
      <Center h="100vh">
        <Spinner size="xl" speed="2s" />
      </Center>
    );
  }

  return (
    <Box w="50%" m="0 auto">
      <Heading>Welcome to our ERC-1155 messaging app</Heading>

      {state.value?.conversations ? (
        <RenderConversations state={state.value && state.value} />
      ) : (
        <Spinner size="xl" />
      )}

      <StartConvoModal state={state} />
    </Box>
  );
};

export default IndexPage;

async function toArray(asyncIterator) {
  const arr = [];
  for await (const i of asyncIterator) arr.push(i);
  return arr;
}

// const ipfs = await IPFS.create();

//       const file = {
//         path: "LoganRocks",
//         content: Buffer.from("fuck u logan u don't know how to use ipfs"),
//       };
//       const filesAdded = await ipfs.add(file);
//       // console.log(filesAdded.cid.toString());
//       const publish = await ipfs.name.publish(filesAdded.cid.toString());
//       console.log(publish);
