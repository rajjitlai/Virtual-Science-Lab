import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChemicalFormula } from './ChemicalFormula';
import type { ReactionProduct } from '../../types/chemistry';
import { ReactionPopup } from './ReactionPopup';
import { useDemo } from '../../contexts/DemoContext';

interface ReactionResultProps {
    product: ReactionProduct | null;
    onVisualize?: () => void;
    selectedChemicals: Chemical[];
    reaction: Reaction | null;
}

export const ReactionResult = ({ product, onVisualize, selectedChemicals, reaction }: ReactionResultProps) => {
    const [showName, setShowName] = useState(false);
    const [showFormula, setShowFormula] = useState(true); // Show formula by default
    const [showDemoPopup, setShowDemoPopup] = useState(false);
    const { startChemistryDemo } = useDemo();

    const handleStartDemo = () => {
        // Create demo scenario
        const demoScenario = {
            name: `${product?.name} Reaction`,
            description: reaction?.description || "Chemical reaction demonstration",
            chemicals: selectedChemicals.map(c => c.name),
            duration: 30000,
            reaction: reaction // Pass the reaction data
        };

        startChemistryDemo(demoScenario);
        if (onVisualize) onVisualize(); // Call visualization handler
    };

    if (!product) return null;

    return (
        <>
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-indigo-500 z-10 min-w-[300px]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">⚗️</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg">Reaction Result</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Chemical product formed</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowName(!showName)}
                            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${showName
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                                }`}
                        >
                            <span className="text-lg">🏷️</span>
                            <span>{showName ? 'Hide Name' : 'Show Name'}</span>
                        </button>
                        <button
                            onClick={() => setShowFormula(!showFormula)}
                            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${showFormula
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                                }`}
                        >
                            <span className="text-lg">🧮</span>
                            <span>{showFormula ? 'Hide Formula' : 'Show Formula'}</span>
                        </button>
                    </div>

                    {/* Restore Visualize Reaction button */}
                    {onVisualize && (
                        <button
                            onClick={onVisualize}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <span className="text-lg">📊</span>
                            <span>Visualize Reaction</span>
                        </button>
                    )}
                </div>

                {(showName || showFormula) && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600">
                        {showName && (
                            <div className="mb-2">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Product Name:</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">{product.name}</p>
                            </div>
                        )}
                        {showFormula && (
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Chemical Formula:</p>
                                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border">
                                    <ChemicalFormula formula={product.formula} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ReactionPopup
                isOpen={showDemoPopup}
                onClose={() => setShowDemoPopup(false)}
                selectedChemicals={selectedChemicals}
                reaction={reaction}
            />
        </>
    );
};