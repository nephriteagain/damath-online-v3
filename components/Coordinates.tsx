import { Text } from "@react-three/drei"

export default function Coordinates() {
    return (
        <group name="coordinates">
            {/* x axis */}
            <group name="coordinate-x">
                <mesh position={[0, -4.5, 0.5]} name="board">
                    <boxGeometry args={[8, 0.4, 0.2]} />
                    <meshBasicMaterial color={0xffffff} />
                    <group>
                    <Text
                        position={[3.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        7
                    </Text>
                    <Text
                        position={[ 2.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        6
                    </Text>
                    <Text
                        position={[1.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        5
                    </Text>
                    <Text
                        position={[0.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        4
                    </Text>
                    <Text
                        position={[-0.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        3
                    </Text>
                    <Text
                        position={[-1.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        2
                    </Text>
                    <Text
                        position={[-2.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        1
                    </Text>
                    <Text
                        position={[-3.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        0
                    </Text>
                    </group>
                </mesh>
            </group>
            {/* y axis */}
            <group name="coordinate-y">
                <mesh position={[-4.5, 0, 0.5]} name="board">
                    <boxGeometry args={[0.4, 8, 0.2]} />
                    <meshBasicMaterial color={0xffffff} />
                    <group>
                    <Text
                        position={[0, 3.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        7
                    </Text>
                    <Text
                        position={[0, 2.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        6
                    </Text>
                    <Text
                        position={[0, 1.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        5
                    </Text>
                    <Text
                        position={[0, 0.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        4
                    </Text>
                    <Text
                        position={[0, -0.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        3
                    </Text>
                    <Text
                        position={[0, -1.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        2
                    </Text>
                    <Text
                        position={[0, -2.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        1
                    </Text>
                    <Text
                        position={[0, -3.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        0
                    </Text>
                    </group>
                </mesh>
            </group>
        </group>
    )
}