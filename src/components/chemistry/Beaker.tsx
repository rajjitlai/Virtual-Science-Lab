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
    const glassRef = useRef<THREE.Mesh>(null);
    const glassBottomRef = useRef<THREE.Mesh>(null);

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

        // Ensure consistent draw order for transparent objects
        if (liquidRef.current) liquidRef.current.renderOrder = 1;
        if (glassBottomRef.current) glassBottomRef.current.renderOrder = 2;
        if (glassRef.current) glassRef.current.renderOrder = 3;
    });

    // Determine wrapper color based on liquid presence
    const wrapperColor = liquidLevel > 0.5 ? liquidColor : "#aaaaaa";
    const wrapperOpacity = 0.03; // keep extremely subtle so glass stays clear

    return (
        <group position={position}>
            {/* Wrapper - Visual indicator of beaker state */}
            <mesh ref={wrapperRef}>
                <cylinderGeometry args={[1.03, 1.03, 3.05, 32]} />
                <meshPhysicalMaterial
                    color={wrapperColor}
                    transparent
                    opacity={wrapperOpacity}
                    roughness={0.1}
                    metalness={0.0}
                    transmission={0.0}
                    thickness={0.0}
                    clearcoat={0.3}
                    clearcoatRoughness={0.3}
                    ior={1.4}
                    specularIntensity={0.3}
                    emissive="#000000"
                    emissiveIntensity={0}
                />
            </mesh>

            {/* Glass Beaker - physical glass with transmission and proper depth settings */}
            <mesh ref={glassRef}>
                <cylinderGeometry args={[1, 1, 3, 64, 1, true]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={1}
                    roughness={0.01}
                    metalness={0.0}
                    transmission={1}
                    thickness={0.02}
                    clearcoat={1}
                    clearcoatRoughness={0.02}
                    ior={1.5}
                    attenuationColor={new THREE.Color('#ffffff')}
                    attenuationDistance={Infinity}
                    specularIntensity={1}
                    envMapIntensity={0.2}
                    side={THREE.FrontSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Glass bottom so empty beaker is clearly visible */}
            <mesh ref={glassBottomRef} position={[0, -1.48, 0]}>
                <cylinderGeometry args={[0.98, 0.98, 0.06, 64]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={1}
                    roughness={0.01}
                    metalness={0.0}
                    transmission={1}
                    thickness={0.06}
                    clearcoat={1}
                    clearcoatRoughness={0.02}
                    ior={1.5}
                    attenuationColor={new THREE.Color('#ffffff')}
                    attenuationDistance={Infinity}
                    specularIntensity={1}
                    envMapIntensity={0.2}
                    side={THREE.FrontSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Liquid - Visible from all sides */}
            <mesh ref={liquidRef} position={[0, -1.5 + liquidLevel, 0]}>
                <cylinderGeometry args={[0.945, 0.945, Math.max(liquidLevel * 2, 0.0001), 64]} />
                <meshPhysicalMaterial
                    color={liquidColor}
                    transparent
                    opacity={1}
                    transmission={0.95}
                    thickness={Math.max(liquidLevel * 0.12, 0.02)}
                    roughness={0.05}
                    metalness={0.0}
                    ior={1.33}
                    clearcoat={0.2}
                    clearcoatRoughness={0.1}
                    side={THREE.DoubleSide}
                    depthWrite={false}
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
        </group>
    );
};