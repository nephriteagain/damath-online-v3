import { COLOR } from "@/lib/constants"

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

export type JumpAction = {
    type: PIECE_ACTION.JUMP
} & Jump

export type MoveAction = {
    type: PIECE_ACTION.MOVE
} & Move

export type SelectedPieceAvailableActions = JumpAction|MoveAction
