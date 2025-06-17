import createSelector from "../createSelector";
import { create } from "zustand";
import { getInitialPiecesToBoard } from "@/lib/utils";
import { COUNTING_PIECES } from "@/lib/constants";
import { Coordinates, PIECE_ACTION, PieceType } from "@/types/game.types";

const initialCountingPieces = getInitialPiecesToBoard(COUNTING_PIECES)


type GameStoreState = {
    activePieces: PieceType[];
    selectedPiece: string|null;
    selectedPieceAvailableActions: {type: PIECE_ACTION, coordinates: Coordinates}[]
}

export const authInitialState: GameStoreState = {
    selectedPiece: null,
    activePieces: initialCountingPieces,
    selectedPieceAvailableActions: []
}


const useGameStore = create<GameStoreState>()(
    () => ({
      ...authInitialState,
    }),
  
);

export const gameSelector = createSelector(useGameStore);
