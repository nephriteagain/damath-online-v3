import { ReactNode } from "react";
import Box from "./Box";
import { BOXES } from "@/lib/constants";

export default function Board({children}:{children?:ReactNode}) {
  const boardColor = 0x5a827e;
  const boxZ = 0.4

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
