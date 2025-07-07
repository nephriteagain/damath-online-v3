import { ReactNode, useEffect } from "react";
import Box from "./Box";
import { BOXES } from "@/lib/constants";
import { gameSelector } from "@/store/game/game.store";
import { useBoardContext } from "@/provider/BoardProvider";
import { Jump, PieceType } from "@/types/game.types";

export default function Board({children}:{children?:ReactNode}) {
  const boardColor = 0x5a827e;
  const boxZ = 0.4
  const playerTurnColor = gameSelector.use.playerTurnColor();
  const board = useBoardContext();
  const activePieces = gameSelector.use.activePieces();

  // NOTE: this is redundant in online games
  useEffect(() => {
    const pieceWithForceCapture : PieceType[]  = []
    const pieceWithAvailableMoves : PieceType[] = [];
    const allJumps : Jump[][] = []
    for (const box of board.boxNodes) {
      if (!box.piece) continue;
      if (playerTurnColor !== box.piece.color) continue;
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

    gameSelector.setState({
      pieceWithForceCapture,
      currentPlayerNoMoreAvailableMoves: pieceWithAvailableMoves.length === 0 && pieceWithForceCapture.length === 0 
    })
      
  }, [activePieces])

  return (
    <>
    <group name="board-group">
      {/* Board platform */}
      <mesh position={[0, 0, 0]} name="board">
        <boxGeometry args={[8, 8, 0.5]} />
        <meshBasicMaterial color={boardColor} />
      </mesh>

      {/* Grid of boxes */}
      {BOXES.map(({ x, y, color, operation }, index) => (
        <Box
          key={index}
          position={[x, y, boxZ]}
          color={color}
          operation={operation}
        />
      ))}
      {children}
    </group>
    </>
  );
}
