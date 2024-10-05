export interface PlayerData {
  name: string;
  color: string;
}

export interface Player extends PlayerData {
  playerId: string;
  score: number;
}

export interface GameState {
  currRound: number;
  drawingData: string[];
  guessedWords: string[];
  word: string;
}

export interface Room {
  roomId: string;
  creator: string;
  players: Player[];
  gameState: GameState;
  settings?: {
    maxPlayers?: number;
    numRounds?: number;
    roundDuration?: number;
  };
}
