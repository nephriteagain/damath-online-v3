"use client";

import { Canvas,  useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import Board from "@/components/Board";
import Coordinates from "@/components/Coordinates";
import Piece from "@/components/Piece";
import { gameSelector } from "@/store/game/game.store";
import GameOverDialog from "@/components/GameOverDialog";
import ScoreBoard from "@/components/Scoreboard";
import { onForceCaptureOrGameOverSnapshot, onGameSnapshot } from "@/store/game/game.action";
import { lobbySelector } from "@/store/lobby/lobby.store";
import Button from "@/components/Button";
import Link from "next/link";
import { authSelector } from "@/store/auth/auth.store";
import { Unsubscribe } from "firebase/firestore";

export default function GamePage() {

  const ongoingGameId = lobbySelector.use.ongoingGameId();
 

  if (!ongoingGameId) {
    return <main className="flex flex-col items-center justify-center w-screen h-screen gap-y-4">
      <h1>
      No ongoing game found.
      </h1>
      <Link href={"/lobby"}>
        <Button>Back to lobby.</Button>
      </Link>
      </main>
  }

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen">
      <GameOverDialog />
      <Canvas shadows camera={{ position: [0, -0.5, 7], fov: 75 }}>
        <Scene />
      </Canvas>
    </main>
  );
}

function Scene() {

  const { scene, camera, } = useThree();

  const activePieces = gameSelector.use.activePieces();
  const ongoingGameId = lobbySelector.use.ongoingGameId();
  const joinedRoom = lobbySelector.use.joinedRoom();
  const user = authSelector.use.user();

  useEffect(() => {
    scene.background = new THREE.Color(0xEFE4D2);
    camera.lookAt(0, 0, 0);
  }, []);

  useEffect(() => {
    if (!ongoingGameId) return
    console.log(`listening to game ${ongoingGameId}...`)
    const unsub = onGameSnapshot(ongoingGameId)
    const isHost = joinedRoom && user  && joinedRoom.host === user.uid
    let unsub2 : Unsubscribe;

    // NOTE: this should be a cloud function
    if (isHost) {
      unsub2 = onForceCaptureOrGameOverSnapshot(ongoingGameId)
    }

    return () => {
      unsub();
      unsub2?.();
    }
  }, [ongoingGameId, user, joinedRoom])



  return (
    <>
    <ambientLight intensity={0.5} />
    <directionalLight castShadow position={[5, 5, 5]} />
    <Board>
    {/* Add pieces to board */}
        <Coordinates />
        <ScoreBoard />
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
