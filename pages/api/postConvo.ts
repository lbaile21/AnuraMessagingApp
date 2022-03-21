import { NextApiRequest, NextApiResponse } from "next";
import previousConversations from "../../conversations.json";
import fs from "fs";
const postConversation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // grab token id and cid from request
    const { tokenID, CID } = JSON.parse(req.body);
    // spread previous conversations into current conversations
    const conversations = { ...previousConversations };
    // add or change current conversation's CID
    conversations[tokenID] = CID;
    // write to string
    const jsonString = JSON.stringify(conversations);
    // write to json file
    fs.writeFile("./conversations.json", jsonString, (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    });
    res.json({});
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
};
export default postConversation;
