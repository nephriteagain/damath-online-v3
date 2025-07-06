import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { 
  INITIAL_PIECE_POSITIONS,
  COUNTING_PIECES,
  WHOLE_PIECES,
  FRACTION_PIECES,
  INTEGER_PIECES,
  RATIONAL_PIECES,
  RADICAL_PIECES,
  GAME_TYPE
 } from "./constants"
import { type PieceType } from "@/types/game.types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitialPiecesToBoard(pieces: string[]) {
  const piecesWithPosition : PieceType[] = []
  for (let i = 0; i < INITIAL_PIECE_POSITIONS.length; i++) {
    const p = INITIAL_PIECE_POSITIONS[i]
    const piece = {
      coordinates: {
        x: p.x,
        y: p.y
      },
      color: p.color,
      value: pieces[i],
      pieceName: `${p.color}|${pieces[i]}`,
      isKing: false
    } as const
    piecesWithPosition.push(piece)
  }
  return piecesWithPosition
}

export function getInitialPieces(gameType: GAME_TYPE) {
  const pieces : Record<GAME_TYPE, string[]> = {
    [GAME_TYPE.COUNTING]: COUNTING_PIECES,
    [GAME_TYPE.WHOLE]: WHOLE_PIECES,
    [GAME_TYPE.FRACTION]: FRACTION_PIECES,
    [GAME_TYPE.INTEGER]: INTEGER_PIECES,
    [GAME_TYPE.RATIONAL]: RATIONAL_PIECES,
    [GAME_TYPE.RADICAL]: RADICAL_PIECES
  }
  return pieces[gameType]
}