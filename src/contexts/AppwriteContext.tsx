import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Mixture } from '../types/chemistry';
import type { UserSettings, UserAnalytics } from '../types/settings';
import { useAuth } from './AuthContext';
import { databases } from '../config/appwrite';
import { ID, Query } from 'appwrite';

// Appwrite document types that reflect the actual structure of documents in the database
// Document shape for mixtures (for reference only)
// interface AppwriteMixtureDocument {
//   $id: string;
//   $createdAt: string; // ISO date string
//   userId: string;
//   name: string;
//   chemicals: string; // JSON stringified array
//   color: string;
// }

// Document shape for user data (for reference only)
// interface AppwriteUserDataDocument {
//   $id: string;
//   $createdAt: string; // ISO date string
//   userId: string;
//   type: 'tour' | 'settings';
//   isTourShown?: boolean;
//   settings?: string; // JSON stringified object
// }

interface AppwriteContextType {
    isCloudStorage: boolean;
    saveMixture: (mixture: Mixture) => Promise<void>;
    loadMixtures: () => Promise<Mixture[]>;
    deleteMixture: (mixtureId: string) => Promise<void>;
    clearAllMixtures: () => Promise<void>;
    getTourStatus: () => Promise<boolean>;
    setTourStatus: (status: boolean) => Promise<void>;
    getUserSettings: () => Promise<UserSettings | null>;
    saveUserSettings: (settings: UserSettings) => Promise<void>;
    // Add analytics methods
    getUserAnalytics: () => Promise<UserAnalytics | null>;
    saveUserAnalytics: (analytics: UserAnalytics) => Promise<void>;
    incrementExperimentsCount: () => Promise<void>;
    incrementAIQuestionsCount: () => Promise<void>;
    // Add collection creation method
    createAnalyticsCollection: () => Promise<void>;
}

const AppwriteContext = createContext<AppwriteContextType | undefined>(undefined);

