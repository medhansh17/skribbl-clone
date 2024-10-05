import * as redis from "redis";
import { PlayerData, Room } from "../types";

const client = redis.createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => {
  console.log("Error Here: " + err);
});

client.connect().then(() => {
  console.log("Connected to Redis");
});

const ROOM_PREFIX = "room:";
const PLAYER_PREFIX = "player:";

export async function getRoom(roomId: string) {
  const room = await client.get(ROOM_PREFIX + roomId);
  return room ? JSON.parse(room) : null;
}

export async function setRoom(roomId: Room, room: string) {
  await client.set(ROOM_PREFIX + room, JSON.stringify(roomId));
}

export async function deleteRoom(roomId: string) {
  await client.del(ROOM_PREFIX + roomId);
}

export async function getPlayer(playerId: string) {
  const playerInfo = await client.get(PLAYER_PREFIX + playerId);
  return playerInfo ? JSON.parse(playerInfo) : null;
}

export async function setPlayer(playerId: string, playerData: PlayerData) {
  await client.set(PLAYER_PREFIX + playerId, JSON.stringify(playerData));
}

export async function deletePlayer(playerId: string) {
  await client.del(PLAYER_PREFIX + playerId);
}
