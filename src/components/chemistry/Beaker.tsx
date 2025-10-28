import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Fire } from './Fire';

interface BeakerProps {
    position: [number, number, number];
    liquidColor: string;
    liquidLevel: number;
    showBubbles?: boolean;
    fireIntensity?: number;
}

export const Beaker = ({ position, liquidColor, liquidLevel, showBubbles, fireIntensity = 0 }: BeakerProps) => {
    const liquidRef = useRef<THREE.Mesh>(null);
    const bubblesRef = useRef<THREE.Group>(null);
    const wrapperRef = useRef<THREE.Mesh>(null);
    const glassRef = useRef<THREE.Mesh>(null);
    const glassBottomRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        // Animate bubbles safely
        if (showBubbles && bubblesRef.current && bubblesRef.current.children) {
            bubblesRef.current.children.forEach((bubble) => {
                if (bubble && bubble.position) {
                    bubble.position.y += 0.02;
                    if (bubble.position.y > 2) {
                        bubble.position.y = 0.5;
                    }
                }
            });
        }

        // Animate the wrapper based on liquid level
        if (wrapperRef.current) {
            // Subtle pulsing effect when there's liquid
            if (liquidLevel > 0.5) {
                wrapperRef.current.scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.005;
                wrapperRef.current.scale.z = 1 + Math.sin(Date.now() * 0.005) * 0.005;
            } else {
                wrapperRef.current.scale.set(1, 1, 1);
            }
        }

        // Ensure consistent draw order for transparent objects
        if (liquidRef.current) liquidRef.current.renderOrder = 1;
        if (glassBottomRef.current) glassBottomRef.current.renderOrder = 2;
        if (glassRef.current) glassRef.current.renderOrder = 3;
    });

    // Subtle wrapper animation handled in useFrame above

    return (
        <group position={position}>
            {/* Backdrop Screen */}
            <mesh position={[0, 0, -2]}>
                <planeGeometry args={[4, 3]} />
                <meshStandardMaterial
                    color="#f8fafc"
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Screen Frame */}
            <mesh position={[0, 0, -2.01]}>
                <planeGeometry args={[4.2, 3.2]} />
                <meshStandardMaterial color="#374151" />
            </mesh>

            {/* Simple beaker */}
            <mesh ref={glassRef}>
                <cylinderGeometry args={[1, 1, 3, 16, 1, true]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Liquid */}
            <mesh ref={liquidRef} position={[0, -1.5 + liquidLevel, 0]}>
                <cylinderGeometry args={[0.95, 0.95, Math.max(liquidLevel * 2, 0.01), 16]} />
                <meshStandardMaterial
                    color={liquidColor}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Bubbles */}
            {showBubbles && (
                <group ref={bubblesRef}>
                    {[...Array(10)].map((_, i) => (
                        <mesh key={i} position={[Math.random() * 0.6 - 0.3, Math.random() * 2, Math.random() * 0.6 - 0.3]}>
                            <sphereGeometry args={[0.05 + Math.random() * 0.05, 16, 16]} />
                            <meshPhysicalMaterial
                                color="#ffffff"
                                transparent
                                opacity={0.8}
                                roughness={0.1}
                                metalness={0.0}
                            />
                        </mesh>
                    ))}
                </group>
            )}

            {/* Base/stand below the beaker */}
            <mesh position={[0, -1.55, 0]}>
                <cylinderGeometry args={[1, 1, 0.1, 32]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>

            {/* Fire effect for flammable chemicals */}
            {fireIntensity > 0 && (
                <Fire intensity={fireIntensity} position={[0, -0.5, 0]} />
            )}
        </group>
    );
};