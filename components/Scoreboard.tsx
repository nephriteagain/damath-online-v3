import { COLOR } from "@/lib/constants";
import { gameSelector } from "@/store/game/game.store"
import { Text } from "@react-three/drei"


export default function ScoreBoard() {

    const playerTurnColor = gameSelector.use.playerTurnColor();
    const scores = gameSelector.use.scores();

    return (
        <group name="scoreboard">
        <mesh position={[0, 4.5, 0.5]} name="board">
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
                <mesh>
                <Text
                    position={[0, -0.05, 0.1 + 0.06]}
                    fontSize={0.3}
                    fontWeight={"bold"}
                    color={playerTurnColor === COLOR.RED ? 0xff0000 : 0x0000ff}
                    anchorX="center"
                    anchorY="middle"
                    >
                    {playerTurnColor} TURN
                </Text>
                </mesh>
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