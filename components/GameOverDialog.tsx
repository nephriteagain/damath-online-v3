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

export default function GameOverDialog() {
    const [show, setShow] = useState(false)
    const [winner, setWinner] = useState<null|COLOR>(null)

    const board = useBoardContext();
  
    useEffect(() => {
      const allRedPieceCaptured = board.boxNodes.every(box => box.piece?.color !== COLOR.RED)
      const allBluePieceCaptured = board.boxNodes.every(box => box.piece?.color !== COLOR.BLUE)
      if (allRedPieceCaptured || allBluePieceCaptured) {
        setShow(true)
      }
      if (allBluePieceCaptured) {
        setWinner(COLOR.RED)
      }
      else if (allRedPieceCaptured) {
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
                        {winner} Wins!!!
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