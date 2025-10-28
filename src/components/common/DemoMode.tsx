import { useState, useEffect } from 'react';
// import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';

interface DemoModeProps {
    isOpen: boolean;
    onClose: () => void;
    onStartDemo: (demoType: 'chemistry' | 'physics', scenario?: any) => void;
}

const DEMO_SCENARIOS = {
    chemistry: [
        {
            name: "Acid-Base Reaction",
            description: "Mix vinegar and baking soda to see a classic acid-base reaction",
            chemicals: ["Vinegar", "Baking Soda"],
            duration: 30000
        },
        {
            name: "Colorful Chemistry",
            description: "Create a rainbow of colors by mixing different chemicals",
            chemicals: ["Water", "Lemon Juice", "Sugar", "Table Salt"],
            duration: 45000
        },
        {
            name: "Flammable Demo",
            description: "Demonstrate the properties of flammable substances",
            chemicals: ["Ethanol", "Methane"],
            duration: 25000
        }
    ],
    physics: [
        {
            name: "Gravity Comparison",
            description: "Compare how objects fall on different planets",
            gravity: [0.17, 0.38, 1, 2.5],
            duration: 30000
        },
        {
            name: "Collision Physics",
            description: "Watch objects bounce and interact with different materials",
            objects: ["ball-small", "ball-medium", "box-small", "box-medium"],
            duration: 40000
        },
        {
            name: "Energy Conservation",
            description: "Observe how energy transforms between kinetic and potential",
            objects: ["ball-large", "box-large"],
            duration: 35000
        }
    ]
};

export const DemoMode = ({ isOpen, onClose, onStartDemo }: DemoModeProps) => {
    // settings currently unused but kept for potential future enhancements
    const { showToast } = useToast();
    const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1000) {
                        setIsRunning(false);
                        showToast('Demo completed!', 'success');
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, timeRemaining, showToast]);

    const startDemo = (demoType: 'chemistry' | 'physics', scenario: any) => {
        setSelectedDemo(`${demoType}-${scenario.name}`);
        setIsRunning(true);
        setTimeRemaining(scenario.duration);
        onStartDemo(demoType, scenario);
        showToast(`Starting ${scenario.name} demo...`, 'info');
    };

    const stopDemo = () => {
        setIsRunning(false);
        setTimeRemaining(0);
        setSelectedDemo(null);
        showToast('Demo stopped', 'info');
    };

    const formatTime = (ms: number) => {
        const seconds = Math.ceil(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                🎬 Demo Mode
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Perfect for presentations and demonstrations
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {isRunning && (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {formatTime(timeRemaining)} remaining
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {isRunning ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎬</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                Demo in Progress
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {selectedDemo?.replace('-', ' ')} is running
                            </p>
                            <button
                                onClick={stopDemo}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
                            >
                                Stop Demo
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Chemistry Demos */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🧪</span>
                                    Chemistry Demos
                                </h3>
                                <div className="space-y-3">
                                    {DEMO_SCENARIOS.chemistry.map((scenario, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-400 transition-colors"
                                        >
                                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                                {scenario.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {scenario.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                                    Duration: {scenario.duration / 1000}s
                                                </div>
                                                <button
                                                    onClick={() => startDemo('chemistry', scenario)}
                                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                                >
                                                    Start Demo
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Physics Demos */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="text-2xl">⚡</span>
                                    Physics Demos
                                </h3>
                                <div className="space-y-3">
                                    {DEMO_SCENARIOS.physics.map((scenario, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-400 transition-colors"
                                        >
                                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                                {scenario.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {scenario.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                                    Duration: {scenario.duration / 1000}s
                                                </div>
                                                <button
                                                    onClick={() => startDemo('physics', scenario)}
                                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                                >
                                                    Start Demo
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            💡 <strong>Tip:</strong> Use demo mode for presentations and showcasing features
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
