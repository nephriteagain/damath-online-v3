import createSelector from "../createSelector";
import { create } from "zustand";
import { getInitialPiecesToBoard } from "@/lib/utils";
import { COLOR, COUNTING_PIECES, GAME_TYPE } from "@/lib/constants";
import { GameStoreState } from "@/types/game.types";

const initialCountingPieces = getInitialPiecesToBoard(COUNTING_PIECES)




export const gameInitialState: GameStoreState = {
    selectedPiece: null,
    activePieces: initialCountingPieces,
    selectedPieceAvailableActions: [],
    playerTurnColor: COLOR.RED,
    scores: {
        red: "0",
        blue: "0"
    },
    gameType: GAME_TYPE.COUNTING,
    pieceWithForceCapture: [],
    currentPlayerNoMoreAvailableMoves: false,
    isGameOver: false,
    isGameForfeited: false,
    gameId: null,
    winner: null
}


const useGameStore = create<GameStoreState>()(
    () => ({
      ...gameInitialState,
    }),
  
);

export const gameSelector = createSelector(useGameStore);
