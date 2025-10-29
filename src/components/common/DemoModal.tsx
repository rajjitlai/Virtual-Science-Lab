import { useState } from 'react';

interface DemoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartDemo: (lab: 'chemistry' | 'physics', scenario: any) => void;
}

interface DemoScenario {
    id: string;
    name: string;
    description: string;
    icon: string;
    lab: 'chemistry' | 'physics';
    duration: number;
    data?: any;
}

const CHEMISTRY_DEMOS: DemoScenario[] = [
    {
        id: 'acid-base-reaction',
        name: 'Acid-Base Reaction',
        description: 'Watch vinegar react with baking soda to produce carbon dioxide bubbles',
        icon: '🧪',
        lab: 'chemistry',
        duration: 20000,
        data: {
            name: 'Acid-Base Reaction',
            chemicals: ['Vinegar', 'Baking Soda'],
            description: 'Acidic vinegar reacts with basic baking soda'
        }
    },
    {
        id: 'salt-dissolution',
        name: 'Salt Dissolution',
        description: 'Observe how salt dissolves in water creating a clear solution',
        icon: '💧',
        lab: 'chemistry',
        duration: 15000,
        data: {
            name: 'Salt Dissolution',
            chemicals: ['Water', 'Table Salt'],
            description: 'Salt dissolves in water'
        }
    },
    {
        id: 'flame-demo',
        name: 'Flammable Gas Demo',
        description: 'Explore how flammable gases like ethanol create fire reactions',
        icon: '🔥',
        lab: 'chemistry',
        duration: 18000,
        data: {
            name: 'Flammable Gas Demo',
            chemicals: ['Ethanol'],
            description: 'Demonstrates flammability properties'
        }
    },
    {
        id: 'color-mixing',
        name: 'Color Mixing',
        description: 'See how different colored liquids mix together',
        icon: '🎨',
        lab: 'chemistry',
        duration: 20000,
        data: {
            name: 'Color Mixing',
            chemicals: ['Water', 'Lemon Juice', 'Sugar'],
            description: 'Multiple chemicals mixing colors'
        }
    }
];

const PHYSICS_DEMOS: DemoScenario[] = [
    {
        id: 'gravity-comparison',
        name: 'Gravity Comparison',
        description: 'Compare how objects fall on Moon, Mars, Earth, and Jupiter',
        icon: '🌍',
        lab: 'physics',
        duration: 30000,
        data: {
            name: 'Gravity Comparison',
            gravity: [0.17, 0.38, 1, 2.5]
        }
    },
    {
        id: 'collision-physics',
        name: 'Collision Physics',
        description: 'Observe elastic collisions and momentum conservation',
        icon: '💥',
        lab: 'physics',
        duration: 40000,
        data: {
            name: 'Collision Physics'
        }
    },
    {
        id: 'energy-conservation',
        name: 'Energy Conservation',
        description: 'See how potential energy converts to kinetic energy',
        icon: '⚡',
        lab: 'physics',
        duration: 35000,
        data: {
            name: 'Energy Conservation'
        }
    },
    {
        id: 'zero-gravity',
        name: 'Zero Gravity',
        description: 'Explore how objects behave without gravity',
        icon: '🚀',
        lab: 'physics',
        duration: 25000,
        data: {
            name: 'Zero Gravity',
            gravity: [0]
        }
    }
];

export const DemoModal = ({ isOpen, onClose, onStartDemo }: DemoModalProps) => {
    const [activeTab, setActiveTab] = useState<'chemistry' | 'physics'>('chemistry');

    if (!isOpen) return null;

    const demos = activeTab === 'chemistry' ? CHEMISTRY_DEMOS : PHYSICS_DEMOS;

    const handleStartDemo = (scenario: DemoScenario) => {
        onStartDemo(scenario.lab, scenario.data);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <span className="text-3xl">🎬</span>
                            <span>Interactive Demos</span>
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('chemistry')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'chemistry'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            🧪 Chemistry Demos
                        </button>
                        <button
                            onClick={() => setActiveTab('physics')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'physics'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            ⚡ Physics Demos
                        </button>
                    </div>
                </div>

                {/* Demo List */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {demos.map((demo) => (
                            <div
                                key={demo.id}
                                className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:border-indigo-500 transition-all cursor-pointer group"
                                onClick={() => handleStartDemo(demo)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">{demo.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                            {demo.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                            {demo.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                            <span>⏱️ {demo.duration / 1000}s</span>
                                            <span>•</span>
                                            <span className="uppercase">{demo.lab}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click on any demo to start it in the lab
                    </p>
                </div>
            </div>
        </div>
    );
};

