import { NextApiRequest, NextApiResponse } from "next";
import previousConversations from "../../conversations.json";
import fs from "fs";
const postConversation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // grab token id and cid from request
    const { tokenID, message } = JSON.parse(req.body);
    // spread previous conversations into current conversations
    const conversations = { ...previousConversations };
    // add or change current conversation's
    conversations[tokenID] = message;
    // write to string
    const jsonString = JSON.stringify(conversations);
    //  get stats of our conversations files
    const stats = fs.statSync(`./conversations.json`);
    // get size in bytes
    const fileSizeInBytes = stats.size;
    // get size in MB
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    // write to json file
    fs.writeFile(`./conversations.json`, jsonString, (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    });
    // return size in MB
    res.json(fileSizeInMegabytes);
  } catch (err) {
    res.status(err.status).json({ err: err.message });
  }
};
export default postConversation;
