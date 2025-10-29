import React, { useState, useEffect } from 'react';
import { ChemistryScene } from './ChemistryScene';
import { ChemicalFormula } from './ChemicalFormula';
import { CHEMICALS, REACTIONS } from '../../types/chemistry';
import type { Chemical, Mixture, ReactionProduct, Reaction } from '../../types/chemistry';
import { callGemmaModel } from '../../config/ai-service';
import { useAppwrite } from '../../contexts/AppwriteContext';
import { useToast } from '../../contexts/ToastContext';
import { useSimulator } from '../../contexts/SimulatorContext';
import { useDemo } from '../../contexts/DemoContext';
import { playBeep, playBubblesSound, playReactionSound, playResetSound } from '../../utils/sound';

interface ChemistryLabProps {
    demoScenario?: any;
}

export const ChemistryLab = ({ demoScenario }: ChemistryLabProps) => {
    const { loadMixtures, saveMixture, incrementExperimentsCount } = useAppwrite();
    const { showToast } = useToast();
    const { pendingChemicals, clearPendingChemicals } = useSimulator();
    const { isDemoRunning, stopDemo, getDemoChemicals } = useDemo();
    const [selectedChemicals, setSelectedChemicals] = useState<Chemical[]>([]);
    const [liquidColor, setLiquidColor] = useState('#00aaff');
    const [liquidLevel, setLiquidLevel] = useState(0.25);
    const [showBubbles, setShowBubbles] = useState(false);
    const [reactionProduct, setReactionProduct] = useState<ReactionProduct | null>(null);
    const [currentReaction, setCurrentReaction] = useState<Reaction | null>(null);
    const [fireIntensity, setFireIntensity] = useState(0);
    const [showRobot, setShowRobot] = useState(true);
    const [customChemicalName, setCustomChemicalName] = useState('');
    const [customChemicalFormula, setCustomChemicalFormula] = useState('');
    const [recentMixtures, setRecentMixtures] = useState<Mixture[]>([]);
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [aiResponse, setAiResponse] = useState<string>('');

    // Handle demo scenarios
    useEffect(() => {
        if (demoScenario && isDemoRunning) {
            const demoChemicals = getDemoChemicals();
            if (demoChemicals.length > 0) {
                // Reset beaker
                setSelectedChemicals([]);
                setLiquidColor('#00aaff');
                setLiquidLevel(0.25);
                setShowBubbles(false);
                setFireIntensity(0);

                // Add chemicals from demo with delay
                const timeouts: NodeJS.Timeout[] = [];
                demoChemicals.forEach((chemical, index) => {
                    const timeout = setTimeout(() => {
                        const newSelection = [...demoChemicals.slice(0, index + 1)];
                        setSelectedChemicals(newSelection);
                        setLiquidLevel(Math.min(0.25 + (newSelection.length * 0.25), 1.0));

                        if (newSelection.length > 1) {
                            const mixedColor = mixColors(newSelection[0].color, chemical.color);
                            setLiquidColor(mixedColor);
                        } else {
                            setLiquidColor(chemical.color);
                        }

                        // Check for reactions
                        checkReaction(newSelection);
                    }, index * 1500);
                    timeouts.push(timeout);
                });

                showToast(`Demo started: ${demoScenario.name}`, 'info');

                // Cleanup timeouts on unmount
                return () => timeouts.forEach(clearTimeout);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [demoScenario]);

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

    // Handle AI-triggered chemicals from simulator context
    useEffect(() => {
        if (pendingChemicals.length > 0) {
            try {
                // Reset state directly
                setSelectedChemicals([]);
                setLiquidColor('#00aaff');
                setLiquidLevel(0.25);
                setShowBubbles(false);
                setReactionProduct(null);
                setCurrentReaction(null);
                setFireIntensity(0);

                // Add chemicals from AI with a small delay for each
                let currentSelection: Chemical[] = [];

                pendingChemicals.forEach((chemical, index) => {
                    setTimeout(() => {
                        try {
                            currentSelection = [...currentSelection, chemical];

                            // Apply chemical effects
                            setSelectedChemicals(currentSelection);
                            setLiquidLevel(Math.min(0.25 + (currentSelection.length * 0.25), 1.0));

                            // Mix colors safely
                            if (currentSelection.length > 1) {
                                const mixedColor = mixColors(currentSelection[0].color, chemical.color);
                                setLiquidColor(mixedColor);
                            } else {
                                setLiquidColor(chemical.color);
                            }

                            // Check for flammable chemicals
                            const flammableChemicals = currentSelection.filter(c => c.flammable);
                            if (flammableChemicals.length > 0) {
                                const flammabilityLevels = flammableChemicals.map(c => c.flammabilityLevel || 0);
                                const maxFlammability = Math.max(...flammabilityLevels);
                                const chemicalCount = flammableChemicals.length;
                                const intensity = Math.min(maxFlammability * (1 + chemicalCount * 0.2), 10);
                                setFireIntensity(intensity);
                            }

                            // Check for reactions
                            checkReaction(currentSelection);

                            // Play sound
                            playBeep(440, 0.1);
                        } catch (error) {
                            console.error('Error processing chemical:', error);
                        }
                    }, index * 800);
                });

                // Show toast
                showToast('Testing reaction in simulator...', 'info');

                // Clear pending chemicals
                clearPendingChemicals();
            } catch (error) {
                console.error('Error handling pending chemicals:', error);
                clearPendingChemicals();
            }
        }
    }, [pendingChemicals, clearPendingChemicals, showToast]);

    const handleAddChemical = (chemical: Chemical) => {
        const newSelection = [...selectedChemicals, chemical];
        setSelectedChemicals(newSelection);

        // Increase liquid level - quarter fill simulation
        setLiquidLevel(Math.min(liquidLevel + 0.25, 1.0));

        // Mix colors
        if (selectedChemicals.length > 0) {
            const mixedColor = mixColors(selectedChemicals[0].color, chemical.color);
            setLiquidColor(mixedColor);
        } else {
            setLiquidColor(chemical.color);
        }

        // Check for flammable chemicals and calculate fire intensity
        const flammableChemicals = newSelection.filter(c => c.flammable);
        if (flammableChemicals.length > 0) {
            const maxFlammability = Math.max(...flammableChemicals.map(c => c.flammabilityLevel || 0));
            const chemicalCount = flammableChemicals.length;
            const intensity = Math.min(maxFlammability * (1 + chemicalCount * 0.2), 10);
            setFireIntensity(intensity);
        } else {
            setFireIntensity(0);
        }

        // Check for reactions
        checkReaction(newSelection);

        // Play sound effect
        playBeep(440, 0.1);

        // Set AI response
        setAiResponse(`Added ${chemical.name} to the mixture. Current liquid level: ${Math.round((liquidLevel + 0.25) * 100)}%`);
    };

    const handleRemoveChemical = (chemicalId: string) => {
        setSelectedChemicals(prev => {
            const updated = prev.filter(c => c.id !== chemicalId);

            // Update liquid color based on remaining chemicals
            if (updated.length === 0) {
                setLiquidColor('#00aaff');
                setLiquidLevel(0.25);
            } else if (updated.length === 1) {
                setLiquidColor(updated[0].color);
            } else {
                const newColor = mixColors(updated[0].color, updated[updated.length - 1].color);
                setLiquidColor(newColor);
            }

            // Check for reactions with remaining chemicals
            checkReaction(updated);

            return updated;
        });

        showToast('Chemical removed', 'info');
    };

    const handleAddCustomChemical = async () => {
        if (!customChemicalName.trim()) return;

        setIsAIProcessing(true);

        try {
            // Set AI response for display
            setAiResponse(`Analyzing chemical: ${customChemicalName}...`);

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

            // Reload mixtures from Appwrite to get the latest data
            const updatedMixtures = await loadMixtures();
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

            // Check for reactions with the loaded chemicals
            checkReaction(mixture.chemicals);
        }

        // Show a message
        showToast(`Loaded mixture: ${mixture.name}`, 'info');

        // Play sound
        playBeep(392, 0.15);
    };

    const checkReaction = (chemicals: Chemical[]) => {
        const chemicalIds = chemicals.map(c => c.id);

        const reaction = REACTIONS.find(r =>
            r.reactants.every(reactant => chemicalIds.includes(reactant))
        );

        if (reaction) {
            setReactionProduct(reaction.product);
            setCurrentReaction(reaction);
            setAiResponse(`🎉 Reaction detected! ${reaction.description} The product is ${reaction.product.name} (${reaction.product.formula})`);

            // Increment experiments count when a reaction occurs
            incrementExperimentsCount().catch(error => {
                console.error('Error incrementing experiments count:', error);
            });

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
        try {
            // Enhanced color mixing with vibrancy
            const hex1 = color1.replace('#', '');
            const hex2 = color2.replace('#', '');

            // Validate hex colors
            if (hex1.length !== 6 || hex2.length !== 6) {
                return '#cccccc'; // Default color if invalid
            }

            const r1 = parseInt(hex1.substring(0, 2), 16);
            const g1 = parseInt(hex1.substring(2, 4), 16);
            const b1 = parseInt(hex1.substring(4, 6), 16);

            const r2 = parseInt(hex2.substring(0, 2), 16);
            const g2 = parseInt(hex2.substring(2, 4), 16);
            const b2 = parseInt(hex2.substring(4, 6), 16);

            // Check for NaN values
            if (isNaN(r1) || isNaN(g1) || isNaN(b1) || isNaN(r2) || isNaN(g2) || isNaN(b2)) {
                return '#cccccc'; // Default color if parsing failed
            }

            // Weighted mixing (60% first color, 40% second color)
            const r = Math.floor(r1 * 0.6 + r2 * 0.4);
            const g = Math.floor(g1 * 0.6 + g2 * 0.4);
            const b = Math.floor(b1 * 0.6 + b2 * 0.4);

            // Enhance vibrancy
            const enhancedR = Math.min(255, Math.floor(r * 1.1));
            const enhancedG = Math.min(255, Math.floor(g * 1.1));
            const enhancedB = Math.min(255, Math.floor(b * 1.1));

            return `#${enhancedR.toString(16).padStart(2, '0')}${enhancedG.toString(16).padStart(2, '0')}${enhancedB.toString(16).padStart(2, '0')}`;
        } catch (error) {
            console.error('Error mixing colors:', error);
            return '#cccccc'; // Default color on error
        }
    };

    const handleReset = () => {
        setSelectedChemicals([]);
        setLiquidColor('#00aaff');
        setLiquidLevel(0.25);
        setShowBubbles(false);
        setReactionProduct(null);
        setCurrentReaction(null);
        setFireIntensity(0);

        // Play reset sound
        playResetSound();
        showToast('Beaker reset', 'info');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            🧪 Virtual Chemistry Lab
                        </h1>
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
                        Experiment with chemicals, observe reactions, and learn chemistry interactively
                    </p>
                    {isDemoRunning && (
                        <div className="flex items-center justify-center gap-2">
                            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-4 py-2 rounded-full">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Demo Mode Active</span>
                            </div>
                            <button
                                onClick={() => {
                                    stopDemo();
                                    handleReset();
                                }}
                                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                            >
                                <span>⏹️</span>
                                <span className="text-sm font-medium">Stop Demo</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Lab Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <span className="text-2xl">🔬</span>
                            Laboratory Workspace
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${showRobot ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                {showRobot ? 'Robot Active' : 'Robot Inactive'}
                            </span>
                        </div>
                    </div>

                    <ChemistryScene
                        liquidColor={liquidColor}
                        liquidLevel={liquidLevel}
                        showBubbles={showBubbles}
                        reactionProduct={reactionProduct}
                        selectedChemicals={selectedChemicals}
                        reaction={currentReaction}
                        fireIntensity={fireIntensity}
                        showRobot={showRobot}
                        aiResponse={aiResponse}
                    />
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
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {mixture.chemicals.map((chem, index) => (
                                            <React.Fragment key={chem.id}>
                                                <ChemicalFormula formula={chem.formula} />
                                                {index < mixture.chemicals.length - 1 && ' + '}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        {mixture.createdAt.toLocaleDateString()}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chemical Selection Section */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3 mb-2">
                                <span className="text-2xl">⚗️</span>
                                Chemical Library
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Click on chemicals to add them to your experiment
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setShowRobot(!showRobot)}
                                className={`${showRobot ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg' : 'bg-gray-400 hover:bg-gray-500'} text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium`}
                            >
                                <span className="text-lg">🤖</span>
                                {showRobot ? 'Robot Active' : 'Activate Robot'}
                            </button>
                            <button
                                onClick={handleSaveMixture}
                                disabled={selectedChemicals.length === 0}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium shadow-lg"
                            >
                                <span className="text-lg">💾</span>
                                Save Mixture
                            </button>
                            <button
                                onClick={handleReset}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-lg"
                            >
                                <span className="text-lg">🔄</span>
                                Reset Lab
                            </button>
                        </div>
                    </div>

                    {/* Selected Chemicals Display */}
                    {selectedChemicals.length > 0 && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-200 dark:border-gray-600">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                <span className="text-lg">🧪</span>
                                Current Mixture ({selectedChemicals.length} chemicals)
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedChemicals.map((chemical) => {
                                    // Function to determine if background is light or dark
                                    const getTextColor = (backgroundColor: string) => {
                                        // Convert hex to RGB
                                        const hex = backgroundColor.replace('#', '');
                                        const r = parseInt(hex.substr(0, 2), 16);
                                        const g = parseInt(hex.substr(2, 2), 16);
                                        const b = parseInt(hex.substr(4, 2), 16);

                                        // Calculate luminance
                                        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

                                        // Return dark text for light backgrounds, light text for dark backgrounds
                                        return luminance > 0.5 ? 'text-gray-900' : 'text-white';
                                    };

                                    const textColor = getTextColor(chemical.color);
                                    const buttonHoverColor = textColor === 'text-gray-900' ? 'hover:bg-gray-800 hover:bg-opacity-20' : 'hover:bg-white hover:bg-opacity-20';

                                    return (
                                        <div
                                            key={chemical.id}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-md ${textColor}`}
                                            style={{ backgroundColor: chemical.color }}
                                        >
                                            <span>{chemical.name}</span>
                                            <button
                                                onClick={() => handleRemoveChemical(chemical.id)}
                                                className={`${buttonHoverColor} rounded-full p-1 transition-colors`}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {CHEMICALS.map((chemical) => {
                            const isSelected = selectedChemicals.some(c => c.id === chemical.id);

                            // Function to determine if background is light or dark
                            const getTextColor = (backgroundColor: string) => {
                                // Convert hex to RGB
                                const hex = backgroundColor.replace('#', '');
                                const r = parseInt(hex.substr(0, 2), 16);
                                const g = parseInt(hex.substr(2, 2), 16);
                                const b = parseInt(hex.substr(4, 2), 16);

                                // Calculate luminance
                                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

                                // Return dark text for light backgrounds, light text for dark backgrounds
                                return luminance > 0.5 ? 'text-gray-900' : 'text-white';
                            };

                            const textColor = isSelected ? getTextColor(chemical.color) : 'text-gray-800 dark:text-white';
                            const secondaryTextColor = isSelected ? (getTextColor(chemical.color) === 'text-gray-900' ? 'text-gray-700' : 'text-gray-200') : 'text-gray-600 dark:text-gray-400';
                            const detailTextColor = isSelected ? (getTextColor(chemical.color) === 'text-gray-900' ? 'text-gray-600' : 'text-gray-300') : 'text-gray-500 dark:text-gray-500';

                            return (
                                <button
                                    key={chemical.id}
                                    onClick={() => handleAddChemical(chemical)}
                                    className={`group p-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${isSelected
                                        ? 'ring-2 ring-indigo-500 shadow-lg scale-105'
                                        : 'border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400'
                                        }`}
                                    style={{
                                        backgroundColor: isSelected ? chemical.color : `${chemical.color}15`,
                                        borderColor: isSelected ? chemical.color : undefined
                                    }}
                                >
                                    <div className="text-center">
                                        <div
                                            className="w-8 h-8 mx-auto mb-2 rounded-full border-2 border-white shadow-md"
                                            style={{ backgroundColor: chemical.color }}
                                        ></div>
                                        <p className={`font-bold text-sm mb-1 ${textColor}`}>
                                            {chemical.name}
                                        </p>
                                        <p className={`text-xs mb-1 ${secondaryTextColor}`}>
                                            <ChemicalFormula formula={chemical.formula} />
                                        </p>
                                        <div className={`flex items-center justify-center gap-2 text-xs ${detailTextColor}`}>
                                            <span className="capitalize">{chemical.state}</span>
                                            <span>•</span>
                                            <span>pH: {chemical.pH}</span>
                                        </div>
                                        {chemical.flammable && (
                                            <div className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                                                ⚠️ Flammable
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};