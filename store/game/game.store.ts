import createSelector from "../createSelector";
import { create } from "zustand";
import { getInitialPiecesToBoard } from "@/lib/utils";
import { COLOR, COUNTING_PIECES } from "@/lib/constants";
import { Coordinates, PIECE_ACTION, PieceType } from "@/types/game.types";

const initialCountingPieces = getInitialPiecesToBoard(COUNTING_PIECES)

type SelectedPieceAvailableActions = {
    type: PIECE_ACTION;
    coordinates: Coordinates;
    pieceToCapture?: PieceType;
    extraJumps?: SelectedPieceAvailableActions[];
}


type GameStoreState = {
    activePieces: PieceType[];
    selectedPiece: string|null;
    selectedPieceAvailableActions: (SelectedPieceAvailableActions)[]
    playerTurnColor: COLOR
}

export const authInitialState: GameStoreState = {
    selectedPiece: null,
    activePieces: initialCountingPieces,
    selectedPieceAvailableActions: [],
    playerTurnColor: COLOR.RED
}


const useGameStore = create<GameStoreState>()(
    () => ({
      ...authInitialState,
    }),
  
);

export const gameSelector = createSelector(useGameStore);
