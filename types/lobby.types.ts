import { GAME_TYPE } from "@/lib/constants";

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