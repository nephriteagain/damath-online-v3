import { Coordinates, PieceType } from "@/types/game.types";
import { gameSelector } from "./game.store";
import { COLOR, BLUE_KING_COORDINATES, RED_KING_COORDINATES, GAME_TYPE, operationToSymbol } from "@/lib/constants";
import * as math from "mathjs"
import { OPERATION } from "@/components/Box";

export function movePiece(coordinates: Coordinates, operation: OPERATION, capturedPiece?: PieceType) {

    const selectedPiece = gameSelector.getState().selectedPiece
    // no piece selected
    if (!selectedPiece) {
        console.warn("no selected piece", movePiece.name)
        return;
    }
    const pieces = gameSelector.getState().activePieces

    const pieceObject = pieces.find(p => p.pieceName === selectedPiece)
    if (!pieceObject) {
        throw new Error(`Piece ${selectedPiece} not found!`)
    }
    // moving to the same coordinates as the piece coordinates
    if (pieceObject.coordinates.x === coordinates.x && pieceObject.coordinates.y === coordinates.y) {
        return
    }


    let updatedPieces = pieces.map(p => {
        if (selectedPiece === p.pieceName) {
            return {
                ...p,
                coordinates,
                // if already king don't check
                isKing: p.isKing ? p.isKing : checkAndPromoteNewKing(p, coordinates)
            }
        }
        return p
    })

    // remove captured piece
    if (capturedPiece) {
        updatedPieces = updatedPieces.filter(p => p.pieceName !== capturedPiece.pieceName)
    }
    
    gameSelector.setState((state) => ({
        activePieces: updatedPieces,
        selectedPiece: null,
        selectedPieceAvailableActions: [],
        playerTurnColor: state.playerTurnColor === COLOR.RED ? COLOR.BLUE : COLOR.RED,
        scores: capturedPiece ? updateScores(pieceObject, capturedPiece, operation, pieceObject.isKing): state.scores
    }))
}

export function checkAndPromoteNewKing(piece:PieceType, newCoordinates: Coordinates) {
    if (piece.isKing) {
        throw new Error("Piece is already king")
    }
    if (piece.color === COLOR.RED) {
        const pieceIsInKingCoordinates = RED_KING_COORDINATES.some(k => k.x === newCoordinates.x && k.y === newCoordinates.y)
        return pieceIsInKingCoordinates
    } else {
        const pieceIsInKingCoordinates = BLUE_KING_COORDINATES.some(k => k.x === newCoordinates.x && k.y === newCoordinates.y)
        return pieceIsInKingCoordinates
    }

}

function updateScores(jumpPieceValue: PieceType, capturedPieceValue : PieceType, operation: OPERATION, isJumpPieceKing: boolean) {
    const gameType = gameSelector.getState().gameType;
    const symbol = operationToSymbol[operation]
    if (!symbol) {
        throw new Error("invalid operation")
    }
    const scores = gameSelector.getState().scores;
    const currentPlayerColor = gameSelector.getState().playerTurnColor;
    const currentPlayerScore =  scores[currentPlayerColor === COLOR.RED ? "red" : "blue"]

    if (gameType === GAME_TYPE.COUNTING || gameType === GAME_TYPE.WHOLE || gameType === GAME_TYPE.INTEGER) {
        const result = math.evaluate(`(${jumpPieceValue.value} ${symbol} ${capturedPieceValue.value}) * ${isJumpPieceKing ? 2 : 1}`)
        let newScores = math.evaluate(`${currentPlayerScore} + ${result.toFixed(2)}`)
        if (newScores === Infinity || newScores === -Infinity) {
            newScores = 0
        }
        if (isNaN(newScores)) {
            console.error("NEW NEW SCORE CANNOT BE NaN")
            newScores = 0
        }
        const formattedScore = (score: number) => {
            const r = math.format(score, { precision: 2 });
            console.log({r})
            return r;
        }
        
        return {
            red: currentPlayerColor === COLOR.RED ? formattedScore(newScores) : scores.red,
            blue: currentPlayerColor === COLOR.BLUE ? formattedScore(newScores) : scores.blue,
        };
        
    }

    throw new Error("unhandled game type.")

}