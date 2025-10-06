import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BeakerProps {
    position: [number, number, number];
    liquidColor: string;
    liquidLevel: number;
    showBubbles?: boolean;
}

export const Beaker = ({ position, liquidColor, liquidLevel, showBubbles }: BeakerProps) => {
    const liquidRef = useRef<THREE.Mesh>(null);
    const bubblesRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (showBubbles && bubblesRef.current) {
            bubblesRef.current.children.forEach((bubble) => {
                bubble.position.y += 0.02;
                if (bubble.position.y > 2) {
                    bubble.position.y = 0.5;
                }
            });
        }
    });

    return (
        <group position={position}>
            {/* Glass Beaker */}
            <mesh>
                <cylinderGeometry args={[1, 1, 3, 32, 1, true]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                    roughness={0.1}
                    metalness={0.1}
                    transmission={0.9}
                    thickness={0.5}
                />
            </mesh>

            {/* Liquid */}
            <mesh ref={liquidRef} position={[0, -1.5 + liquidLevel, 0]}>
                <cylinderGeometry args={[0.95, 0.95, liquidLevel * 2, 32]} />
                <meshStandardMaterial color={liquidColor} transparent opacity={0.7} />
            </mesh>

            {/* Bubbles */}
            {showBubbles && (
                <group ref={bubblesRef}>
                    {[...Array(10)].map((_, i) => (
                        <mesh key={i} position={[Math.random() * 0.6 - 0.3, Math.random() * 2, Math.random() * 0.6 - 0.3]}>
                            <sphereGeometry args={[0.05 + Math.random() * 0.05, 16, 16]} />
                            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
                        </mesh>
                    ))}
                </group>
            )}

            {/* Base */}
            <mesh position={[0, -1.5, 0]}>
                <cylinderGeometry args={[1, 1, 0.1, 32]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>
        </group>
    );
};