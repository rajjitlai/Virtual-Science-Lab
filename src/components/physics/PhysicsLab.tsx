import { useState } from 'react';
import { PhysicsEngine } from './PhysicsEngine';

export const PhysicsLab = () => {
    const [gravity, setGravity] = useState(1);
    const [stats, setStats] = useState({ objects: 0, kinetic: 0 });

    const presets = [
        { name: 'Earth', value: 1, icon: '🌍' },
        { name: 'Moon', value: 0.17, icon: '🌙' },
        { name: 'Mars', value: 0.38, icon: '🔴' },
        { name: 'Jupiter', value: 2.5, icon: '🪐' },
        { name: 'Zero G', value: 0, icon: '🚀' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    ⚡ Physics Lab
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Experiment with gravity, collisions, and physics simulations. Add objects and watch them interact!
                </p>

                {/* Gravity Controls */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                        🌍 Gravity Settings
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                Gravity: {gravity.toFixed(2)}g
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="3"
                                step="0.1"
                                value={gravity}
                                onChange={(e) => setGravity(parseFloat(e.target.value))}
                                className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {presets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => setGravity(preset.value)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${Math.abs(gravity - preset.value) < 0.01
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {preset.icon} {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Display */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Objects</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                            {stats.objects}
                        </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Kinetic Energy</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                            {stats.kinetic}
                        </p>
                    </div>
                </div>

                {/* Physics Engine */}
                <PhysicsEngine gravity={gravity} onStatsUpdate={setStats} />
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">
                    📚 How to Use
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Click on balls or boxes to add them to the simulation</li>
                    <li>• Adjust gravity to see how objects fall differently</li>
                    <li>• Try different planet presets (Earth, Moon, Mars, Jupiter)</li>
                    <li>• Watch objects bounce off platforms and walls</li>
                    <li>• Use Pause to freeze the simulation</li>
                    <li>• Click Clear All to remove all objects</li>
                </ul>
            </div>

            {/* Physics Facts */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">
                    🔬 Physics Facts
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-semibold text-gray-800 dark:text-white mb-2">Newton's First Law</p>
                        <p>An object in motion stays in motion unless acted upon by an external force.</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-semibold text-gray-800 dark:text-white mb-2">Conservation of Energy</p>
                        <p>Energy cannot be created or destroyed, only transformed from one form to another.</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-semibold text-gray-800 dark:text-white mb-2">Elastic Collisions</p>
                        <p>Balls bounce back because they transfer kinetic energy during collisions.</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-semibold text-gray-800 dark:text-white mb-2">Terminal Velocity</p>
                        <p>Objects eventually reach a maximum falling speed due to air resistance.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};