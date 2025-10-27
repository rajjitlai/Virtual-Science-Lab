import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TestTubeProps {
    position: [number, number, number];
    liquidColor?: string;
    liquidLevel?: number;
    isPouring?: boolean;
}

export const TestTube = ({ position, liquidColor = '#00aaff', liquidLevel = 0.3, isPouring = false }: TestTubeProps) => {
    const tubeRef = useRef<THREE.Group>(null);
    const liquidRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (tubeRef.current && isPouring) {
            // Tilt the tube when pouring
            tubeRef.current.rotation.z = Math.sin(Date.now() * 0.01) * 0.3 - 0.5;
        } else if (tubeRef.current) {
            tubeRef.current.rotation.z = 0;
        }
    });

    return (
        <group ref={tubeRef} position={position}>
            {/* Test tube glass */}
            <mesh>
                <cylinderGeometry args={[0.15, 0.12, 0.8, 16]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                    roughness={0.1}
                    metalness={0.0}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Liquid inside */}
            <mesh ref={liquidRef} position={[0, -0.2 + liquidLevel * 0.4, 0]}>
                <cylinderGeometry args={[0.13, 0.1, Math.max(liquidLevel * 0.8, 0.01), 16]} />
                <meshStandardMaterial
                    color={liquidColor}
                    transparent
                    opacity={0.8}
                    roughness={0.1}
                    metalness={0.0}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Test tube bottom */}
            <mesh position={[0, -0.4, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                    roughness={0.1}
                    metalness={0.0}
                />
            </mesh>

            {/* Pouring liquid effect */}
            {isPouring && (
                <group position={[0, -0.1, 0]}>
                    {[...Array(5)].map((_, i) => (
                        <mesh key={i} position={[Math.random() * 0.1 - 0.05, -Math.random() * 0.3, Math.random() * 0.1 - 0.05]}>
                            <sphereGeometry args={[0.02, 8, 8]} />
                            <meshBasicMaterial color={liquidColor} />
                        </mesh>
                    ))}
                </group>
            )}
        </group>
    );
};
