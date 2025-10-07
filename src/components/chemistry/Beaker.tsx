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
    const wrapperRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (showBubbles && bubblesRef.current) {
            bubblesRef.current.children.forEach((bubble) => {
                bubble.position.y += 0.02;
                if (bubble.position.y > 2) {
                    bubble.position.y = 0.5;
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
    });

    // Determine wrapper color based on liquid presence
    const wrapperColor = liquidLevel > 0.5 ? liquidColor : "#aaaaaa";
    const wrapperOpacity = liquidLevel > 0.5 ? 0.2 : 0.1;

    return (
        <group position={position}>
            {/* Wrapper - Visual indicator of beaker state */}
            <mesh ref={wrapperRef}>
                <cylinderGeometry args={[1.03, 1.03, 3.05, 32]} />
                <meshPhysicalMaterial
                    color={wrapperColor}
                    transparent
                    opacity={wrapperOpacity}
                    roughness={0.2}
                    metalness={0.1}
                    transmission={0.3}
                    thickness={0.02}
                    clearcoat={0.3}
                    clearcoatRoughness={0.3}
                    ior={1.4}
                    specularIntensity={0.3}
                    emissive={liquidLevel > 0.5 ? wrapperColor : "#000000"}
                    emissiveIntensity={liquidLevel > 0.5 ? 0.1 : 0.0}
                />
            </mesh>

            {/* Glass Beaker - Highly transparent with double-sided rendering */}
            <mesh>
                <cylinderGeometry args={[1, 1, 3, 32, 1, true]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.05} // Very transparent
                    roughness={0.0}
                    metalness={0.0}
                    transmission={0.98} // Very high transmission
                    thickness={0.001} // Extremely thin
                    clearcoat={1}
                    clearcoatRoughness={0.0}
                    ior={1.5} // Standard glass index of refraction
                    specularIntensity={0.0}
                    envMapIntensity={0.0}
                    side={THREE.DoubleSide} // Render both sides
                />
            </mesh>

            {/* Liquid - Visible from all sides */}
            <mesh ref={liquidRef} position={[0, -1.5 + liquidLevel, 0]}>
                <cylinderGeometry args={[0.95, 0.95, liquidLevel * 2, 32]} />
                <meshPhysicalMaterial 
                    color={liquidColor} 
                    transparent 
                    opacity={0.9} // Nearly opaque liquid for visibility
                    roughness={0.05}
                    metalness={0.0}
                    clearcoat={0.3}
                    clearcoatRoughness={0.1}
                    side={THREE.DoubleSide} // Render both sides
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

            {/* Base */}
            <mesh position={[0, -1.5, 0]}>
                <cylinderGeometry args={[1, 1, 0.1, 32]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>
        </group>
    );
};