import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let io;
    if (res.socket.server.io) {
      console.log("Socket is already running");
      io = res.socket.server.io;
    } else {
      console.log("Socket is initializing");
      io = new Server(res.socket.server);
      res.socket.server.io = io;
    }
    res.setHeader("socket-connection", io);
    // const socket = io("wss://ipfs.anuramessaging.live:4002", {
    // extraHeaders: {
    //   "Access-Control-Allow-Origin": "*",
    // },
    // });
    res.json({ io });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
