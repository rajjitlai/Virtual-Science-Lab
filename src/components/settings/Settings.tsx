import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { DEFAULT_SETTINGS } from '../../types/settings';
import type { UserSettings } from '../../types/settings';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Settings = ({ isOpen, onClose }: SettingsProps) => {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [activeSection, setActiveSection] = useState<'profile' | 'appearance' | 'preferences'>('profile');

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const saveSettings = (newSettings: UserSettings) => {
        setSettings(newSettings);
        localStorage.setItem('userSettings', JSON.stringify(newSettings));
    };

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        saveSettings({ ...settings, theme: newTheme });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-gray-50 dark:bg-gray-900 p-6 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>

                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveSection('profile')}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === 'profile'
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                                }`}
                        >
                            👤 Profile
                        </button>
                        <button
                            onClick={() => setActiveSection('appearance')}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === 'appearance'
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                                }`}
                        >
                            🎨 Appearance
                        </button>
                        <button
                            onClick={() => setActiveSection('preferences')}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === 'preferences'
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                                }`}
                        >
                            ⚙️ Preferences
                        </button>
                    </nav>

                    <div className="mt-auto pt-6">
                        <button
                            onClick={logout}
                            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                    Profile Information
                                </h3>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-4xl text-white font-bold">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                                            {user?.name}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                            Member since {new Date(user?.$createdAt || '').toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border-l-4 border-blue-500">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        💡 <strong>Tip:</strong> Keep exploring different experiments to enhance your learning!
                                    </p>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <h5 className="font-semibold text-gray-800 dark:text-white mb-2">Account Stats</h5>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-400">Experiments Run</p>
                                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                                    {Math.floor(Math.random() * 50) + 10}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-400">AI Questions Asked</p>
                                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                                    {Math.floor(Math.random() * 30) + 5}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Section */}
                    {activeSection === 'appearance' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                    Appearance Settings
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                                            Theme
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <button
                                                onClick={() => handleThemeChange('light')}
                                                className={`p-4 border-2 rounded-lg transition-all ${theme === 'light'
                                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                                                    }`}
                                            >
                                                <div className="text-4xl mb-2">☀️</div>
                                                <p className="font-semibold text-gray-800 dark:text-white">Light</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Bright & clear</p>
                                            </button>

                                            <button
                                                onClick={() => handleThemeChange('dark')}
                                                className={`p-4 border-2 rounded-lg transition-all ${theme === 'dark'
                                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                                                    }`}
                                            >
                                                <div className="text-4xl mb-2">🌙</div>
                                                <p className="font-semibold text-gray-800 dark:text-white">Dark</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Easy on eyes</p>
                                            </button>

                                            <button
                                                onClick={() => handleThemeChange('system')}
                                                className={`p-4 border-2 rounded-lg transition-all ${theme === 'system'
                                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                                                    }`}
                                            >
                                                <div className="text-4xl mb-2">💻</div>
                                                <p className="font-semibold text-gray-800 dark:text-white">System</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Auto adjust</p>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <h5 className="font-semibold text-gray-800 dark:text-white mb-2">Preview</h5>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                                                    Chemistry Lab
                                                </div>
                                                <div className="h-20 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 rounded"></div>
                                            </div>
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                                                    Physics Lab
                                                </div>
                                                <div className="h-20 bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-900 dark:to-blue-900 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Section */}
                    {activeSection === 'preferences' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                    Lab Preferences
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">
                                                Enable Notifications
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Get notified about experiment results
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications}
                                                onChange={(e) =>
                                                    saveSettings({ ...settings, notifications: e.target.checked })
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">Sound Effects</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Play sounds during experiments
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.soundEffects}
                                                onChange={(e) =>
                                                    saveSettings({ ...settings, soundEffects: e.target.checked })
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">
                                                Auto-save Experiments
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Automatically save your work
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.autoSaveExperiments}
                                                onChange={(e) =>
                                                    saveSettings({ ...settings, autoSaveExperiments: e.target.checked })
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <label className="block font-semibold text-gray-800 dark:text-white mb-3">
                                            Default Lab on Startup
                                        </label>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => saveSettings({ ...settings, defaultLab: 'chemistry' })}
                                                className={`flex-1 p-4 border-2 rounded-lg transition-all ${settings.defaultLab === 'chemistry'
                                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                                                    }`}
                                            >
                                                <div className="text-3xl mb-2">🧪</div>
                                                <p className="font-semibold text-gray-800 dark:text-white">Chemistry</p>
                                            </button>
                                            <button
                                                onClick={() => saveSettings({ ...settings, defaultLab: 'physics' })}
                                                className={`flex-1 p-4 border-2 rounded-lg transition-all ${settings.defaultLab === 'physics'
                                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                                                    }`}
                                            >
                                                <div className="text-3xl mb-2">⚡</div>
                                                <p className="font-semibold text-gray-800 dark:text-white">Physics</p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};