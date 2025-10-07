import { useState, useEffect } from 'react';
import { ChemistryScene } from './ChemistryScene';
import { CHEMICALS, REACTIONS } from '../../types/chemistry';
import type { Chemical, Mixture } from '../../types/chemistry';
import { callGemmaModel } from '../../config/ai-service';
import { useAppwrite } from '../../contexts/AppwriteContext';
import { useToast } from '../../contexts/ToastContext';
import { playBeep, playBubblesSound, playReactionSound, playResetSound } from '../../utils/sound';

export const ChemistryLab = () => {
    const { loadMixtures, saveMixture } = useAppwrite();
    const { showToast } = useToast();
    const [selectedChemicals, setSelectedChemicals] = useState<Chemical[]>([]);
    const [liquidColor, setLiquidColor] = useState('#00aaff');
    const [liquidLevel, setLiquidLevel] = useState(0.5);
    const [showBubbles, setShowBubbles] = useState(false);
    const [reactionMessage, setReactionMessage] = useState('');
    const [customChemicalName, setCustomChemicalName] = useState('');
    const [customChemicalFormula, setCustomChemicalFormula] = useState('');
    const [recentMixtures, setRecentMixtures] = useState<Mixture[]>([]);
    const [isAIProcessing, setIsAIProcessing] = useState(false);

    // Load recent mixtures from Appwrite
    useEffect(() => {
        const loadMixturesData = async () => {
            try {
                const mixtures = await loadMixtures();
                setRecentMixtures(mixtures);
            } catch (error) {
                console.error('Failed to load mixtures from Appwrite:', error);
                showToast('Failed to load saved mixtures', 'error');
            }
        };

        loadMixturesData();
    }, [loadMixtures, showToast]);

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
        
        // Play sound effect
        playBeep(440, 0.1);
    };

    const handleAddCustomChemical = async () => {
        if (!customChemicalName.trim()) return;

        setIsAIProcessing(true);
        
        try {
            // Ask AI to determine properties for the custom chemical
            const prompt = `Based on the name "${customChemicalName}", provide the following information in JSON format:
1. A realistic chemical formula (if applicable)
2. A representative color (hex code)
3. Physical state (solid, liquid, or gas)
4. Approximate pH value (if applicable)

Respond ONLY with JSON in this format:
{
  "formula": "chemical formula or Unknown",
  "color": "#hexcode or #cccccc if unknown",
  "state": "solid|liquid|gas",
  "pH": number or null
}`;

            const result = await callGemmaModel(prompt);
            
            let aiResponse;
            try {
                // Try to parse AI response as JSON
                const responseText = result.generated_text || '{}';
                aiResponse = JSON.parse(responseText);
            } catch (e) {
                // If parsing fails, use default values
                aiResponse = {
                    formula: customChemicalFormula || 'Unknown',
                    color: '#cccccc',
                    state: 'liquid',
                    pH: 7
                };
            }

            // Generate a unique ID for the custom chemical
            const customId = `custom-${Date.now()}`;
            
            const customChemical: Chemical = {
                id: customId,
                name: customChemicalName,
                formula: aiResponse.formula || customChemicalFormula || 'Unknown',
                color: aiResponse.color || '#cccccc',
                state: aiResponse.state || 'liquid',
                pH: aiResponse.pH || 7
            };

            // Add the custom chemical
            handleAddChemical(customChemical);

            // Clear the input fields
            setCustomChemicalName('');
            setCustomChemicalFormula('');
            
            // Show success message
            showToast(`Added custom chemical: ${customChemicalName}`, 'success');
        } catch (error) {
            console.error('Error processing custom chemical with AI:', error);
            
            // Fallback: create with default properties
            const customId = `custom-${Date.now()}`;
            
            const customChemical: Chemical = {
                id: customId,
                name: customChemicalName,
                formula: customChemicalFormula || 'Unknown',
                color: '#cccccc',
                state: 'liquid',
                pH: 7
            };

            handleAddChemical(customChemical);

            // Clear the input fields
            setCustomChemicalName('');
            setCustomChemicalFormula('');
            
            // Show error message
            showToast('Error processing custom chemical. Using default properties.', 'error');
        } finally {
            setIsAIProcessing(false);
        }
    };

    const handleSaveMixture = async () => {
        if (selectedChemicals.length === 0) return;

        const mixtureName = selectedChemicals.map(c => c.name).join(' + ');
        const mixtureColor = selectedChemicals.length > 1 
            ? mixColors(selectedChemicals[0].color, selectedChemicals[selectedChemicals.length - 1].color)
            : selectedChemicals[0].color;

        const newMixture: Mixture = {
            id: `mixture-${Date.now()}`,
            name: mixtureName,
            chemicals: [...selectedChemicals],
            createdAt: new Date(),
            color: mixtureColor
        };

        try {
            // Save mixture using Appwrite
            await saveMixture(newMixture);
            
            // Update local state
            const updatedMixtures = [newMixture, ...recentMixtures].slice(0, 10); // Keep only last 10
            setRecentMixtures(updatedMixtures);
            
            // Play sound and show message
            playBeep(523, 0.2); // Higher pitch for success
            showToast(`Saved mixture: ${mixtureName}`, 'success');
        } catch (error) {
            console.error('Failed to save mixture to Appwrite:', error);
            showToast('Failed to save mixture', 'error');
        }
    };

    const handleLoadMixture = (mixture: Mixture) => {
        setSelectedChemicals(mixture.chemicals);
        
        // Set liquid properties based on mixture
        if (mixture.chemicals.length > 0) {
            setLiquidColor(mixture.color);
            setLiquidLevel(Math.min(0.5 + (mixture.chemicals.length * 0.3), 1.4));
        }
        
        // Show a message
        setReactionMessage(`Loaded mixture: ${mixture.name}`);
        
        // Play sound
        playBeep(392, 0.15);
        showToast(`Loaded mixture: ${mixture.name}`, 'info');
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
                // Play bubbling sound
                playBubblesSound();
            } else {
                // Play reaction sound
                playReactionSound();
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
        
        // Play reset sound
        playResetSound();
        showToast('Beaker reset', 'info');
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

            {/* Custom Chemical Input */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                    Add Custom Chemical
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Chemical Name
                        </label>
                        <input
                            type="text"
                            value={customChemicalName}
                            onChange={(e) => setCustomChemicalName(e.target.value)}
                            placeholder="e.g., Hydrogen Peroxide"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            disabled={isAIProcessing}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Chemical Formula (Optional)
                        </label>
                        <input
                            type="text"
                            value={customChemicalFormula}
                            onChange={(e) => setCustomChemicalFormula(e.target.value)}
                            placeholder="e.g., H₂O₂"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            disabled={isAIProcessing}
                        />
                    </div>
                </div>
                <button
                    onClick={handleAddCustomChemical}
                    disabled={!customChemicalName.trim() || isAIProcessing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {isAIProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing with AI...
                        </>
                    ) : 'Add Custom Chemical'}
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Note: The AI assistant will help determine properties for custom chemicals.
                </p>
            </div>

            {/* Recent Mixtures */}
            {recentMixtures.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            Recent Mixtures
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentMixtures.map((mixture) => (
                            <button
                                key={mixture.id}
                                onClick={() => handleLoadMixture(mixture)}
                                className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 transition-all text-left"
                                style={{ backgroundColor: `${mixture.color}22` }}
                            >
                                <p className="font-bold text-gray-800 dark:text-white">{mixture.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {mixture.createdAt.toLocaleDateString()}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Available Chemicals
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveMixture}
                            disabled={selectedChemicals.length === 0}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Mixture
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                            Reset Beaker
                        </button>
                    </div>
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