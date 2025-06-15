import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 3000;

io.on("connection", (socket) => {
  console.log("socket connected : ", socket.id);

  socket.on("binarystream", (stream) => {
    console.log("binary stream incoming");
  });
});

server.listen(PORT, () => {
  console.log(`Server started at PORT : ${PORT}`);
});
