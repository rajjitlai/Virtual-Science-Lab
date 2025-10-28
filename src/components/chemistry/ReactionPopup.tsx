import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ErrorBoundary } from '../common/ErrorBoundary';
import type { Chemical, Reaction } from '../../types/chemistry';

interface ReactionPopupProps {
    isOpen: boolean;
    onClose: () => void;
    selectedChemicals: Chemical[];
    reaction: Reaction | null;
}

export const ReactionPopup = ({ isOpen, onClose, selectedChemicals, reaction }: ReactionPopupProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            setProgress((prev) => (prev + 0.02) % 1);
        }, 50);
        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span>🧪</span>
                        <span>Reaction Demo</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="h-[400px] relative">
                    <ErrorBoundary>
                        <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
                            {/* Your 3D visualization content */}
                            <ambientLight intensity={0.6} />
                            <directionalLight position={[5, 5, 5]} intensity={1} />
                            <OrbitControls />
                        </Canvas>
                    </ErrorBoundary>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Demo Progress: {Math.round(progress * 100)}%
                    </div>
                    <Link
                        to="/lab/chemistry"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                        Try in Lab
                    </Link>
                </div>
            </div>
        </div>
    );
};
