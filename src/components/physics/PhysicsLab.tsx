import { useState, useEffect } from 'react';
import { PhysicsEngine } from './PhysicsEngine';
import { useToast } from '../../contexts/ToastContext';
import { useDemo } from '../../contexts/DemoContext';

interface PhysicsLabProps {
    demoScenario?: any;
}

export const PhysicsLab = ({ demoScenario }: PhysicsLabProps) => {
    const { showToast } = useToast();
    const { isDemoRunning } = useDemo();
    const [gravity, setGravity] = useState(1);
    const [stats, setStats] = useState({ objects: 0, kinetic: 0, potential: 0, total: 0 });
    const [selectedPreset, setSelectedPreset] = useState('Earth');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [airResistance, setAirResistance] = useState(0.1);
    const [friction, setFriction] = useState(0.3);
    const [demoObjects, setDemoObjects] = useState<any[]>([]);

    const presets = [
        { name: 'Earth', value: 1, icon: '🌍', description: 'Standard Earth gravity', color: 'bg-blue-500' },
        { name: 'Moon', value: 0.17, icon: '🌙', description: 'Low gravity like the Moon', color: 'bg-gray-400' },
        { name: 'Mars', value: 0.38, icon: '🔴', description: 'Mars-like gravity', color: 'bg-red-500' },
        { name: 'Jupiter', value: 2.5, icon: '🪐', description: 'High gravity like Jupiter', color: 'bg-orange-500' },
        { name: 'Zero G', value: 0, icon: '🚀', description: 'Zero gravity environment', color: 'bg-purple-500' },
        { name: 'Custom', value: gravity, icon: '⚙️', description: 'Custom gravity setting', color: 'bg-indigo-500' },
    ];

    // Handle demo scenarios
    useEffect(() => {
        if (demoScenario) {
            // Reset physics environment
            setDemoObjects([]);

            if (demoScenario.name === "Gravity Comparison") {
                // Cycle through different gravity values
                const gravityValues = demoScenario.gravity || [0.17, 0.38, 1, 2.5];
                let currentIndex = 0;

                const gravityInterval = setInterval(() => {
                    setGravity(gravityValues[currentIndex]);
                    setSelectedPreset(['Moon', 'Mars', 'Earth', 'Jupiter'][currentIndex] || 'Custom');

                    // Add some objects to demonstrate gravity
                    const newObjects = Array.from({ length: 3 }, (_, i) => ({
                        id: `demo-${Date.now()}-${i}`,
                        type: 'ball-small',
                        position: [Math.random() * 4 - 2, 8, Math.random() * 4 - 2],
                        mass: 1,
                        color: '#ff6b6b'
                    }));
                    setDemoObjects(prev => [...prev, ...newObjects]);

                    currentIndex = (currentIndex + 1) % gravityValues.length;
                }, 3000);

                // Clear objects after 2 seconds
                setTimeout(() => {
                    clearInterval(gravityInterval);
                    setTimeout(() => setDemoObjects([]), 2000);
                }, demoScenario.duration || 30000);

            } else if (demoScenario.name === "Collision Physics") {
                // Add objects for collision demo
                const collisionObjects = [
                    { id: 'demo-collision-1', type: 'ball-medium', position: [-3, 2, 0], mass: 2, color: '#4ecdc4' },
                    { id: 'demo-collision-2', type: 'box-small', position: [3, 2, 0], mass: 1.5, color: '#45b7d1' },
                    { id: 'demo-collision-3', type: 'ball-large', position: [0, 5, 0], mass: 3, color: '#f9ca24' }
                ];
                setDemoObjects(collisionObjects);

                setTimeout(() => setDemoObjects([]), demoScenario.duration || 40000);

            } else if (demoScenario.name === "Energy Conservation") {
                // Demonstrate energy conservation with pendulum-like motion
                setGravity(1);
                setSelectedPreset('Earth');

                const energyObjects = [
                    { id: 'demo-energy-1', type: 'ball-large', position: [0, 8, 0], mass: 2, color: '#6c5ce7' },
                    { id: 'demo-energy-2', type: 'box-large', position: [2, 6, 0], mass: 3, color: '#a29bfe' }
                ];
                setDemoObjects(energyObjects);

                setTimeout(() => setDemoObjects([]), demoScenario.duration || 35000);
            }
        }
    }, [demoScenario]);

    // Update kinetic energy calculation
    useEffect(() => {
        const potential = stats.objects * gravity * 9.81 * 5; // Approximate potential energy
        const total = stats.kinetic + potential;
        setStats(prev => ({ ...prev, potential, total }));
    }, [stats.objects, stats.kinetic, gravity]);

    const handlePresetChange = (preset: typeof presets[0]) => {
        setGravity(preset.value);
        setSelectedPreset(preset.name);
        showToast(`Gravity set to ${preset.name} (${preset.value}g)`, 'info');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <img
                            src="/logo.png"
                            alt="Virtual Science Lab Logo"
                            className="w-12 h-12 object-contain"
                        />
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            ⚡ Virtual Physics Lab
                        </h1>
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-300">
                        Explore gravity, motion, and physics through interactive 3D simulations
                    </p>
                    {isDemoRunning && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Demo Mode Active</span>
                        </div>
                    )}
                </div>

                {/* Main Lab Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="Lab Logo"
                                className="w-8 h-8 object-contain"
                            />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="text-2xl">🔬</span>
                                Physics Laboratory
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                                Simulation Active
                            </span>
                        </div>
                    </div>

                    {/* Gravity Controls */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4 rounded-lg mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="text-xl">🌍</span>
                                Gravity Settings
                            </h3>
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors"
                            >
                                {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Gravity Slider */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Gravity Strength
                                    </label>
                                    <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                                        {gravity.toFixed(2)}g
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="0"
                                        max="3"
                                        step="0.1"
                                        value={gravity}
                                        onChange={(e) => {
                                            setGravity(parseFloat(e.target.value));
                                            setSelectedPreset('Custom');
                                        }}
                                        className="w-full h-2 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>0g</span>
                                        <span>1.5g</span>
                                        <span>3g</span>
                                    </div>
                                </div>
                            </div>

                            {/* Preset Buttons */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {presets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => handlePresetChange(preset)}
                                        className={`p-3 rounded-lg font-medium transition-all duration-200 ${selectedPreset === preset.name
                                            ? `${preset.color} text-white shadow-md`
                                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{preset.icon}</span>
                                            <span className="font-semibold text-sm">{preset.name}</span>
                                        </div>
                                        <p className="text-xs opacity-80">{preset.description}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Advanced Settings */}
                            {showAdvanced && (
                                <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Advanced Physics</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Air Resistance: {airResistance.toFixed(2)}
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={airResistance}
                                                onChange={(e) => setAirResistance(parseFloat(e.target.value))}
                                                className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Friction: {friction.toFixed(2)}
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={friction}
                                                onChange={(e) => setFriction(parseFloat(e.target.value))}
                                                className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Real-time Stats Display */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-500 rounded-md">
                                    <span className="text-white text-sm">📦</span>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Objects</p>
                                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                        {stats.objects}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-green-500 rounded-md">
                                    <span className="text-white text-sm">⚡</span>
                                </div>
                                <div>
                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Kinetic</p>
                                    <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                        {stats.kinetic.toFixed(1)}J
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-purple-500 rounded-md">
                                    <span className="text-white text-sm">🏔️</span>
                                </div>
                                <div>
                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Potential</p>
                                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                        {stats.potential.toFixed(1)}J
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-orange-500 rounded-md">
                                    <span className="text-white text-sm">⚖️</span>
                                </div>
                                <div>
                                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Total</p>
                                    <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                                        {stats.total.toFixed(1)}J
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Physics Engine */}
                    <PhysicsEngine
                        gravity={gravity}
                        onStatsUpdate={setStats}
                        demoObjects={demoObjects}
                    />
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    How to Use the Physics Lab
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <h4 className="text-base font-semibold text-gray-800 dark:text-white mb-2">Basic Controls</h4>
                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 text-sm">🎯</span>
                                <span className="text-sm">Click on object buttons to add them to the simulation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 text-sm">🌍</span>
                                <span className="text-sm">Adjust gravity using the slider or preset buttons</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 text-sm">⏸️</span>
                                <span className="text-sm">Use Pause/Play to control the simulation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 text-sm">🗑️</span>
                                <span className="text-sm">Click Clear All to remove all objects</span>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-base font-semibold text-gray-800 dark:text-white mb-2">Advanced Features</h4>
                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 text-sm">⚙️</span>
                                <span className="text-sm">Enable advanced settings for air resistance and friction</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 text-sm">📊</span>
                                <span className="text-sm">Monitor real-time energy calculations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 text-sm">🔄</span>
                                <span className="text-sm">Try different planet environments</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 text-sm">🎮</span>
                                <span className="text-sm">Use mouse to rotate and zoom the 3D view</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Physics Facts */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">🔬</span>
                    Physics Concepts
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">⚖️</span>
                            <h4 className="text-base font-bold text-blue-800 dark:text-blue-200">Newton's First Law</h4>
                        </div>
                        <p className="text-blue-700 dark:text-blue-300 text-xs">
                            An object in motion stays in motion unless acted upon by an external force.
                            This is why objects continue moving until gravity or friction stops them.
                        </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">⚡</span>
                            <h4 className="text-base font-bold text-green-800 dark:text-green-200">Conservation of Energy</h4>
                        </div>
                        <p className="text-green-700 dark:text-green-300 text-xs">
                            Energy cannot be created or destroyed, only transformed from one form to another.
                            Watch how potential energy converts to kinetic energy as objects fall.
                        </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🏀</span>
                            <h4 className="text-base font-bold text-purple-800 dark:text-purple-200">Elastic Collisions</h4>
                        </div>
                        <p className="text-purple-700 dark:text-purple-300 text-xs">
                            Balls bounce back because they transfer kinetic energy during collisions.
                            The restitution value determines how bouncy objects are.
                        </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg border border-orange-200 dark:border-orange-700">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🌪️</span>
                            <h4 className="text-base font-bold text-orange-800 dark:text-orange-200">Terminal Velocity</h4>
                        </div>
                        <p className="text-orange-700 dark:text-orange-300 text-xs">
                            Objects eventually reach a maximum falling speed due to air resistance.
                            Try adjusting the air resistance setting to see the effect.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};