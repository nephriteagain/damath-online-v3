import { useMemo, useRef } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { Text } from "@react-three/drei";
import { gameSelector } from "@/store/game/game.store";
import { COLOR, COORDINATES_TO_POSITION } from "@/lib/constants";
import { PIECE_ACTION, PieceType } from "@/types/game.types";
import { Group } from "three";
import { useBoardContext } from "@/provider/BoardProvider";

type PieceProps = ThreeElements["mesh"] & PieceType;

const Piece = ({ color, value, pieceName, coordinates, isKing }: PieceProps) => {
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
  const playerTurn = gameSelector.use.playerTurnColor();
  const pieceWithForceCapture = gameSelector.use.pieceWithForceCapture();

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

  const board = useBoardContext()

 

  const isDisabled = useMemo(() => {
    if (pieceWithForceCapture.length === 0) return false;
    if (playerTurn !== color) return false;
    // this piece is included in the force move
    if (pieceWithForceCapture.some(p => p.pieceName === pieceName)) return false
    // disables the piece is not included in pieceWithForceCapture array
    return true
  }, [pieceWithForceCapture, playerTurn])

  function selectPiece() {
    if (isDisabled) {
      return;
    }
    if (playerTurn !== color) {
      return;
    }
    if (isSelected) {
      gameSelector.setState({selectedPiece: null, selectedPieceAvailableActions: []})
    } else {
      const box = board.getBoxNode(coordinates)
      const moves = box.checkAvailableMoves();
      const jumps = box.checkAvailableJumps();
      if (jumps.length > 0) {
        console.log("HAS JUMP")
        gameSelector.setState({
          selectedPiece: pieceName,
          selectedPieceAvailableActions: jumps.map(j => ({coordinates: j.coordinates, pieceToCapture: j.pieceToCapture, type: PIECE_ACTION.JUMP}))
        })
        return
      }
      gameSelector.setState({ 
        selectedPiece: pieceName,
        selectedPieceAvailableActions: moves.map(m => ({coordinates: m, type: PIECE_ACTION.MOVE})) 
      });
    }
  }

  const pieceColor = useMemo(() => {
    if (color === COLOR.RED) {
      if (isSelected && !isDisabled) {
        return "#990000"
      }
      if (isSelected && isDisabled) {
        return "#994444"
      }
      if (!isSelected && !isDisabled) {
        return "#ff0000"
      }
      if (!isSelected && isDisabled) {
        return "#ff4444"
      }
    }
    if (color === COLOR.BLUE) {
      if (isSelected && !isDisabled) {
        return "#000099"
      }
      if (isSelected && isDisabled) {
        return "#444499"
      }
      if (!isSelected && !isDisabled) {
        return "#0000ff"
      }
      if (!isSelected && isDisabled) {
        return "#4444ff"
      }
    }
    

  } ,[isDisabled, isSelected])


  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        rotation={[Math.PI / 2, 0, 0]}
        name="piece"
        userData={{ color, value, pieceName, coordinates }}
        onClick={selectPiece}
        castShadow
      >
        <cylinderGeometry args={[0.4, 0.4, isKing ? 0.3 : 0.1, 32]} />
        <meshBasicMaterial
          color={pieceColor}
        />
      </mesh>
      
      {isKing && (
        <mesh position={[0, 0, 0.1]}>
          <torusGeometry args={[0.40, 0.05, 16, 100]} />
          <meshStandardMaterial color="gold"/>
        </mesh>
      )}

      {isKing && (
        <Text
          position={[0, 0.25, 0.06 + (isKing ? 0.1 : 0 ),]} // local to group
          fontSize={0.2}
          color="gold"
          anchorX="center"
          anchorY="middle"
        >♔</Text>
      )}

      {value && (
        <Text
          position={[0, 0, 0.06 + (isKing ? 0.1 : 0 ),]} // local to group
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
