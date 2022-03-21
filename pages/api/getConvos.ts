import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import conversations from "../../conversations.json";
const getConvos = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req;

    const response = await fetch(
      `https://ipfs.anuramessaging.live/ipfs/${conversations[query.q]}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
};
export default getConvos;
