import { COLOR, GAME_TYPE, OPERATION } from "@/lib/constants"
import { CollectionReference, FieldValue, Timestamp } from "firebase/firestore";
import { GameMessage } from "./lobby.types";

export type Coordinates = {
    x: number;
    y: number;
}

export type PieceType = {
    color: COLOR;
    value: string;
    pieceName: `${PieceType["color"]}|${PieceType["value"]}`;
    coordinates: Coordinates
    isKing: boolean;
}

export enum DIRECTION {
    TR = "tr",
    TL = "tl",
    BR = "br",
    BL = "bl"
}

export enum PIECE_ACTION {
    MOVE = "MOVE",
    JUMP = "JUMP"
}

export type Jump = {
    coordinates: Coordinates; 
    pieceToJump: PieceType;
    pieceToCapture: PieceType; 
    direction: DIRECTION; 
    extraJumps?: Jump[]
}

export type Move = {
    coordinates: Coordinates;
    pieceToMove: PieceType;
    direction: DIRECTION
}

// export type SelectedPieceAvailableActions = JumpAction|MoveAction
type SelectedPieceAvailableActions = {
    type: PIECE_ACTION;
    coordinates: Coordinates;
    pieceToCapture?: PieceType;
    pieceToJump?: PieceType;
    extraJumps?: Jump[];
}


export type GameBase = {
    activePieces: PieceType[];
    playerTurnColor: COLOR;
    scores: {
      red: string;
      blue: string;
    };
    gameType: GAME_TYPE;
    isGameOver: boolean;
    isGameForfeited: boolean;
    /** null if local game */
    gameId: string|null;
    winner: COLOR|null;
    pieceWithForceCapture: PieceType[];
    playerColors: {
      host: {
        uid: string;
        color: COLOR;
      };
      guest: {
        uid: string;
        color: COLOR;
      };
    } | null;
  };
  
  export type GameStoreState = GameBase & {
    selectedPiece: string | null;
    selectedPieceAvailableActions: SelectedPieceAvailableActions[];
    currentPlayerNoMoreAvailableMoves: boolean;
    messages: GameMessage[];
  };
  
  export type GameDoc = GameBase & {
    createdAt: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
    playerColors: NonNullable<GameBase["playerColors"]>
    endedAt?: Timestamp | FieldValue;
    forfeitedBy?: string;
    moveHistory: CollectionReference["path"];
    messages: CollectionReference["path"];
    roomId: string;
   
  };
  

export type MoveHistoryDoc = {
    createdAt: Timestamp|FieldValue;
    move: Coordinates;
    /** the score of the current move (not the total score) */
    score: string;
    piece: PieceType;
    capturedPiece: PieceType|null;
    operation: OPERATION|null;
    moveId: string;
}