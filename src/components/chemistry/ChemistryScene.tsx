import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { Beaker } from './Beaker';
import { FireBeaker } from './FireBeaker';
import { ReactionResult } from './ReactionResult';
import { FlowchartCanvas } from './FlowchartCanvas';
import { SplineRobot } from './SplineRobot';
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
                                <Environment preset="sunset" />
                            </Suspense>

                            <OrbitControls enableZoom={true} enablePan={true} />

                            {/* Ground */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
                                <planeGeometry args={[20, 20]} />
                                <meshStandardMaterial color="#2d3748" />
                            </mesh>
                        </Canvas>
                    </ErrorBoundary>
                </>
            )}

            {/* Spline Robot Section */}
            {showRobot && (
                <div className="mt-6">
                    <ErrorBoundary>
                        <SplineRobot
                            isActive={showRobot}
                            action={robotAction}
                            aiResponse={aiResponse}
                            className="w-full"
                        />
                    </ErrorBoundary>
                </div>
            )}
        </div>
    );
};