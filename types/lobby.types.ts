import { GAME_TYPE } from "@/lib/constants";
import { CollectionReference, DocumentReference, FieldValue, Timestamp } from "firebase/firestore";

export interface lobbyMessage {
    sId: string;
    text: string;
    mId: string;
}

export interface Lobby {
    id: string;
    host: string;
    guest: string;
    start: string;
    gameType: GAME_TYPE;
    messages: lobbyMessage[];
}

export enum MESSAGE_TYPE {
    ROOM = "room",
    GAME = "game"
}

export type RoomBase = {
    name: string;
    host: string;
    guest: string | null;
    gameType: GAME_TYPE;
    gameOngoing: boolean;
    roomId: string;
  };
  
  export type RoomDoc = RoomBase & {
    messages: CollectionReference["path"];
    createdAt: FieldValue|Timestamp;
    updatedAt?:FieldValue|Timestamp;
    updateLogs: {
      // NOTE: firebase does not allow serverTimestamp() on  array or maps
      updatedAt: Timestamp;
      log: string;
    }[];
    /** the current game will always be the last in the array */
    games: DocumentReference[]
  };
  
  export type Room = RoomBase & {
    messages: RoomMessage[];
  };

export type Message = {
    messageId: string;
    senderId: string;
    text: string;
    sentAt: Timestamp;
}

export type RoomMessage = {
    roomId: string;
    messageType: MESSAGE_TYPE.ROOM
} & Message

export type GameMessage = {
    gameId: string;
    messageType: MESSAGE_TYPE.GAME
} & Message
