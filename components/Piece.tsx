import { useMemo, useRef } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { Text } from "@react-three/drei";
import { gameSelector } from "@/store/game/game.store";
import { COORDINATES_TO_POSITION } from "@/lib/constants";
import { PieceType } from "@/types/game.types";
import { Group } from "three";

type PieceProps = ThreeElements["mesh"] & PieceType;

const Piece = ({ color, value, pieceName, coordinates }: PieceProps) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  const p = useMemo(
    () =>
      COORDINATES_TO_POSITION.find(
        (c) =>
          c.coordinates.x === coordinates.x &&
          c.coordinates.y === coordinates.y
      ),
    [coordinates]
  );

  const selectedPiece = gameSelector.use.selectedPiece();

  if (!p) {
    throw new Error("Piece not found!");
  }

  const isSelected = selectedPiece === pieceName;

  const targetPosition = useMemo(() => {
    const [x, y, z] = p.position;
    return new Vector3(x, y, isSelected ? z + 0.2 : z);
  }, [p.position, isSelected]);

  // animate select piece
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.lerp(targetPosition, 0.2);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        rotation={[Math.PI / 2, 0, 0]}
        name="piece"
        userData={{ color, value, pieceName, coordinates }}
        onClick={() => {
          if (isSelected) {
            gameSelector.setState({selectedPiece: null})
          } else {
            gameSelector.setState({ selectedPiece: pieceName });
          }
        }}
        castShadow
      >
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshBasicMaterial
          color={
            isSelected
              ? color === "RED"
                ? 0x990000 // dark red
                : 0x000099 // dark blue
              : color === "RED"
              ? 0xff0000 // normal red
              : 0x0000ff // normal blue
          }
        />
      </mesh>

      {value && (
        <Text
          position={[0, 0, 0.06]} // local to group
          fontSize={0.5}
          color="#fff"
          anchorX="center"
          anchorY="middle"
        >
          {value}
        </Text>
      )}
    </group>
  );
};

export default Piece;
