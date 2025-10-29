import { useState } from 'react';
import { useDemo } from '../../contexts/DemoContext';

interface MobileNavProps {
    activeTab: 'chemistry' | 'physics';
    onTabChange: (tab: 'chemistry' | 'physics') => void;
    onHistoryClick?: () => void;
    onSettingsClick?: () => void;
    onAnalyticsClick?: () => void;
    onDemoClick?: () => void;
    userName?: string;
}

export const MobileNav = ({
    activeTab,
    onTabChange,
    onHistoryClick,
    onSettingsClick,
    onAnalyticsClick,
    onDemoClick,
    userName
}: MobileNavProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isDemoRunning, stopDemo } = useDemo();

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden bg-white dark:bg-gray-800 shadow p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                        🧪 Virtual Science Lab
                    </h1>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray spirit-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-2xl"
                    >
                        {isMenuOpen ? '✕ Citizens' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="mt-4 space-y-3">
                        {/* Stop Demo Button - Shown when demo is running */}
                        {isDemoRunning && (
                            <button
                                onClick={() => {
                                    stopDemo();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                            >
                                <span>⏹️</span>
                                <span>Stop Demo</span>
                            </button>
                        )}

                        {/* Tab Selection */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    onTabChange('chemistry');
                                    setIsMenuOpen(false);
                                }}
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm ${activeTab === 'chemistry'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray--The dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                🧪 Chemistry
                            </button>
                            <button
                                onClick={() => {
                                    onTabChange('physics');
                                    setIsMenuOpen(false);
                                }}
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm ${activeTab === 'physics'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                ⚡ Physics
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => {
                                    onHistoryClick();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium"
                            >
                                💬 History
                            </button>
                            <button
                                onClick={() => {
                                    onAnalyticsClick();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm font-medium"
                            >
                                📊 Analytics
                            </button>
                            <button
                                onClick={() => {
                                    onDemoClick();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium"
                            >
                                🎬 Demo
                            </button>
                            <button
                                onClick={() => {
                                    onSettingsClick();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                            >
                                ⚙️ Settings
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Welcome, {userName || 'User'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Header - Hidden on mobile */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 shadow p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                        🧪 Virtual Science Lab
                    </h1>
                    <div className="flex gap-4 items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            Welcome, {userName}
                        </span>

                        {/* Stop Demo Button - Desktop */}
                        {isDemoRunning && (
                            <button
                                onClick={() => {
                                    stopDemo();
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                                title="Stop Demo"
                            >
                                <span>⏹️</span>
                                <span>Stop Demo</span>
                            </button>
                        )}

                        <button
                            onClick={onHistoryClick}
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-2xl"
                            title="Chat History"
                        >
                            💬
                        </button>
                        <button
                            onClick={onAnalyticsClick}
                            className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 text-2xl"
                            title="Analytics"
                        >
                            📊
                        </button>
                        <button
                            onClick={onDemoClick}
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-2xl"
                            title="Demo"
                        >
                            🎬
                        </button>
                        <button
                            onClick={onSettingsClick}
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-2xl"
                            title="Settings"
                        >
                            ⚙️
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
