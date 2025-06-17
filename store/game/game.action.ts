import { Coordinates } from "@/types/game.types";
import { gameSelector } from "./game.store";


export function movePiece(coordinates: Coordinates) {
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

    const updatedPieces = pieces.map(p => {
        if (selectedPiece === p.pieceName) {
            return {
                ...p,
                coordinates,
            }
        }
        return p
    })
    
    gameSelector.setState({
        activePieces: updatedPieces,
        selectedPiece: null,
        selectedPieceAvailableActions: []
    })
}