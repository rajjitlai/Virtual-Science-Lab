import { useState, useEffect } from 'react';
import type { Chemical, Reaction } from '../../types/chemistry';

interface ReactionFlowchartProps {
    selectedChemicals: Chemical[];
    reaction: Reaction | null;
    onClose?: () => void;
}

export const ReactionFlowchart = ({ selectedChemicals, reaction, onClose }: ReactionFlowchartProps) => {
    const [animationProgress, setAnimationProgress] = useState(0);

    useEffect(() => {
        if (reaction) {
            setAnimationProgress(0);
            const interval = setInterval(() => {
                setAnimationProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);

            return () => {
                clearInterval(interval);
            };
        } else {
            setAnimationProgress(0);
        }
    }, [reaction]);

    if (!reaction || selectedChemicals.length === 0) return null;

    const reactantChemicals = selectedChemicals.filter(c =>
        reaction.reactants.includes(c.id)
    );

    return (
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border-2 border-purple-500 dark:border-purple-400 max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span>📊</span>
                    <span>Reaction Process:</span>
                </h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
                        title="Close visualization"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                {/* Reactants */}
                <div className="flex items-center gap-2">
                    {reactantChemicals.map((chemical, idx) => (
                        <div key={chemical.id}>
                            <div
                                className="px-3 py-2 rounded-md text-sm font-medium transition-all"
                                style={{
                                    backgroundColor: `${chemical.color}30`,
                                    borderLeft: `4px solid ${chemical.color}`
                                }}
                            >
                                <div className="font-bold text-gray-800 dark:text-white">{chemical.name}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">{chemical.formula}</div>
                            </div>
                            {idx < reactantChemicals.length - 1 && (
                                <span className="mx-2 text-xl font-bold text-gray-500 dark:text-gray-400">+</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Animated Arrow */}
                <div className="flex items-center relative">
                    <div className="w-16 h-0.5 bg-gray-400 dark:bg-gray-500 relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-100"
                            style={{ width: `${animationProgress}%` }}
                        />
                    </div>
                    <div className="text-xl text-gray-600 dark:text-gray-400">→</div>
                </div>

                {/* Products */}
                <div
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border-2 border-green-400 dark:border-green-600"
                    style={{
                        opacity: animationProgress / 100,
                        transform: `scale(${0.8 + (animationProgress / 100) * 0.2})`
                    }}
                >
                    <div className="font-bold text-gray-800 dark:text-white">{reaction.product.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{reaction.product.formula}</div>
                </div>
            </div>

            {/* Reaction Description */}
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                <p>{reaction.description}</p>
            </div>
        </div>
    );
};
