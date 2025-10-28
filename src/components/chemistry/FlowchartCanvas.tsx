import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ErrorBoundary } from '../common/ErrorBoundary';
import type { Chemical, Reaction } from '../../types/chemistry';

interface FlowchartCanvasProps {
    selectedChemicals: Chemical[];
    reaction: Reaction | null;
    onClose: () => void;
}

interface AnimatedNodeProps {
    position: [number, number, number];
    chemical: Chemical;
    delay: number;
    isActive: boolean;
}

const AnimatedNode = ({ position, chemical, delay, isActive }: AnimatedNodeProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [time, setTime] = useState(0);

    useFrame((_, delta) => {
        setTime(prev => prev + delta);

        if (meshRef.current) {
            // Floating animation
            meshRef.current.position.y = position[1] + Math.sin(time * 2 + delay) * 0.1;

            // Rotation animation
            meshRef.current.rotation.y = time * 0.5;

            // Scale animation when active
            if (isActive) {
                const scale = 1 + Math.sin(time * 4) * 0.1;
                meshRef.current.scale.setScalar(scale);
            } else {
                meshRef.current.scale.setScalar(1);
            }
        }
    });

    return (
        <group position={position}>
            {/* Chemical sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial
                    color={chemical.color}
                    metalness={0.3}
                    roughness={0.4}
                />
            </mesh>

            {/* Glow effect */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.35, 16, 16]} />
                <meshBasicMaterial
                    color={chemical.color}
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Chemical name */}
            <Text
                position={[0, -0.6, 0]}
                fontSize={0.15}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                {chemical.name}
            </Text>

            {/* Chemical name only - no formula */}
        </group>
    );
};

interface AnimatedArrowProps {
    start: [number, number, number];
    end: [number, number, number];
    progress: number;
    color: string;
}

const AnimatedArrow = ({ start, end, progress, color }: AnimatedArrowProps) => {
    const arrowRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (arrowRef.current) {
            // Calculate current position based on progress
            const currentX = start[0] + (end[0] - start[0]) * progress;
            const currentY = start[1] + (end[1] - start[1]) * progress;
            const currentZ = start[2] + (end[2] - start[2]) * progress;

            arrowRef.current.position.set(currentX, currentY, currentZ);

            // Rotate arrow to point in direction of movement
            const direction = new THREE.Vector3(
                end[0] - start[0],
                end[1] - start[1],
                end[2] - start[2]
            ).normalize();

            arrowRef.current.lookAt(
                currentX + direction.x,
                currentY + direction.y,
                currentZ + direction.z
            );
        }
    });

    return (
        <group ref={arrowRef}>
            {/* Arrow shaft */}
            <mesh>
                <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Arrow head */}
            <mesh position={[0, 0, 0.25]}>
                <coneGeometry args={[0.08, 0.2, 8]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Plus symbol in the middle of arrow */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.15, 0.03, 0.03]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.03, 0.15, 0.03]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Glow trail */}
            <mesh position={[0, 0, -0.25]}>
                <cylinderGeometry args={[0.05, 0.01, 0.5, 8]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </group>
    );
};

interface ProductNodeProps {
    position: [number, number, number];
    product: { name: string; formula: string };
    progress: number;
}

const ProductNode = ({ position, product, progress }: ProductNodeProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [time, setTime] = useState(0);

    useFrame((_, delta) => {
        setTime(prev => prev + delta);

        if (meshRef.current) {
            // Floating animation
            meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1;

            // Rotation animation
            meshRef.current.rotation.y = time * 0.5;

            // Scale animation based on progress
            const scale = 0.5 + progress * 0.5;
            meshRef.current.scale.setScalar(scale);
        }
    });

    return (
        <group position={position}>
            {/* Product sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial
                    color="#4ade80"
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>

            {/* Glow effect */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.45, 16, 16]} />
                <meshBasicMaterial
                    color="#4ade80"
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Product name */}
            <Text
                position={[0, -0.7, 0]}
                fontSize={0.12}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                {product.name}
            </Text>

            {/* Product name only - no formula */}
        </group>
    );
};

