import { Button, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from "nft.storage";
import * as IPFS from "ipfs-core";
// const NFT_STORAGE_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdGNWEyMzA3NTU4M0Q4ODRENEM2RUI2OTIzMzUzMzg5MzY0YTQ4Y2IiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NzM5NjUwNDkzNywibmFtZSI6IkVSQy0xMTU1IE1lc3NhZ2luZyJ9.wFkI6C_xJrDAIKX1dWaVl_qpAROQXyuHnRSR1ix2gAM";

// async function storeNFT() {
//   // load the file from disk
//   //   const image = await fileFromPath(imagePath);

//   // create a new NFTStorage client using our API key
//   const client = new NFTStorage({ token: NFT_STORAGE_KEY });
//   const someData = new Blob(["hello world"]);
//   const cid = await client.storeBlob(someData);
//   return cid;
//   // call client.store, passing in the image & metadata
//   //   return nftstorage.store({
//   //     convo,
//   //     name,
//   //     description,
//   //   });
// }

const MyTest = () => {
  const [IPFSclient, setIPFSclient] = useState(undefined);
  useEffect(() => {
    (async () => {
      const ipfs = await IPFS.create(); // initialize ipfs
      setIPFSclient(ipfs);
    })();
  }, []);
  if (!IPFSclient) return <Spinner />;
  return (
    <Button
      onClick={async () => {
        const addr = "/ipfs/QmbezGequPwcsWo8UL4wDF6a8hYwM1hmbzYv2mnKkEWaUp";

        IPFSclient.name
          .publish(addr)
          .then(function (res) {
            // You now receive a res which contains two fields:
            //   - name: the name under which the content was published.
            //   - value: the "real" address to which Name points.
            console.log(`https://gateway.ipfs.io/ipns/${res.name}`);
          })
          .then((val) => {
            console.log("my value:", val);
          });
        console.log("hi");
      }}
    >
      Click
    </Button>
  );
};
export default MyTest;
