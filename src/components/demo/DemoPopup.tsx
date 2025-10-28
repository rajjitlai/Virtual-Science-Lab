import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Beaker } from '../chemistry/Beaker';
import { RobotAssistant } from '../chemistry/RobotAssistant';

interface DemoPopupProps {
    isOpen: boolean;
    onClose: () => void;
    demoType: 'chemistry' | 'physics';
    onOpenInLab?: () => void; // new optional callback to start demo in main lab
}

export const DemoPopup = ({ isOpen, onClose, demoType, onOpenInLab }: DemoPopupProps) => {
    const [demoStep, setDemoStep] = useState(0);
    const [liquidColor, setLiquidColor] = useState('#00aaff');
    const [liquidLevel, setLiquidLevel] = useState(0.25);

    useEffect(() => {
        if (!isOpen) return;

        // Simple demo animation sequence
        const interval = setInterval(() => {
            setDemoStep(prev => {
                const next = prev + 1;
                if (next > 3) return 0;

                // Update liquid properties based on step
                switch (next) {
                    case 1:
                        setLiquidColor('#ffeeaa');
                        setLiquidLevel(0.5);
                        break;
                    case 2:
                        setLiquidColor('#ff6b6b');
                        setLiquidLevel(0.75);
                        break;
                    case 3:
                        setLiquidColor('#4ade80');
                        setLiquidLevel(1);
                        break;
                    default:
                        setLiquidColor('#00aaff');
                        setLiquidLevel(0.25);
                }
                return next;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span>{demoType === 'chemistry' ? '🧪' : '⚡'}</span>
                        <span>Quick Demo</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="h-[400px] relative">
                    <Canvas
                        camera={{ position: [3, 2, 4], fov: 50 }}
                    >
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[5, 5, 5]} intensity={1} />

                        <Beaker
                            position={[0, 0, 0]}
                            liquidColor={liquidColor}
                            liquidLevel={liquidLevel}
                            showBubbles={demoStep === 2}
                        />

                        <RobotAssistant
                            position={[2, -0.5, 2]}
                            isActive={true}
                            action={demoStep === 1 ? 'pouring' : 'observing'}
                        />

                        <OrbitControls enableZoom={false} />
                    </Canvas>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Demo Step {demoStep + 1} of 4
                    </div>

                    {/* If caller provided onOpenInLab, call it; otherwise fallback to a Link */}
                    {onOpenInLab ? (
                        <button
                            onClick={() => onOpenInLab()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                        >
                            <span>🔬</span>
                            <span>Try it in the Lab</span>
                        </button>
                    ) : (
                        <Link
                            to={`/lab/${demoType}`}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                        >
                            <span>🔬</span>
                            <span>Try it in the Lab</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};
