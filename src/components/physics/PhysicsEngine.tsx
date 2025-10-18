import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, useBox, useSphere, usePlane } from '@react-three/cannon';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { PHYSICS_OBJECTS } from '../../types/physics';
import type { PhysicsObject } from '../../types/physics';

interface PhysicsEngineProps {
    gravity: number;
    onStatsUpdate: (stats: { objects: number; kinetic: number }) => void;
}

// 3D Physics Objects
const PhysicsBall = ({ position, color, size, mass, restitution }: { position: [number, number, number], color: string, size: number, mass: number, restitution: number }) => {
    const [ref, api] = useSphere(() => ({
        mass,
        position,
        args: [size],
        material: { restitution },
    }));

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

const PhysicsBox = ({ position, color, size, mass, restitution }: { position: [number, number, number], color: string, size: number, mass: number, restitution: number }) => {
    const [ref, api] = useBox(() => ({
        mass,
        position,
        args: [size, size, size],
        material: { restitution },
    }));

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

const Ground = () => {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, -2, 0],
        type: 'Static',
    }));

    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#e8e8e8" />
        </mesh>
    );
};

const Platform = ({ position, size }: { position: [number, number, number], size: [number, number, number] }) => {
    const [ref] = useBox(() => ({
        position,
        args: size,
        type: 'Static',
    }));

    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial color="#6c5ce7" />
        </mesh>
    );
};

export const PhysicsEngine = ({ gravity, onStatsUpdate }: PhysicsEngineProps) => {
    const [objects, setObjects] = useState<Array<PhysicsObject & { id: string, position: [number, number, number] }>>([]);
    const [isRunning, setIsRunning] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Add initial ball
        const initialBall: PhysicsObject & { id: string, position: [number, number, number] } = {
            id: 'initial-ball',
            type: 'ball',
            color: '#ff6b6b',
            size: 1, // Radius for 3D sphere
            mass: 1,
            restitution: 0.7,
            position: [0, 5, 0]
        };
        setObjects([initialBall]);
        setIsInitialized(true);
    }, []);

    const addObject = (obj: PhysicsObject) => {
        const newObj = {
            ...obj,
            id: `${obj.type}-${Date.now()}`,
            size: obj.size / 40, // Convert from 2D size to 3D radius
            position: [
                (Math.random() - 0.5) * 4,
                5 + Math.random() * 2,
                (Math.random() - 0.5) * 4
            ] as [number, number, number]
        };
        setObjects(prev => [...prev, newObj]);
        console.log(`Added ${obj.type} with color ${obj.color} and size ${newObj.size}`);
    };

    const clearObjects = () => {
        setObjects([]);
    };

    const togglePause = () => {
        setIsRunning(!isRunning);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4 justify-center">
                <button
                    onClick={togglePause}
                    disabled={!isInitialized}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold"
                >
                    {isRunning ? '⏸️ Pause' : '▶️ Play'}
                </button>
                <button
                    onClick={clearObjects}
                    disabled={!isInitialized}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold"
                >
                    🗑️ Clear All
                </button>
            </div>

            <div className="flex justify-center">
                <div className="relative w-full h-[600px] bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg">
                    {!isInitialized ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">Loading Physics Engine...</p>
                            </div>
                        </div>
                    ) : (
                        <Canvas camera={{ position: [8, 8, 8], fov: 50 }} shadows>
                            <ambientLight intensity={0.6} />
                            <directionalLight
                                position={[10, 10, 5]}
                                intensity={1}
                                castShadow
                                shadow-mapSize={[2048, 2048]}
                                shadow-camera-far={50}
                                shadow-camera-left={-10}
                                shadow-camera-right={10}
                                shadow-camera-top={10}
                                shadow-camera-bottom={-10}
                            />
                            <pointLight position={[-10, 10, -10]} intensity={0.3} />

                            <Physics
                                gravity={[0, -gravity * 9.81, 0]}
                                paused={!isRunning}
                                defaultContactMaterial={{ restitution: 0.3 }}
                            >
                                <Ground />
                                <Platform position={[-3, 0, 0]} size={[2, 0.5, 2]} />
                                <Platform position={[3, 1, 0]} size={[2, 0.5, 2]} />

                                {objects.map((obj) => (
                                    obj.type === 'ball' ? (
                                        <PhysicsBall
                                            key={obj.id}
                                            position={obj.position}
                                            color={obj.color}
                                            size={obj.size}
                                            mass={obj.mass || 1}
                                            restitution={obj.restitution || 0.7}
                                        />
                                    ) : (
                                        <PhysicsBox
                                            key={obj.id}
                                            position={obj.position}
                                            color={obj.color}
                                            size={obj.size}
                                            mass={obj.mass || 1}
                                            restitution={obj.restitution || 0.3}
                                        />
                                    )
                                ))}
                            </Physics>

                            <OrbitControls
                                enableZoom={true}
                                enablePan={true}
                                minDistance={5}
                                maxDistance={20}
                            />
                            <Environment preset="sunset" />
                        </Canvas>
                    )}

                    {isInitialized && !isRunning && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">Simulation Paused</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {PHYSICS_OBJECTS.map((obj) => (
                    <button
                        key={obj.id}
                        onClick={() => addObject(obj)}
                        disabled={!isInitialized}
                        className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={`${obj.type === 'ball' ? 'rounded-full' : 'rounded-md'}`}
                                style={{
                                    width: `${obj.size / 2}px`,
                                    height: `${obj.size / 2}px`,
                                    backgroundColor: obj.color,
                                }}
                            />
                            <div className="text-center">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    {obj.type === 'ball' ? '⚽' : '📦'} {obj.type}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Mass: {obj.mass}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};