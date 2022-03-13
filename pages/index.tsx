import { Box, Button, Heading, Spinner, Textarea } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import StartConvoModal from "../components/startConvoModal";
import { Conversation } from "../interfaces";
import { buttonClick, unEncrypt } from "../web3";
import loadContract, { web3 } from "../web3/loadContract";
import { ethers } from "ethers";
import getConversations from "../web3/methods/getConversations";
import RenderConversations from "../components/renderConversations";
// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page

// MetaMask requires requesting permission to connect users accounts

const IndexPage = () => {
  const [message, setMessage] = useState("");
  const [state, doFetch] = useAsyncFn(async () => {
    // @ts-expect-error
    if (!window.ethereum) alert("Please install Metamask");
    try {
      const contract = await loadContract();
      const wallet = await web3.eth.requestAccounts();
      const conversations = await getConversations(contract, wallet);
      return {
        contract,
        wallet: wallet[0],
        conversations,
      };
    } catch (err) {
      alert(err.message);
    }
  }, []);

  useEffect(() => {
    doFetch();
  }, []);
  console.log(state.value);

  return (
    <Box w="50%" m="0 auto">
      <Heading>Welcome to our ERC-1155 messaging app</Heading>
      <Button
        onClick={async () => {
          console.log(
            state.value?.contract.methods
              .whoAmI()
              .call({ from: state.value?.wallet })
          );
        }}
      >
        Click me
      </Button>
      {state.value?.conversations ? (
        <RenderConversations conversations={state.value?.conversations} />
      ) : (
        <Spinner size="xl" />
      )}

      <StartConvoModal state={state} />
    </Box>
  );
};

export default IndexPage;
