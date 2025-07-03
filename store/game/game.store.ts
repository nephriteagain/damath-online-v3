import createSelector from "../createSelector";
import { create } from "zustand";
import { getInitialPiecesToBoard } from "@/lib/utils";
import { COLOR, COUNTING_PIECES, GAME_TYPE } from "@/lib/constants";
import { Coordinates, Jump, PIECE_ACTION, PieceType } from "@/types/game.types";

const initialCountingPieces = getInitialPiecesToBoard(COUNTING_PIECES)

type SelectedPieceAvailableActions = {
    type: PIECE_ACTION;
    coordinates: Coordinates;
    pieceToCapture?: PieceType;
    pieceToJump?: PieceType;
    extraJumps?: Jump[];
}


type GameStoreState = {
    activePieces: PieceType[];
    selectedPiece: string|null;
    selectedPieceAvailableActions: (SelectedPieceAvailableActions)[];
    playerTurnColor: COLOR;
    scores: {
        red: string;
        blue: string;
    };
    gameType: GAME_TYPE;
    pieceWithForceCapture: PieceType[];
    currentPlayerNoMoreAvailableMoves: boolean;
}

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
    currentPlayerNoMoreAvailableMoves: false
}


const useGameStore = create<GameStoreState>()(
    () => ({
      ...gameInitialState,
    }),
  
);

export const gameSelector = createSelector(useGameStore);
