import { Coordinates, GameDoc, MoveHistoryDoc, PieceType, Jump } from "@/types/game.types";
import { gameSelector } from "./game.store";
import { COLOR, BLUE_KING_COORDINATES, RED_KING_COORDINATES, GAME_TYPE, operationToSymbol, COL } from "@/lib/constants";
import * as math from "mathjs"
import { OPERATION } from "@/components/Box";
import { and, collection, doc, onSnapshot, or, query, Timestamp,  where,  writeBatch, orderBy, limit, runTransaction, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { cloneDeep,  } from "lodash";
import { authSelector } from "../auth/auth.store";
import { Board } from "@/lib/nodes";


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
}) {

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

    const isOnline = gameSelector.getState().gameId
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
export function onGameSnapshot(gameId: string) {
    const gameRef = doc(firestore, COL.GAMES, gameId)

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
            pieceWithForceCapture:gameDoc.pieceWithForceCapture ?? [],
            isGameOver: gameDoc.isGameOver,
            isGameForfeited: gameDoc.isGameForfeited,
            gameId: gameDoc.gameId,
            winner: gameDoc.winner,
            playerColors: gameDoc.playerColors
        })

    })
    return unsub;
}


/** 
 * check if the game is over
 * NOTE: this should be a cloud function
 * for now only host should run this
 */
export function onForceCaptureOrGameOverSnapshot(gameId: string) {
    const gameRef = doc(firestore, COL.GAMES, gameId)

    const unsub = onSnapshot(gameRef, (snap) => {
        const user = authSelector.getState().user;
        if (!user) {
            console.warn("no user found -onGameOverSnapshot")
            return;
        }
            
        const gameDoc = snap.data() as GameDoc | undefined
        if (!gameDoc) {
            throw new Error("Game not found.")
        }
        
        if (gameDoc.playerColors.host.uid !== user.uid) {
            throw new Error("Only the host is allowed to run this function!")
        }


       console.log("checking for force move or if game is over...")
        
        // check if player has no more available moves
        const board = new Board(gameDoc.activePieces)

        const pieceWithForceCapture : PieceType[]  = []
            const pieceWithAvailableMoves : PieceType[] = [];
            const allJumps : Jump[][] = []
            for (const box of board.boxNodes) {
                if (!box.piece) continue;
                if (gameDoc.playerTurnColor !== box.piece.color) continue;
                const jumps = box.checkAvailableJumps();
                if (jumps.length > 0) {
                    allJumps.push(jumps)
                }
                const moves =  box.checkAvailableMoves();
                if (moves.length > 0) {
                    pieceWithAvailableMoves.push(box.piece)
                }
            }
            const filteredJumps = board.filterNestedJumpsMatrix(allJumps)
            for (const jumps of filteredJumps) {
                for (const jump of jumps) {
                    const alreadyAdded = pieceWithForceCapture.find(p => p.pieceName === jump.pieceToJump.pieceName)
                    if (alreadyAdded) {
                    continue;
                    }
                    pieceWithForceCapture.push(jump.pieceToJump)
                }
            }

        const currentPlayerNoMoreAvailableMoves = pieceWithAvailableMoves.length === 0 && pieceWithForceCapture.length === 0 

        // check if all the same color pieces are spent
        const allRedPieceCaptured = gameDoc.activePieces.every(p => p?.color !== COLOR.RED)
        const allBluePieceCaptured = gameDoc.activePieces.every(p => p?.color !== COLOR.BLUE)

        runTransaction(firestore, async t => {
            t.update(gameRef, {
                pieceWithForceCapture
            })
            if (allRedPieceCaptured || allBluePieceCaptured || currentPlayerNoMoreAvailableMoves) {
                t.update(gameRef, {
                    isGameOver: true,
                    endedAt: serverTimestamp()
                })
            }
            if (Number(gameDoc.scores.red) > Number(gameDoc.scores.blue)) {
                t.update(gameRef, {winner: COLOR.RED})
            }
            else if (Number(gameDoc.scores.blue) < Number(gameDoc.scores.red)) {
                t.update(gameRef, {winner: COLOR.BLUE})
                gameSelector.setState({winner: COLOR.BLUE})
            } else {
                t.update(gameRef, {winner: null})
            }
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
    console.log("PLAYER MOVED.")
    batch.set(moveRef, moveObj);
    await batch.commit();
    return true;
  }
  

  export function ongoingGameChecker(onChange: (roomId: string|null) => void) {
    const user = authSelector.getState().user
    if (!user) {
        throw new Error("Cannot create lobby without user account.")
    }

    const gamesRef = collection(firestore, COL.GAMES)
    const ongoingGameQ = query(gamesRef, 
        and(
            where("isGameOver", "==", false),
            where("isGameForfeited", "==", false),
            or(
                where("playerColors.host.uid", "==", user.uid),
                where("playerColors.guest.uid", "==", user.uid)
            )
        ),
        orderBy("createdAt", "desc"),
        limit(1)
    );
    const unsub = onSnapshot(ongoingGameQ, snap => {
        const docs = snap.docs.map(d => d.data()) as GameDoc[]
        if (docs.length === 0) {
            console.log("no ongoing game found.")
            onChange(null)
            return;
        }
        const doc = docs[0];
        const roomId = doc.gameId;
        console.log("ongoing game found!")
        onChange(roomId)
    });
    return unsub;
  }

  /** this is a function for exiting game safely after game has ended
   *  different to "quitGame"
   */
  export async function exitGame(gameId: string) {
    const gameRef = doc(firestore, COL.GAMES, gameId)
    await runTransaction(firestore, async t => {
        const gameSnap = await t.get(gameRef)
        const gameDoc = gameSnap.data() as GameDoc|undefined;
        if (!gameDoc) {
            throw new Error("Game not found.")
        }
        const roomRef = doc(firestore, COL.ROOMS, gameDoc.roomId);
        const roomSnap = await t.get(roomRef)
        const roomDoc = roomSnap.data() as GameDoc|undefined;
        if (!roomDoc) {
            throw new Error("Room not found or already deleted.")
        }
        t.update(roomRef, {
            gameOngoing: false
        })
    })
  }