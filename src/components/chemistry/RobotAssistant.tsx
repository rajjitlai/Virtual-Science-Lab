import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TestTube } from './TestTube';
import type { RobotAction } from '../../types/chemistry';

interface RobotAssistantProps {
    position?: [number, number, number];
    isActive?: boolean;
    action?: RobotAction;
    chemicalToPour?: string;
    liquidColor?: string;
}

export const RobotAssistant = ({
    position = [4, -0.5, 3], // Moved further from beaker
    isActive = true,
    action = 'idle',
    chemicalToPour,
    liquidColor = '#00aaff'
}: RobotAssistantProps) => {
    const robotGroupRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Mesh>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const [time, setTime] = useState(0);

    useFrame((_, delta) => {
        if (!robotGroupRef.current) return;
        setTime((prev) => prev + delta);

        // Head animation based on action
        if (headRef.current && headRef.current.rotation && headRef.current.position) {
            switch (action) {
                case 'observing':
                    headRef.current.rotation.y = Math.sin(time * 0.5) * 0.3;
                    headRef.current.rotation.x = Math.sin(time * 0.7) * 0.1;
                    break;
                case 'celebrating':
                    headRef.current.rotation.z = Math.sin(time * 8) * 0.2;
                    break;
                case 'reacting':
                    headRef.current.position.y = 0.8 + Math.sin(time * 10) * 0.05;
                    break;
                default:
                    // Idle: gentle head bobbing
                    headRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
                    headRef.current.position.y = 0.8 + Math.sin(time * 2) * 0.02;
            }
        }

        // Arm animations
        if (leftArmRef.current && rightArmRef.current &&
            leftArmRef.current.rotation && rightArmRef.current.rotation) {
            switch (action) {
                case 'pouring':
                    leftArmRef.current.rotation.z = -Math.PI / 4;
                    rightArmRef.current.rotation.z = Math.PI / 4;
                    rightArmRef.current.rotation.x = Math.sin(time * 2) * 0.3 - 0.5;
                    break;
                case 'celebrating':
                    leftArmRef.current.rotation.z = Math.sin(time * 4) * 0.5 - 0.5;
                    rightArmRef.current.rotation.z = Math.sin(time * 4) * 0.5 + 0.5;
                    break;
                case 'reacting':
                    // Step back gesture
                    leftArmRef.current.rotation.x = -0.3;
                    rightArmRef.current.rotation.x = -0.3;
                    break;
                case 'running':
                    // Running arm swing
                    leftArmRef.current.rotation.z = Math.sin(time * 8) * 0.5 - 0.3;
                    rightArmRef.current.rotation.z = Math.sin(time * 8 + Math.PI) * 0.5 + 0.3;
                    break;
                case 'walking':
                    // Walking arm swing
                    leftArmRef.current.rotation.z = Math.sin(time * 6) * 0.3 - 0.3;
                    rightArmRef.current.rotation.z = Math.sin(time * 6 + Math.PI) * 0.3 + 0.3;
                    break;
                default:
                    // Idle: arms at sides with gentle sway
                    leftArmRef.current.rotation.z = Math.sin(time * 1.5) * 0.1 - 0.3;
                    rightArmRef.current.rotation.z = Math.sin(time * 1.5) * 0.1 + 0.3;
            }
        }

        // Whole robot animation for different actions
        if (robotGroupRef.current.position) {
            let newX = position[0];
            let newZ = position[2];
            let newY = position[1];

            switch (action) {
                case 'reacting':
                    newZ = position[2] + Math.max(0, Math.sin(time * 3) * 0.3);
                    newX = position[0];
                    break;
                case 'running':
                    // Running in a figure-8 pattern away from beaker
                    const radius = 4;
                    const speed = 0.3;
                    const angle = time * speed;
                    // Create figure-8 pattern with offset to avoid beaker area (0,0,0)
                    const figure8X = Math.sin(angle) * radius;
                    const figure8Z = Math.sin(angle * 2) * (radius * 0.5);
                    // Offset the pattern to keep robot away from beaker
                    newX = position[0] + figure8X + 2; // Move further from beaker
                    newZ = position[2] + figure8Z + 3; // Move further from beaker
                    newY = position[1] + Math.sin(time * 8) * 0.15;
                    // Face the direction of movement
                    robotGroupRef.current.rotation.y = angle + Math.PI / 2;
                    break;
                case 'walking':
                    // Walking in a rectangular pattern away from beaker
                    const walkWidth = 3;
                    const walkLength = 2;
                    const walkSpeed = 0.15;
                    const walkAngle = time * walkSpeed;
                    // Create rectangular walking pattern
                    const rectX = Math.cos(walkAngle) * walkWidth;
                    const rectZ = Math.sin(walkAngle) * walkLength;
                    // Offset to avoid beaker area
                    newX = position[0] + rectX + 2.5; // Keep away from beaker
                    newZ = position[2] + rectZ + 2.5; // Keep away from beaker
                    newY = position[1] + Math.sin(time * 6) * 0.1;
                    // Face the direction of movement
                    robotGroupRef.current.rotation.y = walkAngle + Math.PI / 2;
                    break;
                default:
                    newX = position[0];
                    newZ = position[2];
                    newY = position[1];
            }

            // Safety check: ensure robot never gets too close to beaker (within 2 units of 0,0,0)
            const distanceFromBeaker = Math.sqrt(newX * newX + newZ * newZ);
            const minDistance = 2.5; // Minimum distance from beaker

            if (distanceFromBeaker < minDistance) {
                // Push robot away from beaker
                const angle = Math.atan2(newZ, newX);
                newX = Math.cos(angle) * minDistance;
                newZ = Math.sin(angle) * minDistance;
            }

            robotGroupRef.current.position.x = newX;
            robotGroupRef.current.position.z = newZ;
            robotGroupRef.current.position.y = newY;
        }
    });

    if (!isActive) return null;

    return (
        <group ref={robotGroupRef} position={position}>
            {/* Simple robot body */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.8, 1.2, 0.4]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>

            {/* Robot head */}
            <group ref={headRef} position={[0, 0.8, 0]}>
                <mesh>
                    <boxGeometry args={[0.6, 0.6, 0.4]} />
                    <meshStandardMaterial color="#dddddd" />
                </mesh>

                {/* Eyes */}
                <mesh position={[-0.15, 0.1, 0.21]}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color="#00ff00" />
                </mesh>
                <mesh position={[0.15, 0.1, 0.21]}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color="#00ff00" />
                </mesh>
            </group>

            {/* Left arm */}
            <group ref={leftArmRef} position={[-0.6, 0.2, 0]}>
                <mesh position={[0, -0.3, 0]}>
                    <boxGeometry args={[0.2, 0.6, 0.2]} />
                    <meshStandardMaterial color="#cccccc" />
                </mesh>
            </group>

            {/* Right arm */}
            <group ref={rightArmRef} position={[0.6, 0.2, 0]}>
                <mesh position={[0, -0.3, 0]}>
                    <boxGeometry args={[0.2, 0.6, 0.2]} />
                    <meshStandardMaterial color="#cccccc" />
                </mesh>

                {/* Test Tube in hand */}
                {chemicalToPour && (
                    <TestTube
                        position={[0.1, -0.5, 0]}
                        liquidColor={liquidColor}
                        liquidLevel={0.6}
                        isPouring={action === 'pouring'}
                    />
                )}
            </group>

            {/* Legs */}
            <mesh position={[-0.2, -0.8, 0]}>
                <boxGeometry args={[0.2, 0.4, 0.2]} />
                <meshStandardMaterial color="#aaaaaa" />
            </mesh>
            <mesh position={[0.2, -0.8, 0]}>
                <boxGeometry args={[0.2, 0.4, 0.2]} />
                <meshStandardMaterial color="#aaaaaa" />
            </mesh>
        </group>
    );
};
