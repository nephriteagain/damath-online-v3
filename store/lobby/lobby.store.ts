import createSelector from "../createSelector";
import { create } from "zustand";
import { type Room } from "@/types/lobby.types"
import { GAME_TYPE, ORDER_BY } from "@/lib/constants";
import { persist } from "zustand/middleware"

export type LobbyStoreState = {
    rooms: Room[];
    joinedRoom: Room|null;
    gameTypeFilter: null|GAME_TYPE;
    lobbyOrder: ORDER_BY;
    ongoingGameId: string|null;
}

export const lobbyInitialState : LobbyStoreState = {
    rooms: [],
    joinedRoom: null,
    gameTypeFilter: null,
    lobbyOrder: ORDER_BY.ASC,
    ongoingGameId: null
}


const useLobbyStore = create<LobbyStoreState>()(
    persist(
        () => ({
            ...lobbyInitialState,
        }),
        {
            name: "lobby-storage"
        }
    )
);

export const lobbySelector = createSelector(useLobbyStore);