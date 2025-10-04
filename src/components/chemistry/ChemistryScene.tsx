import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Beaker } from './Beaker';
import { useState } from 'react';

interface ChemistrySceneProps {
    liquidColor: string;
    liquidLevel: number;
    showBubbles: boolean;
}

export const ChemistryScene = ({ liquidColor, liquidLevel, showBubbles }: ChemistrySceneProps) => {
    return (
        <div className="w-full h-[500px] bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg">
            <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, 5, -5]} intensity={0.5} />

                <Beaker
                    position={[0, 0, 0]}
                    liquidColor={liquidColor}
                    liquidLevel={liquidLevel}
                    showBubbles={showBubbles}
                />

                <OrbitControls enableZoom={true} enablePan={false} />
                <Environment preset="sunset" />

                {/* Ground */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                    <planeGeometry args={[10, 10]} />
                    <meshStandardMaterial color="#e0e0e0" />
                </mesh>
            </Canvas>
        </div>
    );
};