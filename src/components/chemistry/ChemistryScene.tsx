import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { Beaker } from './Beaker';
import { FireBeaker } from './FireBeaker';
import { ReactionResult } from './ReactionResult';
import { FlowchartCanvas } from './FlowchartCanvas';
import { RobotAssistant } from './RobotAssistant';
import type { ReactionProduct, Chemical, Reaction, RobotAction } from '../../types/chemistry';

interface ChemistrySceneProps {
    liquidColor: string;
    liquidLevel: number;
    showBubbles: boolean;
    reactionProduct: ReactionProduct | null;
    selectedChemicals: Chemical[];
    reaction: Reaction | null;
    fireIntensity: number;
    showRobot: boolean;
    aiResponse?: string;
}

export const ChemistryScene = ({ liquidColor, liquidLevel, showBubbles, reactionProduct, selectedChemicals, reaction, fireIntensity, showRobot, aiResponse }: ChemistrySceneProps) => {
    const [robotAction, setRobotAction] = useState<RobotAction>('idle');
    const [showFlowchart, setShowFlowchart] = useState(false);

    // Check if we should show fire instead of beaker
    const hasFlammableChemicals = selectedChemicals.some(c => c.flammable);
    const flammableChemical = selectedChemicals.find(c => c.flammable);

    // Update robot action based on lab state
    useEffect(() => {
        if (fireIntensity > 5) {
            // Fire detected - robot reacts
            setRobotAction('reacting');
        } else if (reaction) {
            // Reaction happening - robot celebrates
            setRobotAction('celebrating');
            setTimeout(() => setRobotAction('observing'), 3000);
        } else if (selectedChemicals.length > 0) {
            // Chemicals being added - robot observes
            setRobotAction('observing');

            // If flammable chemical, robot prepares to pour
            if (hasFlammableChemicals && flammableChemical) {
                setRobotAction('pouring');
            }
        } else {
            // Nothing happening - idle
            setRobotAction('idle');
        }
    }, [fireIntensity, reaction, selectedChemicals.length, hasFlammableChemicals, flammableChemical]);

    // Make robot run around periodically
    useEffect(() => {
        if (!showRobot) return;

        const runInterval = setInterval(() => {
            setRobotAction('running');
            setTimeout(() => setRobotAction('walking'), 3000);
            setTimeout(() => setRobotAction('idle'), 6000);
        }, 10000); // Start running every 10 seconds

        return () => clearInterval(runInterval);
    }, [showRobot]);

    const handleVisualize = () => {
        setShowFlowchart(true);
        // Auto-hide after 10 seconds
        setTimeout(() => {
            setShowFlowchart(false);
        }, 10000);
    };

    return (
        <div className="w-full h-[500px] bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg relative">
            {showFlowchart ? (
                <FlowchartCanvas
                    selectedChemicals={selectedChemicals}
                    reaction={reaction}
                    onClose={() => setShowFlowchart(false)}
                />
            ) : (
                <>
                    <ErrorBoundary>
                        <ReactionResult product={reactionProduct} onVisualize={handleVisualize} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Canvas
                            camera={{ position: [3, 2, 4], fov: 50 }}
                            gl={{
                                antialias: false,
                                alpha: false,
                                powerPreference: "high-performance",
                                failIfMajorPerformanceCaveat: false
                            }}
                            onCreated={({ gl }) => {
                                gl.setClearColor('#1a1a1a');
                                gl.shadowMap.enabled = false;
                            }}
                        >
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[5, 5, 5]} intensity={1} />
                            <pointLight position={[-5, 5, -5]} intensity={0.5} />

                            <Suspense fallback={null}>
                                <ErrorBoundary>
                                    {hasFlammableChemicals && fireIntensity > 0 ? (
                                        <FireBeaker
                                            position={[0, 0, 0]}
                                            intensity={fireIntensity}
                                            chemicalName={flammableChemical?.name}
                                        />
                                    ) : (
                                        <Beaker
                                            position={[0, 0, 0]}
                                            liquidColor={liquidColor}
                                            liquidLevel={liquidLevel}
                                            showBubbles={showBubbles}
                                            fireIntensity={fireIntensity}
                                        />
                                    )}
                                </ErrorBoundary>

                                {/* Robot Assistant inside the 3D scene */}
                                {showRobot && (
                                    <ErrorBoundary>
                                        <RobotAssistant
                                            position={[4, -0.5, 3]}
                                            isActive={showRobot}
                                            action={robotAction}
                                            chemicalToPour={selectedChemicals.length > 0 ? selectedChemicals[selectedChemicals.length - 1]?.name : undefined}
                                            liquidColor={liquidColor}
                                        />
                                    </ErrorBoundary>
                                )}

                                <Environment preset="sunset" />
                            </Suspense>

                            <OrbitControls enableZoom={true} enablePan={true} />

                            {/* Ground */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
                                <planeGeometry args={[20, 20]} />
                                <meshStandardMaterial color="#2d3748" />
                            </mesh>

                            {/* Backdrop - Laboratory Environment */}
                            <group>
                                {/* Back Wall */}
                                <mesh position={[0, 2, -8]}>
                                    <planeGeometry args={[16, 8]} />
                                    <meshStandardMaterial color="#1a202c" />
                                </mesh>

                                {/* Left Wall */}
                                <mesh position={[-8, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                                    <planeGeometry args={[16, 8]} />
                                    <meshStandardMaterial color="#2d3748" />
                                </mesh>

                                {/* Right Wall */}
                                <mesh position={[8, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                                    <planeGeometry args={[16, 8]} />
                                    <meshStandardMaterial color="#2d3748" />
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
                        </Canvas>
                    </ErrorBoundary>

                    {/* AI Response Overlay */}
                    {aiResponse && (
                        <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🤖</span>
                                <span className="font-semibold text-gray-800 dark:text-white">Robot Assistant</span>
                                <div className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${robotAction === 'idle' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                                    robotAction === 'pouring' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                        robotAction === 'observing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                            robotAction === 'reacting' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                robotAction === 'celebrating' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    robotAction === 'running' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                        robotAction === 'walking' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                    }`}>
                                    <span className="mr-1">
                                        {robotAction === 'idle' ? '😴' :
                                            robotAction === 'pouring' ? '🥤' :
                                                robotAction === 'observing' ? '👀' :
                                                    robotAction === 'reacting' ? '⚡' :
                                                        robotAction === 'celebrating' ? '🎉' :
                                                            robotAction === 'running' ? '🏃' :
                                                                robotAction === 'walking' ? '🚶' : '🤖'}
                                    </span>
                                    <span className="capitalize">{robotAction}</span>
                                </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{aiResponse}</p>
                        </div>
                    )}
                </>
            )}

        </div>
    );
};