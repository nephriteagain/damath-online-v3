import createSelector from "../createSelector";
import { create } from "zustand";
import { getInitialPiecesToBoard } from "@/lib/utils";
import { COUNTING_PIECES } from "@/lib/constants";
import { Coordinates, PIECE_ACTION, PieceType } from "@/types/game.types";

const initialCountingPieces = getInitialPiecesToBoard(COUNTING_PIECES)


type SelectedPieceAvailableMoves = {
    type: PIECE_ACTION.MOVE,
    coordinates: Coordinates   
}

type SelectedPieceAvailableJumps = {
    type: PIECE_ACTION.JUMP,
    coordinates: Coordinates;
    pieceToCapture: PieceType;
    // used for multi capture
    extraJumps?: SelectedPieceAvailableJumps[];
}

type SelectedPieceAvailableActions = SelectedPieceAvailableMoves|SelectedPieceAvailableJumps


type GameStoreState = {
    activePieces: PieceType[];
    selectedPiece: string|null;
    selectedPieceAvailableActions: (SelectedPieceAvailableActions)[]
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
