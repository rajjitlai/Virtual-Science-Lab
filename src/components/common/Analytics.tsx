import { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useAppwrite } from '../../contexts/AppwriteContext';
import type { UserAnalytics } from '../../types/settings';

interface AnalyticsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Analytics = ({ isOpen, onClose }: AnalyticsProps) => {
    const { settings } = useSettings();
    const { getUserAnalytics } = useAppwrite();
    const [analytics, setAnalytics] = useState<UserAnalytics>({
        experimentsRun: 0,
        aiQuestionsAsked: 0,
        timeSpent: 0,
        favoriteLab: 'chemistry',
        lastActivity: new Date().toISOString(),
        chemistryMastery: 0,
        physicsMastery: 0
    });

    useEffect(() => {
        // Load analytics from Appwrite or localStorage
        const loadAnalytics = async () => {
            try {
                const data = await getUserAnalytics();
                if (data) {
                    setAnalytics(data);
                }
            } catch (error) {
                console.error('Error loading analytics:', error);
            }
        };

        loadAnalytics();
    }, [getUserAnalytics]);

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            📊 Analytics Dashboard
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Usage Stats */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                                Usage Statistics
                            </h3>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Experiments Run</p>
                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                            {analytics.experimentsRun}
                                        </p>
                                    </div>
                                    <div className="text-4xl">🧪</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">AI Questions Asked</p>
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {analytics.aiQuestionsAsked}
                                        </p>
                                    </div>
                                    <div className="text-4xl">🤖</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                            {formatTime(analytics.timeSpent)}
                                        </p>
                                    </div>
                                    <div className="text-4xl">⏱️</div>
                                </div>
                            </div>
                        </div>

                        {/* Lab Preferences */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                                Lab Preferences
                            </h3>

                            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Favorite Lab</p>
                                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {analytics.favoriteLab === 'chemistry' ? '🧪 Chemistry' : '⚡ Physics'}
                                        </p>
                                    </div>
                                    <div className="text-4xl">
                                        {analytics.favoriteLab === 'chemistry' ? '🧪' : '⚡'}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                    Current Settings
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Theme:</span>
                                        <span className="text-gray-800 dark:text-white capitalize">
                                            {settings.theme}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Notifications:</span>
                                        <span className="text-gray-800 dark:text-white">
                                            {settings.notifications ? '✅' : '❌'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Sound Effects:</span>
                                        <span className="text-gray-800 dark:text-white">
                                            {settings.soundEffects ? '✅' : '❌'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Auto-save:</span>
                                        <span className="text-gray-800 dark:text-white">
                                            {settings.autoSaveExperiments ? '✅' : '❌'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                    Last Activity
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(analytics.lastActivity).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Chart Placeholder */}
                    <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                            Learning Progress
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Chemistry Mastery</span>
                                <span className="text-gray-800 dark:text-white">{analytics.chemistryMastery}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${analytics.chemistryMastery}%` }}></div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Physics Mastery</span>
                                <span className="text-gray-800 dark:text-white">{analytics.physicsMastery}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${analytics.physicsMastery}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            💡 <strong>Insight:</strong> You're making great progress in your scientific journey!
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};