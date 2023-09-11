import { NextApiRequest, NextApiResponse } from "next";
import previousConversations from "../../conversations.json";
import fs from "fs";

/**
 * POST /api/postConvo
 *
 * Persists a single conversation entry, keyed by `tokenID`, into the
 * `conversations.json` store at the project root. The endpoint merges the
 * incoming `message` with any previously stored conversations so that
 * existing entries are preserved (or overwritten if the same `tokenID` is
 * supplied again).
 *
 * Expected request body (JSON-encoded string):
 *   {
 *     "tokenID": string,   // unique identifier for the conversation
 *     "message": unknown   // payload to associate with the tokenID
 *   }
 *
 * Response: the current size of `conversations.json` in megabytes, which
 * callers can use as a lightweight signal for storage growth.
 */
const postConversation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Grab tokenID and message from the request body.
    const { tokenID, message } = JSON.parse(req.body);

    // Merge the new entry into the existing conversations map.
    const conversations = { ...previousConversations };
    conversations[tokenID] = message;
    const jsonString = JSON.stringify(conversations);

    // Measure the on-disk size of the store before writing the update.
    const stats = fs.statSync(`./conversations.json`);
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    // Persist the updated conversations map back to disk.
    fs.writeFile(`./conversations.json`, jsonString, (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    });

    // Return the pre-write file size (in MB) to the caller.
    res.json(fileSizeInMegabytes);
  } catch (err) {
    res.status(err.status).json({ err: err.message });
  }
};
export default postConversation;