export const FlowchartCanvas = ({ selectedChemicals, reaction, onClose }: FlowchartCanvasProps) => {
    const [animationProgress, setAnimationProgress] = useState(0);
    const [currentPhase, setCurrentPhase] = useState<'reactants' | 'reaction' | 'products'>('reactants');

    useEffect(() => {
        if (!reaction) return;

        setAnimationProgress(0);
        setCurrentPhase('reactants');

        const interval = setInterval(() => {
            setAnimationProgress((prev) => {
                const newProgress = (prev + 0.02) % 1; // Loop continuously

                // Phase transitions
                if (newProgress < 0.3) {
                    setCurrentPhase('reactants');
                } else if (newProgress < 0.7) {
                    setCurrentPhase('reaction');
                } else {
                    setCurrentPhase('products');
                }

                return newProgress;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [reaction]);

    if (!reaction) {
        return (
            <div className="w-full h-[500px] bg-gradient-to-b from-gray-900 to-black rounded-lg relative flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-300 text-lg">No reaction to visualize</p>
                    <button
                        onClick={onClose}
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const reactantChemicals = selectedChemicals.filter(c =>
        reaction.reactants.includes(c.id)
    );

    // Calculate positions
    const reactantPositions: [number, number, number][] = reactantChemicals.map((_, index) => {
        const angle = (index / reactantChemicals.length) * Math.PI * 2;
        const radius = 2;
        return [
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        ];
    });

    const productPosition: [number, number, number] = [0, 0, 3];
    const centerPosition: [number, number, number] = [0, 0, 0];

    return (
        <div className="w-full h-[500px] bg-gradient-to-b from-gray-900 to-black rounded-lg relative">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
                <span>✕</span>
                <span>Close Visualization</span>
            </button>

            {/* Title */}
            <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span>🧪</span>
                    <span>Chemical Reaction Visualization</span>
                </h3>
            </div>

            <ErrorBoundary>
                <Canvas
                    camera={{ position: [5, 3, 5], fov: 50 }}
                    gl={{
                        antialias: false,
                        alpha: false,
                        powerPreference: "high-performance"
                    }}
                    onCreated={({ gl }) => {
                        gl.setClearColor('#1a1a1a');
                    }}
                >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <pointLight position={[-5, 5, -5]} intensity={0.5} />

                    {/* Laboratory Backdrop */}
                    <group>
                        {/* Back Wall */}
                        <mesh position={[0, 2, -8]}>
                            <planeGeometry args={[16, 8]} />
                            <meshStandardMaterial color="#2d3748" />
                        </mesh>

                        {/* Left Wall */}
                        <mesh position={[-8, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                            <planeGeometry args={[16, 8]} />
                            <meshStandardMaterial color="#4a5568" />
                        </mesh>

                        {/* Right Wall */}
                        <mesh position={[8, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                            <planeGeometry args={[16, 8]} />
                            <meshStandardMaterial color="#4a5568" />
                        </mesh>

                        {/* Floor */}
                        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[16, 16]} />
                            <meshStandardMaterial color="#1a202c" />
                        </mesh>

                        {/* Ceiling */}
                        <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[16, 16]} />
                            <meshStandardMaterial color="#1a202c" />
                        </mesh>

                        {/* Laboratory Equipment */}
                        <group position={[-4, -1, -6]}>
                            {/* Lab Table */}
                            <mesh position={[0, 0.5, 0]}>
                                <boxGeometry args={[3, 1, 1.5]} />
                                <meshStandardMaterial color="#4a5568" />
                            </mesh>

                            {/* Test Tube Rack */}
                            <mesh position={[0, 1.2, 0]}>
                                <boxGeometry args={[2, 0.2, 0.8]} />
                                <meshStandardMaterial color="#2d3748" />
                            </mesh>

                            {/* Test Tubes */}
                            {Array.from({ length: 6 }, (_, i) => (
                                <mesh key={i} position={[-0.8 + (i * 0.3), 1.5, 0]}>
                                    <cylinderGeometry args={[0.05, 0.05, 0.6]} />
                                    <meshStandardMaterial color="#e2e8f0" />
                                </mesh>
                            ))}
                        </group>

                        {/* Lab Equipment on Right */}
                        <group position={[4, -1, -6]}>
                            {/* Microscope */}
                            <mesh position={[0, 0.3, 0]}>
                                <boxGeometry args={[0.8, 0.6, 0.6]} />
                                <meshStandardMaterial color="#2d3748" />
                            </mesh>

                            {/* Microscope Base */}
                            <mesh position={[0, 0.1, 0]}>
                                <cylinderGeometry args={[0.4, 0.4, 0.2]} />
                                <meshStandardMaterial color="#4a5568" />
                            </mesh>
                        </group>

                        {/* Periodic Table Poster */}
                        <mesh position={[-6, 3, -7.9]}>
                            <planeGeometry args={[2, 3]} />
                            <meshStandardMaterial color="#f7fafc" />
                        </mesh>

                        {/* Safety Equipment */}
                        <group position={[6, 1, -7.9]}>
                            {/* Fire Extinguisher */}
                            <mesh position={[0, 0.5, 0]}>
                                <cylinderGeometry args={[0.2, 0.2, 1]} />
                                <meshStandardMaterial color="#dc2626" />
                            </mesh>

                            {/* Safety Goggles */}
                            <mesh position={[0, 1.2, 0]}>
                                <boxGeometry args={[0.3, 0.1, 0.1]} />
                                <meshStandardMaterial color="#fbbf24" />
                            </mesh>
                        </group>
                    </group>

                    <Suspense fallback={null}>
                        {/* Reactant nodes */}
                        {reactantPositions.map((position, index) => (
                            <AnimatedNode
                                key={index}
                                position={position}
                                chemical={reactantChemicals[index]}
                                delay={index * 0.5}
                                isActive={currentPhase === 'reactants'}
                            />
                        ))}

                        {/* Plus symbols between reactants */}
                        {reactantPositions.map((position, index) => {
                            if (index === 0) return null;
                            const prevPosition = reactantPositions[index - 1];
                            const midX = (position[0] + prevPosition[0]) / 2;
                            const midY = (position[1] + prevPosition[1]) / 2;
                            const midZ = (position[2] + prevPosition[2]) / 2;

                            return (
                                <mesh key={`plus-${index}`} position={[midX, midY, midZ]}>
                                    <boxGeometry args={[0.1, 0.02, 0.02]} />
                                    <meshStandardMaterial color="#3b82f6" />
                                </mesh>
                            );
                        })}

                        {/* Reaction arrows */}
                        {reactantPositions.map((position, index) => {
                            const arrowProgress = Math.max(0, Math.min(1, (animationProgress - 0.2) * 2));
                            return (
                                <AnimatedArrow
                                    key={`arrow-${index}`}
                                    start={position}
                                    end={centerPosition}
                                    progress={arrowProgress}
                                    color="#3b82f6"
                                />
                            );
                        })}

                        {/* Center reaction node */}
                        <mesh position={centerPosition}>
                            <sphereGeometry args={[0.2, 16, 16]} />
                            <meshStandardMaterial
                                color="#f59e0b"
                                metalness={0.7}
                                roughness={0.3}
                            />
                        </mesh>

                        {/* Product arrow */}
                        <AnimatedArrow
                            start={centerPosition}
                            end={productPosition}
                            progress={Math.max(0, Math.min(1, (animationProgress - 0.5) * 2))}
                            color="#10b981"
                        />

                        {/* Product node */}
                        <ProductNode
                            position={productPosition}
                            product={reaction.product}
                            progress={Math.max(0, Math.min(1, (animationProgress - 0.7) * 3))}
                        />

                        {/* Environment */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
                            <planeGeometry args={[20, 20]} />
                            <meshStandardMaterial color="#e0e7ff" />
                        </mesh>
                    </Suspense>

                    <OrbitControls enableZoom={true} enablePan={true} />
                </Canvas>
            </ErrorBoundary>

            {/* Progress indicator */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Reaction Progress
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {Math.round(animationProgress * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-100"
                            style={{ width: `${animationProgress * 100}%` }}
                        />
                    </div>
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        Phase: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
                    </div>
                </div>
            </div>
        </div>
    );
};
