"use client"
import { Board } from "@/lib/nodes";
import { gameSelector } from "@/store/game/game.store";
import { useContext, createContext, ReactNode, useMemo,  } from "react";

const BoardContext = createContext<Board|null>(null)

export function BoardProvider({children}: {children: ReactNode}) {
    const activePieces = gameSelector.use.activePieces();

    const board = useMemo(() => {
        return new Board(activePieces)
    }, [activePieces])
    
    return (
        <BoardContext.Provider value={board}>
            {children}
        </BoardContext.Provider>
    )
}

export function useBoardContext() {
    const board = useContext(BoardContext)
    if (!board) {
        throw new Error("board context not found.")
    }
    return board
}