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

    const scores = gameSelector.use.scores();
    const activePieces = gameSelector.use.activePieces();
    const currentPlayerNoMoreAvailableMoves = gameSelector.use.currentPlayerNoMoreAvailableMoves()
    const isGameOver = gameSelector.use.isGameOver();
    const isGameForfeited = gameSelector.use.isGameForfeited();
    const winner = gameSelector.use.winner();

    const gameId = gameSelector.use.gameId();
  
    // TODO: make game over to a cloud function
    useEffect(() => {
      const allRedPieceCaptured = activePieces.every(p => p?.color !== COLOR.RED)
      const allBluePieceCaptured = activePieces.every(p => p?.color !== COLOR.BLUE)
      if (allRedPieceCaptured || allBluePieceCaptured || currentPlayerNoMoreAvailableMoves) {
        gameSelector.setState({isGameOver: true})
      }
      if (Number(scores.red) > Number(scores.blue)) {
        gameSelector.setState({winner: COLOR.RED})
      }
      else if (Number(scores.blue) < Number(scores.red)) {
        gameSelector.setState({winner: COLOR.BLUE})
      } else {
        gameSelector.setState({winner: null})
      }
    }, [activePieces, currentPlayerNoMoreAvailableMoves])


    useEffect(() => {
      if (isGameOver || isGameForfeited) {
        setShow(true)
      }
    }, [isGameOver, isGameForfeited])

    /** we hide the modal if gameId changes */
    useEffect(() => {
      if (gameId) {
        setShow(false)
      }
    }, [gameId])

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
                    <AlertDialogAction onClick={() => setShow(false)} >Rematch</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>,
            document.body
            )
        }
      
        </>
    )
};