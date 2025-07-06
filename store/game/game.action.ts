import { Coordinates, GameDoc, MoveHistoryDoc, PieceType } from "@/types/game.types";
import { gameSelector } from "./game.store";
import { COLOR, BLUE_KING_COORDINATES, RED_KING_COORDINATES, GAME_TYPE, operationToSymbol, COL } from "@/lib/constants";
import * as math from "mathjs"
import { OPERATION } from "@/components/Box";
import { collection, doc, DocumentReference, onSnapshot, Timestamp,  writeBatch } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { cloneDeep } from "lodash";

export async function movePiece({
    coordinates,
    operation,
    capturedPiece,
    hasExtraJump,
}:{
    coordinates: Coordinates, 
    operation: OPERATION, 
    capturedPiece?: PieceType, 
    hasExtraJump?: boolean
}, isOnline = false) {

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
                // don't promote yet if piece has extra jump
                isKing: p.isKing ? p.isKing : hasExtraJump ? p.isKing : checkAndPromoteNewKing(p, coordinates)
            }
        }
        return p
    })

    // remove captured piece
    if (capturedPiece) {
        updatedPieces = updatedPieces.filter(p => p.pieceName !== capturedPiece.pieceName)
    }

    if (hasExtraJump) {
        console.log("HAS EXTRA JUMP")
    }

    // must extract them early here to set online games state
    const prevPlayerTurnColor = gameSelector.getState().playerTurnColor
    const prevScores = cloneDeep(gameSelector.getState().scores)
    // ---------------------------------------------//

    gameSelector.setState((state) => ({
        activePieces: updatedPieces,
        selectedPiece: null,
        selectedPieceAvailableActions: [],
        playerTurnColor: hasExtraJump ? state.playerTurnColor :  state.playerTurnColor === COLOR.RED ? COLOR.BLUE : COLOR.RED,
        scores: capturedPiece ? updateScores(pieceObject, capturedPiece, operation, pieceObject.isKing): state.scores
    }))
    if (isOnline) {
        const gameId = gameSelector.getState().gameId
        if (!gameId) throw new Error("game id not found!.")
         await updateGame({
            gameId,
            updates: {
                activePieces: updatedPieces,
                playerTurnColor: hasExtraJump ? prevPlayerTurnColor :  prevPlayerTurnColor === COLOR.RED ? COLOR.BLUE : COLOR.RED,
                scores: capturedPiece ? updateScores(pieceObject, capturedPiece, operation, pieceObject.isKing): prevScores
            },
            moveRecord: {
                move: coordinates,
                moveScore: capturedPiece ? moveScore(pieceObject, capturedPiece, operation, pieceObject.isKing) : "0",
                piece: pieceObject,
                capturedPiece: capturedPiece ?? null,
                operation: capturedPiece ? operation : null
            }
            
        })
    }
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

function moveScore(jumpPieceValue: PieceType, capturedPieceValue : PieceType, operation: OPERATION, isJumpPieceKing: boolean) {
    const gameType = gameSelector.getState().gameType;
    const symbol = operationToSymbol[operation]
    if (!symbol) {
        throw new Error("invalid operation")
    }
    if (gameType === GAME_TYPE.COUNTING || gameType === GAME_TYPE.WHOLE || gameType === GAME_TYPE.INTEGER) {
        const result = math.evaluate(`(${jumpPieceValue.value} ${symbol} ${capturedPieceValue.value}) * ${isJumpPieceKing ? 2 : 1}`)
 
        if (result === Infinity || result === -Infinity) {
            return "0"
        }
        if (isNaN(result)) {
            console.error("NEW NEW SCORE CANNOT BE NaN")
            return "0"
        }
        const formattedScore = (score: number) => {
            const r = math.format(score, { precision: 2 });
            console.log({r})
            return r;
        }

        const formmatedResult = formattedScore(result)
        return formmatedResult;
    }

    throw new Error("unhandled game type.")

}

/** listen's to game snapshots */
export function onGameSnapshot(gameRef: DocumentReference) {
    const unsub = onSnapshot(gameRef, (snap) => {
        const gameDoc = snap.data() as GameDoc | undefined
        if (!gameDoc) {
            throw new Error("Game not found.")
        }
        console.log("Updating game state...")
        gameSelector.setState({
            activePieces: gameDoc.activePieces,
            playerTurnColor: gameDoc.playerTurnColor,
            scores: gameDoc.scores,
            gameType: gameDoc.gameType,
            isGameOver: gameDoc.isGameOver,
            isGameForfeited: gameDoc.isGameForfeited
        })

    })

    return unsub;
}

type UpdateGameArgs = {
    gameId: string;
    updates: Pick<GameDoc, "playerTurnColor" | "scores" | "activePieces">;
    moveRecord: {
        move: Coordinates;
        moveScore: string;
        piece: PieceType;
        capturedPiece: PieceType | null;
        operation: OPERATION | null;
    }
    
  };
  
  async function updateGame({
    gameId,
    updates,
    moveRecord,
  }: UpdateGameArgs): Promise<boolean> {
    const {
        move,
        moveScore,
        piece,
        capturedPiece,
        operation,
    } = moveRecord

    const gameRef = doc(firestore, COL.GAMES, gameId);
    const batch = writeBatch(firestore);
  
    batch.update(gameRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  
    const moveRef = doc(collection(firestore, COL.MOVE_HISTORY));
    const moveObj: MoveHistoryDoc = {
      createdAt: Timestamp.now(),
      move,
      score: moveScore,
      piece,
      capturedPiece,
      operation,
      moveId: moveRef.id
    };
  
    batch.set(moveRef, moveObj);
    await batch.commit();
    return true;
  }
  