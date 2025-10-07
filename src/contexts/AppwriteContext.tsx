import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Mixture } from '../types/chemistry';
import { useAuth } from './AuthContext';
import { databases } from '../config/appwrite';
import { ID, Query } from 'appwrite';

interface AppwriteContextType {
    isCloudStorage: boolean;
    saveMixture: (mixture: Mixture) => Promise<void>;
    loadMixtures: () => Promise<Mixture[]>;
    deleteMixture: (mixtureId: string) => Promise<void>;
    clearAllMixtures: () => Promise<void>;
    getTourStatus: () => Promise<boolean>;
    setTourStatus: (status: boolean) => Promise<void>;
}

const AppwriteContext = createContext<AppwriteContextType | undefined>(undefined);

// Separate component for the provider to fix fast refresh issue
const AppwriteProviderComponent = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const isCloudStorage = !!import.meta.env.VITE_APPWRITE_DATABASE_ID && !!import.meta.env.VITE_APPWRITE_COLLECTION_ID;
    
    // Ensure Appwrite collections exist
    useEffect(() => {
        if (isCloudStorage) {
            // The collections should be created manually in Appwrite dashboard
            // This is just for documentation purposes
            console.log('Appwrite cloud storage is enabled');
        }
    }, [isCloudStorage]);

    const saveMixture = async (mixture: Mixture) => {
        if (!isCloudStorage || !user) {
            // Fallback to localStorage
            const savedMixtures = localStorage.getItem('recentMixtures');
            let mixtures: Mixture[] = [];
            if (savedMixtures) {
                try {
                    mixtures = JSON.parse(savedMixtures);
                } catch (e) {
                    console.error('Failed to parse recent mixtures', e);
                }
            }
            // Add new mixture to the beginning and keep only last 10
            const updatedMixtures = [mixture, ...mixtures].slice(0, 10);
            localStorage.setItem('recentMixtures', JSON.stringify(updatedMixtures));
            return;
        }

        try {
            // Save to Appwrite database
            await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                ID.unique(),
                {
                    type: 'mixture',
                    userId: user.$id,
                    name: mixture.name,
                    chemicals: JSON.stringify(mixture.chemicals),
                    color: mixture.color,
                    createdAt: mixture.createdAt.toISOString(),
                }
            );
        } catch (error) {
            console.error('Error saving mixture to Appwrite:', error);
            throw error;
        }
    };

    const loadMixtures = async (): Promise<Mixture[]> => {
        if (!isCloudStorage || !user) {
            // Fallback to localStorage
            const savedMixtures = localStorage.getItem('recentMixtures');
            if (savedMixtures) {
                try {
                    const parsedMixtures = JSON.parse(savedMixtures);
                    // Convert date strings back to Date objects
                    return parsedMixtures.map((mixture: any) => ({
                        ...mixture,
                        createdAt: new Date(mixture.createdAt)
                    }));
                } catch (e) {
                    console.error('Failed to parse recent mixtures', e);
                }
            }
            return [];
        }

        try {
            // Load from Appwrite database
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                    Query.equal('type', 'mixture'),
                    Query.equal('userId', user.$id),
                    Query.orderDesc('$createdAt'),
                    Query.limit(10)
                ]
            );

            return response.documents.map((doc: any) => ({
                id: doc.$id,
                name: doc.name,
                chemicals: JSON.parse(doc.chemicals),
                color: doc.color,
                createdAt: new Date(doc.$createdAt),
            }));
        } catch (error) {
            console.error('Error loading mixtures from Appwrite:', error);
            // Fallback to localStorage
            const savedMixtures = localStorage.getItem('recentMixtures');
            if (savedMixtures) {
                try {
                    const parsedMixtures = JSON.parse(savedMixtures);
                    return parsedMixtures.map((mixture: any) => ({
                        ...mixture,
                        createdAt: new Date(mixture.createdAt)
                    }));
                } catch (e) {
                    console.error('Failed to parse recent mixtures', e);
                }
            }
            return [];
        }
    };

    const deleteMixture = async (mixtureId: string) => {
        if (!isCloudStorage || !user) {
            // Fallback to localStorage
            const savedMixtures = localStorage.getItem('recentMixtures');
            if (savedMixtures) {
                try {
                    const mixtures = JSON.parse(savedMixtures);
                    const updatedMixtures = mixtures.filter((m: Mixture) => m.id !== mixtureId);
                    localStorage.setItem('recentMixtures', JSON.stringify(updatedMixtures));
                } catch (e) {
                    console.error('Failed to parse recent mixtures', e);
                }
            }
            return;
        }

        try {
            // Delete from Appwrite database
            await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                mixtureId
            );
        } catch (error) {
            console.error('Error deleting mixture from Appwrite:', error);
            throw error;
        }
    };

    const clearAllMixtures = async () => {
        if (!isCloudStorage || !user) {
            // Fallback to localStorage
            localStorage.removeItem('recentMixtures');
            return;
        }

        try {
            // Delete all mixtures from Appwrite database for this user
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                    Query.equal('type', 'mixture'),
                    Query.equal('userId', user.$id)
                ]
            );

            // Delete each document
            await Promise.all(response.documents.map(doc => 
                databases.deleteDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
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
            // Fallback to localStorage
            const savedSettings = localStorage.getItem('userSettings');
            if (savedSettings) {
                try {
                    const settings = JSON.parse(savedSettings);
                    return settings.isTourShown || false;
                } catch (e) {
                    console.error('Failed to parse user settings', e);
                }
            }
            return false;
        }

        try {
            // Load tour status from Appwrite database
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                    Query.equal('type', 'tour'),
                    Query.equal('userId', user.$id),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                return response.documents[0].isTourShown || false;
            }
            return false;
        } catch (error) {
            console.error('Error loading tour status from Appwrite:', error);
            // Fallback to localStorage
            const savedSettings = localStorage.getItem('userSettings');
            if (savedSettings) {
                try {
                    const settings = JSON.parse(savedSettings);
                    return settings.isTourShown || false;
                } catch (e) {
                    console.error('Failed to parse user settings', e);
                }
            }
            return false;
        }
    };

    const setTourStatus = async (status: boolean) => {
        if (!isCloudStorage || !user) {
            // Fallback to localStorage
            const savedSettings = localStorage.getItem('userSettings');
            let settings = {
                theme: 'system',
                notifications: true,
                soundEffects: true,
                autoSaveExperiments: false,
                defaultLab: 'chemistry',
                isTourShown: status
            };
            
            if (savedSettings) {
                try {
                    settings = { ...JSON.parse(savedSettings), isTourShown: status };
                } catch (e) {
                    console.error('Failed to parse user settings', e);
                }
            }
            
            localStorage.setItem('userSettings', JSON.stringify(settings));
            return;
        }

        try {
            // Check if tour document already exists
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                    Query.equal('type', 'tour'),
                    Query.equal('userId', user.$id),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                // Update existing tour document
                await databases.updateDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                    response.documents[0].$id,
                    {
                        isTourShown: status
                    }
                );
            } else {
                // Create new tour document
                await databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                    ID.unique(),
                    {
                        type: 'tour',
                        userId: user.$id,
                        isTourShown: status
                    }
                );
            }
        } catch (error) {
            console.error('Error saving tour status to Appwrite:', error);
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
            setTourStatus
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