// Separate component for the provider to fix fast refresh issue
const AppwriteProviderComponent = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    // Check if all required Appwrite environment variables are set
    const isCloudStorage = !!import.meta.env.VITE_APPWRITE_DATABASE_ID &&
        !!import.meta.env.VITE_APPWRITE_CHAT_COLLECTION_ID &&
        !!import.meta.env.VITE_APPWRITE_MIXTURES_COLLECTION_ID &&
        !!import.meta.env.VITE_APPWRITE_USER_DATA_COLLECTION_ID &&
        !!import.meta.env.VITE_APPWRITE_SETTINGS_COLLECTION_ID &&
        !!import.meta.env.VITE_APPWRITE_ANALYTICS_COLLECTION_ID;

    // Ensure Appwrite collections exist
    useEffect(() => {
        if (isCloudStorage) {
            console.log('Appwrite cloud storage is enabled with separate collections');
        } else {
            console.warn('Appwrite cloud storage is not fully configured. Please set all required environment variables.');
        }
    }, [isCloudStorage]);

    const saveMixture = async (mixture: Mixture) => {
        if (!isCloudStorage || !user) {
            throw new Error('Appwrite cloud storage is not configured or user is not authenticated');
        }

        try {
            // Save to Appwrite database in dedicated mixtures collection
            // Appwrite automatically generates $id and $createdAt fields
            await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_MIXTURES_COLLECTION_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    name: mixture.name,
                    chemicals: JSON.stringify(mixture.chemicals),
                    color: mixture.color,
                    // Removed manual createdAt field - Appwrite auto-generates $createdAt
                }
            );
        } catch (error) {
            console.error('Error saving mixture to Appwrite:', error);
            throw error;
        }
    };

    const loadMixtures = async (): Promise<Mixture[]> => {
        if (!isCloudStorage || !user) {
            throw new Error('Appwrite cloud storage is not configured or user is not authenticated');
        }

        try {
            // Load from Appwrite database in dedicated mixtures collection
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_MIXTURES_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.orderDesc('$createdAt'),
                    Query.limit(10)
                ]
            );

            // Map Appwrite documents to our Mixture type
            return response.documents.map((doc: any) => ({
                id: doc.$id,
                name: doc.name,
                chemicals: JSON.parse(doc.chemicals),
                color: doc.color,
                createdAt: new Date(doc.$createdAt),
            }));
        } catch (error) {
            console.error('Error loading mixtures from Appwrite:', error);
            throw error;
        }
    };

    const deleteMixture = async (mixtureId: string) => {
        if (!isCloudStorage || !user) {
            throw new Error('Appwrite cloud storage is not configured or user is not authenticated');
        }

        try {
            // Delete from Appwrite database in dedicated mixtures collection
            await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_MIXTURES_COLLECTION_ID,
                mixtureId
            );
        } catch (error) {
            console.error('Error deleting mixture from Appwrite:', error);
            throw error;
        }
    };

    const clearAllMixtures = async () => {
        if (!isCloudStorage || !user) {
            throw new Error('Appwrite cloud storage is not configured or user is not authenticated');
        }

        try {
            // Delete all mixtures from Appwrite database for this user in dedicated mixtures collection
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_MIXTURES_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id)
                ]
            );

            // Delete each document
            await Promise.all(response.documents.map(doc =>
                databases.deleteDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_MIXTURES_COLLECTION_ID,
                    doc.$id
                )
            ));
        } catch (error) {
            console.error('Error clearing all mixtures from Appwrite:', error);
            throw error;
        }
    };

    const getTourStatus = async (): Promise<boolean> => {
        if (!isCloudStorage || !user) {
            throw new Error('Appwrite cloud storage is not configured or user is not authenticated');
        }

        try {
            // Load tour status from Appwrite database in dedicated user data collection
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_USER_DATA_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.equal('type', 'tour'),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                return response.documents[0].isTourShown || false;
            }
            return false;
        } catch (error) {
            console.error('Error loading tour status from Appwrite:', error);
            throw error;
        }
    };

    const setTourStatus = async (status: boolean) => {
        if (!isCloudStorage || !user) {
            throw new Error('Appwrite cloud storage is not configured or user is not authenticated');
        }

        try {
            // Check if tour document already exists
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_USER_DATA_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.equal('type', 'tour'),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                // Update existing tour document
                await databases.updateDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_USER_DATA_COLLECTION_ID,
                    response.documents[0].$id,
                    {
                        isTourShown: status
                    }
                );
            } else {
                // Create new tour document
                await databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_USER_DATA_COLLECTION_ID,
                    ID.unique(),
                    {
                        userId: user.$id,
                        type: 'tour',
                        isTourShown: status
                    }
                );
            }
        } catch (error) {
            console.error('Error saving tour status to Appwrite:', error);
            throw error;
        }
    };

    const getUserSettings = async (): Promise<UserSettings | null> => {
        if (!isCloudStorage || !user) {
            return null;
        }

        try {
            // Load user settings from Appwrite database in dedicated settings collection
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_SETTINGS_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                const doc = response.documents[0];
                const settings: UserSettings = {
                    theme: doc.theme || 'system',
                    notifications: doc.notifications !== undefined ? doc.notifications : true,
                    soundEffects: doc.soundEffects !== undefined ? doc.soundEffects : true,
                    autoSaveExperiments: doc.autoSaveExperiments !== undefined ? doc.autoSaveExperiments : false,
                    defaultLab: doc.defaultLab || 'chemistry',
                    isTourShown: false // This will be loaded separately from user_data collection
                };
                
                // Save to localStorage for immediate access next time
                localStorage.setItem('userSettings', JSON.stringify(settings));
                
                return settings;
            }
            return null;
        } catch (error) {
            console.error('Error loading user settings from Appwrite:', error);
            throw error;
        }
    };

    const saveUserSettings = async (settings: UserSettings) => {
        // Save to localStorage for immediate access
        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        if (!isCloudStorage || !user) {
            return;
        }

        try {
            // Check if settings document already exists
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_SETTINGS_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                // Update existing settings document with individual fields (excluding isTourShown)
                await databases.updateDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_SETTINGS_COLLECTION_ID,
                    response.documents[0].$id,
                    {
                        theme: settings.theme,
                        notifications: settings.notifications,
                        soundEffects: settings.soundEffects,
                        autoSaveExperiments: settings.autoSaveExperiments,
                        defaultLab: settings.defaultLab
                    }
                );
            } else {
                // Create new settings document with individual fields (excluding isTourShown)
                await databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_SETTINGS_COLLECTION_ID,
                    ID.unique(),
                    {
                        userId: user.$id,
                        theme: settings.theme,
                        notifications: settings.notifications,
                        soundEffects: settings.soundEffects,
                        autoSaveExperiments: settings.autoSaveExperiments,
                        defaultLab: settings.defaultLab
                    }
                );
            }
        } catch (error) {
            console.error('Error saving user settings to Appwrite:', error);
            throw error;
        }
    };

    // Add analytics methods
    const getUserAnalytics = async (): Promise<UserAnalytics | null> => {
        // Always try localStorage first for immediate access
        const localStorageAnalytics = localStorage.getItem('userAnalytics');
        if (localStorageAnalytics) {
            try {
                const parsed = JSON.parse(localStorageAnalytics);
                // If we have valid analytics data in localStorage, return it
                if (parsed && typeof parsed === 'object') {
                    return parsed;
                }
            } catch (error) {
                console.error('Error parsing localStorage analytics:', error);
            }
        }

        if (!isCloudStorage || !user) {
            // Return default analytics when Appwrite is not configured
            return {
                experimentsRun: 0,
                aiQuestionsAsked: 0,
                timeSpent: 0,
                favoriteLab: 'chemistry',
                lastActivity: new Date().toISOString(),
                chemistryMastery: 0,
                physicsMastery: 0
            };
        }

        try {
            // Load user analytics from Appwrite database in dedicated analytics collection
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_ANALYTICS_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                const doc = response.documents[0];
                const analytics: UserAnalytics = {
                    experimentsRun: doc.experimentsRun || 0,
                    aiQuestionsAsked: doc.aiQuestionsAsked || 0,
                    timeSpent: doc.timeSpent || 0,
                    favoriteLab: doc.favoriteLab || 'chemistry',
                    lastActivity: doc.lastActivity || new Date().toISOString(),
                    chemistryMastery: doc.chemistryMastery || 0,
                    physicsMastery: doc.physicsMastery || 0
                };
                
                // Save to localStorage for immediate access next time
                localStorage.setItem('userAnalytics', JSON.stringify(analytics));
                
                return analytics;
            }
            
            // Return default analytics if none found
            return {
                experimentsRun: 0,
                aiQuestionsAsked: 0,
                timeSpent: 0,
                favoriteLab: 'chemistry',
                lastActivity: new Date().toISOString(),
                chemistryMastery: 0,
                physicsMastery: 0
            };
        } catch (error) {
            console.error('Error loading user analytics from Appwrite:', error);
            throw error;
        }
    };

    const saveUserAnalytics = async (analytics: UserAnalytics) => {
        // Always save to localStorage for immediate access
        localStorage.setItem('userAnalytics', JSON.stringify(analytics));
        
        if (!isCloudStorage || !user) {
            // Only save to localStorage when Appwrite is not configured
            return;
        }

        try {
            // Check if analytics document already exists
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_ANALYTICS_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                // Update existing analytics document
                await databases.updateDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_ANALYTICS_COLLECTION_ID,
                    response.documents[0].$id,
                    {
                        experimentsRun: analytics.experimentsRun,
                        aiQuestionsAsked: analytics.aiQuestionsAsked,
                        timeSpent: analytics.timeSpent,
                        favoriteLab: analytics.favoriteLab,
                        lastActivity: analytics.lastActivity,
                        chemistryMastery: analytics.chemistryMastery,
                        physicsMastery: analytics.physicsMastery
                    }
                );
            } else {
                // Create new analytics document
                await databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_ANALYTICS_COLLECTION_ID,
                    ID.unique(),
                    {
                        userId: user.$id,
                        experimentsRun: analytics.experimentsRun,
                        aiQuestionsAsked: analytics.aiQuestionsAsked,
                        timeSpent: analytics.timeSpent,
                        favoriteLab: analytics.favoriteLab,
                        lastActivity: analytics.lastActivity,
                        chemistryMastery: analytics.chemistryMastery,
                        physicsMastery: analytics.physicsMastery
                    }
                );
            }
        } catch (error) {
            console.error('Error saving user analytics to Appwrite:', error);
            throw error;
        }
    };

    const incrementExperimentsCount = async () => {
        try {
            const currentAnalytics = await getUserAnalytics();
            if (currentAnalytics) {
                const updatedAnalytics = {
                    ...currentAnalytics,
                    experimentsRun: currentAnalytics.experimentsRun + 1,
                    lastActivity: new Date().toISOString()
                };
                await saveUserAnalytics(updatedAnalytics);
            }
        } catch (error) {
            console.error('Error incrementing experiments count:', error);
        }
    };

    const incrementAIQuestionsCount = async () => {
        try {
            const currentAnalytics = await getUserAnalytics();
            if (currentAnalytics) {
                const updatedAnalytics = {
                    ...currentAnalytics,
                    aiQuestionsAsked: currentAnalytics.aiQuestionsAsked + 1,
                    lastActivity: new Date().toISOString()
                };
                await saveUserAnalytics(updatedAnalytics);
            }
        } catch (error) {
            console.error('Error incrementing AI questions count:', error);
        }
    };

    const createAnalyticsCollection = async () => {
        if (!isCloudStorage) {
            throw new Error('Appwrite cloud storage is not configured');
        }

        try {
            // This would be used to create the analytics collection if needed
            // In practice, this would be done through the Appwrite console
            console.log('Analytics collection creation would be implemented here');
        } catch (error) {
            console.error('Error creating analytics collection:', error);
            throw error;
        }
    };

    return (
        <AppwriteContext.Provider value={{
            isCloudStorage,
            saveMixture,
            loadMixtures,
            deleteMixture,
            clearAllMixtures,
            getTourStatus,
            setTourStatus,
            getUserSettings,
            saveUserSettings,
            getUserAnalytics,
            saveUserAnalytics,
            incrementExperimentsCount,
            incrementAIQuestionsCount,
            createAnalyticsCollection
        }}>
            {children}
        </AppwriteContext.Provider>
    );
};

export const AppwriteProvider = AppwriteProviderComponent;

export const useAppwrite = () => {
    const context = useContext(AppwriteContext);
    if (!context) throw new Error('useAppwrite must be used within AppwriteProvider');
    return context;
};