import { COLOR } from "@/lib/constants";
import { gameSelector } from "@/store/game/game.store"
import { Text } from "@react-three/drei"

import { authSelector } from "@/store/auth/auth.store";
import { useMemo } from "react";


export default function ScoreBoard({isRotated}:{isRotated: boolean;}) {

    const playerTurnColor = gameSelector.use.playerTurnColor();
    const scores = gameSelector.use.scores();


    const gameId = gameSelector.use.gameId();
    const playerColors = gameSelector.use.playerColors();
    const user = authSelector.use.user();

    const isOnline = useMemo(() => gameId, [gameId])

    const isOnlineUserPlayerTurn = useMemo(() => {
        if (!isOnline) return false
        if (!user) return false
        const isHost = user.uid && playerColors?.host.uid === user.uid;
        const isGuest = user.uid && playerColors?.guest.uid === user.uid;

        if (isHost) {
        const hostTurn = playerTurnColor === playerColors?.host.color
        return hostTurn
        }
        if (isGuest) {
        const guestTurn = playerTurnColor === playerColors?.guest.color
        return guestTurn
        }
        return false
    }, [isOnline, playerColors, user, playerTurnColor])
  


    return (
        <group name="scoreboard">
        <mesh position={[0, isRotated ? -4.5 : 4.5, 0.5]} name="board" rotation={[0, 0, isRotated ? Math.PI : 0]}>
            <boxGeometry args={[8, 1, 0.2]} />
            <meshBasicMaterial color={0xffffff} />
            <group>
                <Text
                    position={[0, 0.25, 0.1 + 0.06]}
                    fontSize={0.2}
                    fontWeight={"bold"}
                    color="#000"
                    anchorX="center"
                    anchorY="middle"
                >
                    SCOREBOARD
                </Text>
                <Text
                    position={[0, -0.05, 0.1 + 0.06]}
                    fontSize={0.3}
                    fontWeight={"bold"}
                    color={playerTurnColor === COLOR.RED ? 0xff0000 : 0x0000ff}
                    anchorX="center"
                    anchorY="middle"
                    >
                        {   isOnline
                            ? isOnlineUserPlayerTurn
                            ? "YOUR TURN"
                            : "OPPONENT'S TURN"
                            : `${playerTurnColor} TURN`
                        }
                </Text>
                <Text
                    position={[-3.2, 0, 0.1 + 0.06]}
                    fontSize={0.4}
                    color={0xff0000}
                    anchorX="center"
                    anchorY="middle"
                >
                    RED :{scores.red}
                </Text>
                <Text
                    position={[3.2, 0, 0.1 + 0.06]}
                    fontSize={0.4}
                    color={0x0000ff}
                    anchorX="center"
                    anchorY="middle"
                >
                    BLUE: {scores.blue}
                </Text>
            </group>
        </mesh>
        </group>
    )
}