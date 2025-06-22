import { ReactNode, useEffect } from "react";
import Box from "./Box";
import { BOXES } from "@/lib/constants";
import { gameSelector } from "@/store/game/game.store";
import { useBoardContext } from "@/provider/BoardProvider";
import { PieceType } from "@/types/game.types";

export default function Board({children}:{children?:ReactNode}) {
  const boardColor = 0x5a827e;
  const boxZ = 0.4
  const playerTurnColor = gameSelector.use.playerTurnColor();
  const board = useBoardContext();


  useEffect(() => {
    const pieceWithForceCapture : PieceType[]  = []
    for (const box of board.boxNodes) {
      if (!box.piece) continue;
      const jumps = box.checkAvailableJumps(box.piece);
      if (jumps.length > 0) {
        pieceWithForceCapture.push(box.piece)
      }
    }
    gameSelector.setState({
      pieceWithForceCapture
    })
      
  }, [playerTurnColor])

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
