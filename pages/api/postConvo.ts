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
const BYTES_PER_MB = 1024 * 1024;

const getFileSizeInMB = (filePath: string): number => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size / BYTES_PER_MB;
  } catch {
    return 0;
  }
};

/**
 * Parse the incoming request body, accepting either a pre-parsed object or
 * a raw JSON string. Returns an empty object on parse failure so downstream
 * validation can produce a consistent 400 response.
 */
const parseBody = (body: unknown): Record<string, any> => {
  if (body && typeof body === "object") return body as Record<string, any>;
  if (typeof body === "string" && body.length > 0) {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return {};
};

const validatePayload = (
  tokenID: unknown,
  message: unknown
): string | null => {
  if (typeof tokenID !== "string" || tokenID.length === 0) {
    return "Missing or invalid tokenID";
  }
  if (message === undefined) {
    return "Missing message payload";
  }
  return null;
};

const postConversation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ err: "Method not allowed" });
    }

    const { tokenID, message } = parseBody(req.body);

    const validationError = validatePayload(tokenID, message);
    if (validationError) {
      return res.status(400).json({ err: validationError });
    }

    // Merge the new entry into the existing conversations map.
    const conversations = { ...previousConversations, [tokenID]: message };
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
