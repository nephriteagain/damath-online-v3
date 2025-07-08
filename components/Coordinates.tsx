import { Text } from "@react-three/drei"

export default function Coordinates({isRotated}:{isRotated: boolean;}) {
    return (
        <group name="coordinates">
            {/* x axis */}
            <group name="coordinate-x">
                <mesh position={[0,  isRotated ? 4.5 :-4.5, 0.5]} name="board">
                    <boxGeometry args={[8, 0.4, 0.2]} />
                    <meshBasicMaterial color={0xffffff} />
                    <group>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[3.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        7
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[ 2.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        6
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[1.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        5
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[0.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        4
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[-0.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        3
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[-1.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        2
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[-2.5, 0, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        1
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
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
                <mesh position={[ isRotated ? 4.5 : -4.5, 0, 0.5]} name="board">
                    <boxGeometry args={[0.4, 8, 0.2]} />
                    <meshBasicMaterial color={0xffffff} />
                    <group>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[0, 3.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        7
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[0, 2.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        6
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[0, 1.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        5
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[0, 0.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        4
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[0, -0.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        3
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[0, -1.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        2
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
                        position={[0, -2.5, 0.1 + 0.06]}
                        fontSize={0.5}
                        color="#000"
                        anchorX="center"
                        anchorY="middle"
                    >
                        1
                    </Text>
                    <Text
                        rotation={[0,0, isRotated ? Math.PI : 0]}
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