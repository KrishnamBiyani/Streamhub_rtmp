import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const PORT = 3000;

server.listen(() => {
  console.log(`Server started at PORT : ${PORT}`);
});
