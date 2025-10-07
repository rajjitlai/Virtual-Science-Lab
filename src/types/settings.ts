export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    soundEffects: boolean;
    autoSaveExperiments: boolean;
    defaultLab: 'chemistry' | 'physics';
    isTourShown: boolean; // New setting for tour completion
}

export const DEFAULT_SETTINGS: UserSettings = {
    theme: 'system',
    notifications: true,
    soundEffects: true,
    autoSaveExperiments: false,
    defaultLab: 'chemistry',
    isTourShown: false, // Default to false so tour shows for new users
};