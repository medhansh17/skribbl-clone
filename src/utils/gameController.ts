import { Socket } from "socket.io";
import { setRoom } from "./redis";
import { Player, PlayerData, Room } from "../types";

export function generateRandomId(): string {
  return String("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}

export async function generateEmptyRoom(socket: Socket, host: PlayerData) {
  const roomId = generateRandomId();
  const player: Player = {
    ...host,
    playerId: socket.id,
    score: 0,
  };

  const room: Room = {
    roomId,
    creator: socket.id,
    players: [player],
    gameState: {
      currRound: 0,
      drawingData: [],
      guessedWords: [],
      word: "",
    },
  };

  await setRoom(room, roomId);
  return roomId;
}
