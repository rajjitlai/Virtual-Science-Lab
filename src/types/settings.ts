export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    soundEffects: boolean;
    autoSaveExperiments: boolean;
    defaultLab: 'chemistry' | 'physics';
    isTourShown: boolean; // New setting for tour completion
}

// Add new interface for analytics data
export interface UserAnalytics {
    experimentsRun: number;
    aiQuestionsAsked: number;
    timeSpent: number; // in minutes
    favoriteLab: 'chemistry' | 'physics';
    lastActivity: string; // ISO date string
    // Learning progress metrics
    chemistryMastery: number; // 0-100 percentage
    physicsMastery: number; // 0-100 percentage
}

// Appwrite document type for user settings (for reference)
// Note: $id and $createdAt are automatically provided by Appwrite and should not be manually set
export interface AppwriteSettingsDocument {
    $id: string;
    $createdAt: string; // Automatically set by Appwrite
    userId: string;
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    soundEffects: boolean;
    autoSaveExperiments: boolean;
    defaultLab: 'chemistry' | 'physics';
    // Note: isTourShown is stored separately in user_data collection
}

// Appwrite document type for analytics (for reference)
// Note: $id and $createdAt are automatically provided by Appwrite and should not be manually set
export interface AppwriteAnalyticsDocument {
    $id: string;
    $createdAt: string; // Automatically set by Appwrite
    userId: string;
    experimentsRun: number;
    aiQuestionsAsked: number;
    timeSpent: number;
    favoriteLab: 'chemistry' | 'physics';
    lastActivity: string;
    chemistryMastery: number;
    physicsMastery: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
    theme: 'system',
    notifications: true,
    soundEffects: true,
    autoSaveExperiments: false,
    defaultLab: 'chemistry',
    isTourShown: false, // Default to false so tour shows for new users
};