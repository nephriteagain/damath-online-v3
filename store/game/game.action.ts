import { Coordinates, PieceType } from "@/types/game.types";
import { gameSelector } from "./game.store";
import { COLOR, BLUE_KING_COORDINATES, RED_KING_COORDINATES } from "@/lib/constants";


export function movePiece(coordinates: Coordinates, capturedPiece?: PieceType) {
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
        playerTurnColor: state.playerTurnColor === COLOR.RED ? COLOR.BLUE : COLOR.RED
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