import { NextApiRequest, NextApiResponse } from "next";
import previousConversations from "../../conversations.json";
import fs from "fs";
import path from "path";

/**
 * POST /api/postConvo
 *
 * Persists a single conversation entry, keyed by `tokenID`, into the
 * `conversations.json` store at the project root. The endpoint merges the
 * incoming `message` with any previously stored conversations so that
 * existing entries are preserved (or overwritten if the same `tokenID` is
 * supplied again).
 *
 * Expected request body (JSON-encoded string or pre-parsed object):
 *   {
 *     "tokenID": string,   // unique identifier for the conversation
 *     "message": unknown   // payload to associate with the tokenID
 *   }
 *
 * Response: the current size of `conversations.json` in megabytes (measured
 * prior to the write), which callers can use as a lightweight signal for
 * storage growth over time.
 *
 * Errors:
 *   - 405 if the request method is not POST
 *   - 400 if `tokenID` or `message` is missing/invalid
 *   - 500 (or `err.status`) for any unexpected failure
 */
const CONVERSATIONS_PATH = path.join(process.cwd(), "conversations.json");

const getFileSizeInMB = (filePath: string): number => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024);
  } catch {
    return 0;
  }
};

const postConversation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ err: "Method not allowed" });
    }

    // Grab tokenID and message from the request body. The body may arrive
    // pre-parsed (object) or as a raw JSON string depending on the client.
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { tokenID, message } = body ?? {};

    if (typeof tokenID !== "string" || tokenID.length === 0) {
      return res.status(400).json({ err: "Missing or invalid tokenID" });
    }
    if (message === undefined) {
      return res.status(400).json({ err: "Missing message payload" });
    }

    // Merge the new entry into the existing conversations map.
    const conversations = { ...previousConversations };
    conversations[tokenID] = message;
    const jsonString = JSON.stringify(conversations);

    // Measure the on-disk size of the store before writing the update.
    const fileSizeInMegabytes = getFileSizeInMB(CONVERSATIONS_PATH);

    // Persist the updated conversations map back to disk.
    fs.writeFile(CONVERSATIONS_PATH, jsonString, (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    });

    // Return the pre-write file size (in MB) to the caller.
    res.json(fileSizeInMegabytes);
  } catch (err) {
    res.status(err.status ?? 500).json({ err: err.message });
  }
};
export default postConversation;
