import createSelector from "../createSelector";
import { create } from "zustand";
import { getInitialPiecesToBoard } from "@/lib/utils";
import { COUNTING_PIECES } from "@/lib/constants";
import { PieceType } from "@/types/game.types";

const initialCountingPieces = getInitialPiecesToBoard(COUNTING_PIECES)


type GameStoreState = {
    selectedPiece: string|null;
    hoveredPiece: string|null;
    activePieces: PieceType[]
    
}

export const authInitialState: GameStoreState = {
    selectedPiece: null,
    hoveredPiece: null,
    activePieces: initialCountingPieces
}


const useGameStore = create<GameStoreState>()(
    () => ({
      ...authInitialState,
    }),
  
);

export const gameSelector = createSelector(useGameStore);
