import { Server, Socket } from "socket.io";
import { PlayerData } from "../types";
import { generateEmptyRoom } from "../utils/gameController";
import { getRoom, setRoom } from "../utils/redis";
// import { get } from "http";

enum GameEvent {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  JOIN_ROOM = "joinRoom",
  LEAVE_ROOM = "leaveRoom",
  START_GAME = "startGame",
  DRAW = "drawData",
  GUESS = "guess",

  JOINED_ROOM = "joinedRoom",
  LEFT_ROOM = "leftRoom",
  GAME_STARTED = "gameStarted",
  DRAW_DATA = "drawData",
  GUESSED = "guessed",
}

export function setupSocket(io: Server) {
  io.on(GameEvent.CONNECT, (socket: Socket) => {
    console.log("User connected: ", socket.id);

    socket.on(
      GameEvent.JOIN_ROOM,
      async (playerData: PlayerData, roomId?: string) => {
        console.log(playerData, roomId);
        if (!playerData) {
          socket.emit("error", "Player data is required");
          return;
        }
        if (!roomId) {
          const newRoomId = await generateEmptyRoom(socket, playerData);
          socket.join(newRoomId);
          const room = await getRoom(newRoomId);
          io.to(newRoomId).emit(GameEvent.JOINED_ROOM, room);
        } else {
          let room = await getRoom(roomId);
          if (!room) {
            console.log("Room not found");
            room = {
              roomId,
              creator: socket.id,
              players: [],
              gameState: {
                currRound: 0,
                drawingData: [],
                guessedWords: [],
                word: "",
              },
            };
            await setRoom(room, roomId);
            room = await getRoom(roomId);
            console.log("Room created");
            console.log(room);
          }
          room.players.push({
            ...playerData,
            playerId: socket.id,
            score: 0,
          });
          await setRoom(room, roomId);
          socket.join(roomId);
          io.to(roomId).emit(GameEvent.JOINED_ROOM, room);
        }
      }
    );

    socket.on(GameEvent.DRAW, (data: any) => {
      const { roomId, data: drawData } = data;
      console.log(`Draw data recieved from room ${roomId}`);
      io.to(roomId).emit(GameEvent.DRAW_DATA, drawData);
    });

    socket.on(GameEvent.GUESS, (data: any) => {
      const { roomId, guess } = data;
      socket.to(roomId).emit(GameEvent.GUESSED, guess);
      console.log(`Guess "${guess}" sent to room ${roomId}`);
    });

    socket.on(GameEvent.DISCONNECT, () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
