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
import { useBoardContext } from "@/provider/BoardProvider";
import { COLOR } from "@/lib/constants";
import { gameSelector } from "@/store/game/game.store";

export default function GameOverDialog() {
    const [show, setShow] = useState(false)
    const [winner, setWinner] = useState<null|COLOR>(null)

    const board = useBoardContext();
    const scores = gameSelector.use.scores();
  
    useEffect(() => {
      const allRedPieceCaptured = board.boxNodes.every(box => box.piece?.color !== COLOR.RED)
      const allBluePieceCaptured = board.boxNodes.every(box => box.piece?.color !== COLOR.BLUE)
      if (allRedPieceCaptured || allBluePieceCaptured) {
        setShow(true)
      }
      if (scores.red > scores.blue) {
        setWinner(COLOR.RED)
      }
      else if (scores.blue < scores.red) {
        setWinner(COLOR.BLUE)
      } else {
        setWinner(null)
      }
    }, [board])

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