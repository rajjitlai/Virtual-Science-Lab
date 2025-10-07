import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Mixture } from '../types/chemistry';
import type { UserSettings } from '../types/settings';
import { useAuth } from './AuthContext';
import { databases } from '../config/appwrite';
import { ID, Query } from 'appwrite';

// Appwrite document types that reflect the actual structure of documents in the database
interface AppwriteMixtureDocument {
  $id: string;
  $createdAt: string; // ISO date string
  userId: string;
  name: string;
  chemicals: string; // JSON stringified array
  color: string;
}

interface AppwriteUserDataDocument {
  $id: string;
  $createdAt: string; // ISO date string
  userId: string;
  type: 'tour' | 'settings';
  isTourShown?: boolean;
  settings?: string; // JSON stringified object
}

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
}

const AppwriteContext = createContext<AppwriteContextType | undefined>(undefined);

// Separate component for the provider to fix fast refresh issue
const AppwriteProviderComponent = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    // Check if all required Appwrite environment variables are set
    const isCloudStorage = !!import.meta.env.VITE_APPWRITE_DATABASE_ID && 
                          !!import.meta.env.VITE_APPWRITE_CHAT_COLLECTION_ID && 
                          !!import.meta.env.VITE_APPWRITE_MIXTURES_COLLECTION_ID && 
                          !!import.meta.env.VITE_APPWRITE_USER_DATA_COLLECTION_ID;
    
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
            throw new Error('Appwrite cloud storage is not configured or user is not authenticated');
        }

        try {
            // Load user settings from Appwrite database in dedicated user data collection
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_USER_DATA_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.equal('type', 'settings'),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                return JSON.parse(response.documents[0].settings || '{}');
            }
            return null;
        } catch (error) {
            console.error('Error loading user settings from Appwrite:', error);
            throw error;
        }
    };

    const saveUserSettings = async (settings: UserSettings) => {
        if (!isCloudStorage || !user) {
            throw new Error('Appwrite cloud storage is not configured or user is not authenticated');
        }

        try {
            // Check if settings document already exists
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_USER_DATA_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.equal('type', 'settings'),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                // Update existing settings document
                await databases.updateDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_USER_DATA_COLLECTION_ID,
                    response.documents[0].$id,
                    {
                        settings: JSON.stringify(settings)
                    }
                );
            } else {
                // Create new settings document
                await databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_USER_DATA_COLLECTION_ID,
                    ID.unique(),
                    {
                        userId: user.$id,
                        type: 'settings',
                        settings: JSON.stringify(settings)
                    }
                );
            }
        } catch (error) {
            console.error('Error saving user settings to Appwrite:', error);
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
            saveUserSettings
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