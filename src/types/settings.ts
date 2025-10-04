export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    soundEffects: boolean;
    autoSaveExperiments: boolean;
    defaultLab: 'chemistry' | 'physics';
}

export const DEFAULT_SETTINGS: UserSettings = {
    theme: 'system',
    notifications: true,
    soundEffects: true,
    autoSaveExperiments: false,
    defaultLab: 'chemistry',
};