import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { INITIAL_PIECE_POSITIONS } from "./constants"
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
      pieceName: `${p.color}|${pieces[i]}`
    } as const
    piecesWithPosition.push(piece)
  }
  return piecesWithPosition
}