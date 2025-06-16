import { useMemo } from "react";
import { Box as BoxGeometry,  } from "@react-three/drei";
import * as THREE from "three";
import { COORDINATES_TO_POSITION } from "@/lib/constants";
import { gameSelector } from "@/store/game/game.store";
import { movePiece } from "@/store/game/game.action";

export enum OPERATION {
  ADD = "ADD",
  SUBTRACT = "SUBTRACT",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
}

type BoxProps = {
  position: [number, number, number];
  color: "DARK" | "LIGHT";
  operation: OPERATION | null;
};

export default function Box({ position, color, operation }: BoxProps) {
  const baseColor = useMemo(() => color === "DARK" ? 0x000000 : 0xffffff, [color])

  const coordinates = useMemo(() => {
    const p = COORDINATES_TO_POSITION.find(c => c.position[0] === position[0] && c.position[1] === position[1])
    if (!p) {
        throw new Error("coordinate not found!")
    }
    return p?.coordinates
  }, [position])

  
  const activePieces = gameSelector.use.activePieces();

  const hasPieceOnTop = useMemo(() => {
    return Boolean(activePieces.find(piece => piece.coordinates.x === coordinates.x && piece.coordinates.y === coordinates.y))
  }, [activePieces])

  

  const symbolGroup = useMemo(() => {
    if (!operation) return null;

    const group = new THREE.Group();

    const addLine = (width: number, height: number, z: number) => {
      const geometry = new THREE.BoxGeometry(width, height, 0);
      const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = z;
      return mesh;
    };

    const addMiniline = (mesh: ReturnType<typeof addLine>, coord?: {x: number; y: number;}) => {
      const mini = mesh.clone(); // Clone the original mesh
    
      // Position it at the bottom right corner
      mini.position.set(coord?.x ?? 0.35, coord?.y ?? -0.35, mesh.position.z);
    
      // Scale it down
      mini.scale.set(0.3, 0.3, 0.3);
    
      return mini;
    };

    if (operation === OPERATION.ADD) {
      const h = addLine(0.7, 0.1, 0.11);
      const v = addLine(0.1, 0.7, 0.11);
      group.add(h, v);
      if (hasPieceOnTop) {
        const h1 =  addMiniline(h);
        const v1 = addMiniline(v);
        group.add(h1, v1)
      }
    }

    if (operation === OPERATION.MULTIPLY) {
      const h = addLine(0.7, 0.1, 0.11);
      const v = addLine(0.1, 0.7, 0.11);
      h.rotation.z = Math.PI / 4;
      v.rotation.z = Math.PI / 4;
      group.add(h, v);
      if (hasPieceOnTop) {
        const h1 =  addMiniline(h);
        const v1 = addMiniline(v);
        group.add(h1, v1)
      }
    }

    if (operation === OPERATION.SUBTRACT) {
      const h = addLine(0.7, 0.1, 0.11);
      group.add(h);
      if (hasPieceOnTop) {
        const h1 = addMiniline(h)
        group.add(h1)
      }
    }

    if (operation === OPERATION.DIVIDE) {
      const line = addLine(0.7, 0.1, 0.11);
      group.add(line);

      const dotGeo = new THREE.SphereGeometry(0.05, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const topDot = new THREE.Mesh(dotGeo, dotMat);
      topDot.position.set(0, 0.2, 0.1);
      const bottomDot = new THREE.Mesh(dotGeo, dotMat);
      bottomDot.position.set(0, -0.2, 0.1);
      group.add(topDot, bottomDot);
      if (hasPieceOnTop) {
        const mineDivide = group.clone()
        mineDivide.position.set(0.35, -0.35, 0.11)
        mineDivide.scale.set(0.3, 0.3, 0.3)
        group.add(mineDivide)
      }
      
    }

    return group;
  }, [operation, hasPieceOnTop]);




  return (
    <group position={position} name="box">
      <BoxGeometry 
        args={[1, 1, 0.2]} 
        onClick={() => {
          // this means that the Box is not playable
          if (!operation) {
            return;
          }
          movePiece(coordinates)}
        }  
        userData={{ operation, coordinates, color, position }} 
    >
        <meshBasicMaterial attach="material" color={baseColor} />
      </BoxGeometry>

      {/* Use primitive to render raw THREE.Group */}
      {symbolGroup && <primitive object={symbolGroup} />}
    </group>
  );
}
