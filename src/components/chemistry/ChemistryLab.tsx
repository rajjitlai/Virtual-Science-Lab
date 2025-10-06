import { useState } from 'react';
import { ChemistryScene } from './ChemistryScene';
import { CHEMICALS, REACTIONS } from '../../types/chemistry';
import type { Chemical } from '../../types/chemistry';

export const ChemistryLab = () => {
    const [selectedChemicals, setSelectedChemicals] = useState<Chemical[]>([]);
    const [liquidColor, setLiquidColor] = useState('#00aaff');
    const [liquidLevel, setLiquidLevel] = useState(0.5);
    const [showBubbles, setShowBubbles] = useState(false);
    const [reactionMessage, setReactionMessage] = useState('');

    const handleAddChemical = (chemical: Chemical) => {
        const newSelection = [...selectedChemicals, chemical];
        setSelectedChemicals(newSelection);

        // Increase liquid level
        setLiquidLevel(Math.min(liquidLevel + 0.3, 1.4));

        // Mix colors
        if (selectedChemicals.length > 0) {
            const mixedColor = mixColors(selectedChemicals[0].color, chemical.color);
            setLiquidColor(mixedColor);
        } else {
            setLiquidColor(chemical.color);
        }

        // Check for reactions
        checkReaction(newSelection);
    };

    const checkReaction = (chemicals: Chemical[]) => {
        const chemicalIds = chemicals.map(c => c.id);

        const reaction = REACTIONS.find(r =>
            r.reactants.every(reactant => chemicalIds.includes(reactant))
        );

        if (reaction) {
            setReactionMessage(reaction.description);
            if (reaction.visualization === 'bubbles') {
                setShowBubbles(true);
                setTimeout(() => setShowBubbles(false), 5000);
            }
        }
    };

    const mixColors = (color1: string, color2: string) => {
        // Simple color mixing (average RGB values)
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');

        const r1 = parseInt(hex1.substring(0, 2), 16);
        const g1 = parseInt(hex1.substring(2, 4), 16);
        const b1 = parseInt(hex1.substring(4, 6), 16);

        const r2 = parseInt(hex2.substring(0, 2), 16);
        const g2 = parseInt(hex2.substring(2, 4), 16);
        const b2 = parseInt(hex2.substring(4, 6), 16);

        const r = Math.floor((r1 + r2) / 2);
        const g = Math.floor((g1 + g2) / 2);
        const b = Math.floor((b1 + b2) / 2);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const handleReset = () => {
        setSelectedChemicals([]);
        setLiquidColor('#00aaff');
        setLiquidLevel(0.5);
        setShowBubbles(false);
        setReactionMessage('');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    🧪 Chemistry Lab
                </h2>

                <ChemistryScene
                    liquidColor={liquidColor}
                    liquidLevel={liquidLevel}
                    showBubbles={showBubbles}
                />

                {reactionMessage && (
                    <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200">
                        <p className="font-semibold">⚗️ Reaction Detected!</p>
                        <p>{reactionMessage}</p>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Available Chemicals
                    </h3>
                    <button
                        onClick={handleReset}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Reset Beaker
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {CHEMICALS.map((chemical) => (
                        <button
                            key={chemical.id}
                            onClick={() => handleAddChemical(chemical)}
                            className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 transition-all"
                            style={{ backgroundColor: `${chemical.color}22` }}
                        >
                            <div className="text-left">
                                <p className="font-bold text-gray-800 dark:text-white">{chemical.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{chemical.formula}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {chemical.state} • pH: {chemical.pH}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {selectedChemicals.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <p className="font-semibold text-gray-800 dark:text-white">Mixed Chemicals:</p>
                        <p className="text-gray-600 dark:text-gray-300">
                            {selectedChemicals.map(c => c.name).join(' + ')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};