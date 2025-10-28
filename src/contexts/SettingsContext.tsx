import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';
import { DEFAULT_SETTINGS } from '../types/settings';
import type { UserSettings } from '../types/settings';

interface SettingsContextType {
    settings: UserSettings;
    updateSettings: (newSettings: Partial<UserSettings>) => void;
    resetSettings: () => void;
    isSettingsLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const { setTheme } = useTheme();
    const { showToast } = useToast();
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const loadSettings = () => {
            try {
                const savedSettings = localStorage.getItem('virtualScienceLabSettings');
                if (savedSettings) {
                    const parsedSettings = JSON.parse(savedSettings);
                    setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });

                    // Apply theme immediately
                    if (parsedSettings.theme) {
                        setTheme(parsedSettings.theme);
                    }
                }
            } catch (error) {
                console.error('Error loading settings:', error);
                showToast('Error loading settings, using defaults', 'error');
            } finally {
                setIsSettingsLoaded(true);
            }
        };

        loadSettings();
    }, [setTheme, showToast]);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        if (isSettingsLoaded) {
            try {
                localStorage.setItem('virtualScienceLabSettings', JSON.stringify(settings));
            } catch (error) {
                console.error('Error saving settings:', error);
                showToast('Error saving settings', 'error');
            }
        }
    }, [settings, isSettingsLoaded, showToast]);

    const updateSettings = (newSettings: Partial<UserSettings>) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };

            // Apply theme change immediately
            if (newSettings.theme) {
                setTheme(newSettings.theme);
            }

            // Show feedback for important changes
            if (newSettings.soundEffects !== undefined) {
                showToast(
                    newSettings.soundEffects ? 'Sound effects enabled' : 'Sound effects disabled',
                    'info'
                );
            }

            if (newSettings.notifications !== undefined) {
                showToast(
                    newSettings.notifications ? 'Notifications enabled' : 'Notifications disabled',
                    'info'
                );
            }

            if (newSettings.autoSaveExperiments !== undefined) {
                showToast(
                    newSettings.autoSaveExperiments ? 'Auto-save enabled' : 'Auto-save disabled',
                    'info'
                );
            }

            return updated;
        });
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
        setTheme(DEFAULT_SETTINGS.theme);
        showToast('Settings reset to defaults', 'info');
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            resetSettings,
            isSettingsLoaded
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
