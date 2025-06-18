import { Coordinates, PieceType } from "@/types/game.types";
import { gameSelector } from "./game.store";


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
            }
        }
        return p
    })

    // remove captured piece
    if (capturedPiece) {
        updatedPieces = updatedPieces.filter(p => p.pieceName !== capturedPiece.pieceName)
    }
    
    gameSelector.setState({
        activePieces: updatedPieces,
        selectedPiece: null,
        selectedPieceAvailableActions: []
    })
}