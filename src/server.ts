import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { Room } from "./types";
import { setupSocket } from "./socket/socketHandler";

const publicDirPath = path.join(__dirname, "/public");

const app = express();
app.use(express.static(publicDirPath));

const server = http.createServer(app);
const socket = new Server(server);
setupSocket(socket);

server.listen(3000, function () {
  console.log("listening on *:3000");
});
