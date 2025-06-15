"use client";

import { Canvas,  useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import Board from "@/components/Board";
import Coordinates from "@/components/Coordinates";
import Piece from "@/components/Piece";
import { gameSelector } from "@/store/game/game.store";

export default function GamePage() {
  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen">
      <Canvas shadows camera={{ position: [0, -0.5, 7], fov: 75 }}>
        <Scene />
      </Canvas>
    </main>
  );
}

function Scene() {

  const { scene, camera, } = useThree();

  const activePieces = gameSelector.use.activePieces();
  

  useEffect(() => {
    scene.background = new THREE.Color(0xEFE4D2);
    camera.lookAt(0, 0, 0);
  }, []);


  return (
    <>
    <ambientLight intensity={0.5} />
    <directionalLight castShadow position={[5, 5, 5]} />
    <Board>
    {/* Add pieces to board */}
        <Coordinates />
        {
          activePieces.map(p => (
            <Piece key={p.pieceName} {...p} />
          ))
        }
    </Board>
    {/* this will make the camera move */}
    <OrbitControls />
    </>
  );
}
