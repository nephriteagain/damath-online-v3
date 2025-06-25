"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom";
import { COLOR } from "@/lib/constants";
import { gameSelector } from "@/store/game/game.store";

export default function GameOverDialog() {
    const [show, setShow] = useState(false)
    const [winner, setWinner] = useState<null|COLOR>(null)

    const scores = gameSelector.use.scores();
    const activePieces = gameSelector.use.activePieces();
    const currentPlayerNoMoreAvailableMoves = gameSelector.use.currentPlayerNoMoreAvailableMoves()
  
    useEffect(() => {
      const allRedPieceCaptured = activePieces.every(p => p?.color !== COLOR.RED)
      const allBluePieceCaptured = activePieces.every(p => p?.color !== COLOR.BLUE)
      if (allRedPieceCaptured || allBluePieceCaptured || currentPlayerNoMoreAvailableMoves) {
        setShow(true)
      }
      if (Number(scores.red) > Number(scores.blue)) {
        setWinner(COLOR.RED)
      }
      else if (Number(scores.blue) < Number(scores.red)) {
        setWinner(COLOR.BLUE)
      } else {
        setWinner(null)
      }
    }, [activePieces, currentPlayerNoMoreAvailableMoves])

    useEffect(() => {
      console.log({scores})
      console.log({winner})
    }, [winner])

    if (!document) {
        return null
    }

    return (
        <>
        {
            document?.body && createPortal(
                <AlertDialog open={show}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>GAME OVER</AlertDialogTitle>
                    <AlertDialogDescription>
                      {winner ? `${winner} Wins!!!` : "DRAW!!!"}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    {/* <AlertDialogCancel onClick={() => setShowDialog(false)} >Cancel</AlertDialogCancel> */}
                    <AlertDialogAction onClick={() => setShow(false)} >NEW GAME</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>,
            document.body
            )
        }
      
        </>
    )
};