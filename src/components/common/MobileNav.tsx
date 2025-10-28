import { useState } from 'react';

interface MobileNavProps {
    activeTab: 'chemistry' | 'physics';
    onTabChange: (tab: 'chemistry' | 'physics') => void;
    onDemoClick: () => void;
    onHistoryClick: () => void;
    onSettingsClick: () => void;
    onAnalyticsClick: () => void;
    userName?: string;
}

export const MobileNav = ({
    activeTab,
    onTabChange,
    onDemoClick,
    onHistoryClick,
    onSettingsClick,
    onAnalyticsClick,
    userName
}: MobileNavProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-2xl"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="mt-4 space-y-3">
                        {/* Tab Selection */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    onTabChange('chemistry');
                                    setIsMenuOpen(false);
                                }}
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm ${activeTab === 'chemistry'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                                    onDemoClick();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium"
                            >
                                🎬 Demo
                            </button>
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
                        <button
                            onClick={onDemoClick}
                            className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-2xl"
                            title="Demo Mode"
                        >
                            🎬
                        </button>
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