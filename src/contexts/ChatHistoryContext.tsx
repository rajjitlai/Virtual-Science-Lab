import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Message, ChatSession } from '../types/chat';
import { useAuth } from './AuthContext';
import { databases } from '../config/appwrite';
import { ID, Query } from 'appwrite';

// Appwrite document type for chat sessions
// Appwrite document type for chat sessions (kept for reference)
// interface AppwriteChatDocument {
//   $id: string;
//   $createdAt: string; // ISO date string
//   userId: string;
//   title: string;
//   context: string;
//   messages: string; // JSON stringified array
// }

interface ChatHistoryContextType {
    sessions: ChatSession[];
    saveSession: (messages: Message[], context?: string, sessionId?: string) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
    clearAllSessions: () => Promise<void>;
    loadSessionsFromAppwrite: () => Promise<void>;
    isCloudStorage: boolean;
    isLoading: boolean;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

// Separate component for the provider to fix fast refresh issue
const ChatHistoryProviderComponent = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Check if Appwrite chat collection is configured
    const isCloudStorage = !!import.meta.env.VITE_APPWRITE_DATABASE_ID &&
        !!import.meta.env.VITE_APPWRITE_CHAT_COLLECTION_ID;
    const [lastLoadedUser, setLastLoadedUser] = useState<string | null>(null);

    // Load sessions from Appwrite on mount
    useEffect(() => {
        if (user && lastLoadedUser !== user.$id) {
            setLastLoadedUser(user.$id);
            if (isCloudStorage) {
                loadSessionsFromAppwrite();
            } else {
                console.warn('Appwrite chat collection is not configured. Chat history will not be saved.');
            }
        }
    }, [user, isCloudStorage, lastLoadedUser]);

    const loadSessionsFromAppwrite = async () => {
        if (!isCloudStorage || !user) return;

        setIsLoading(true);
        try {
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_CHAT_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.orderDesc('$createdAt')
                ]
            );

            const sessionsWithDates = response.documents.map((doc: any) => ({
                id: doc.$id,
                messages: JSON.parse(doc.messages).map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                })),
                title: doc.title,
                createdAt: new Date(doc.$createdAt),
                context: doc.context || undefined,
            }));

            setSessions(sessionsWithDates);
        } catch (error) {
            console.error('Error loading sessions from Appwrite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveSession = async (messages: Message[], context?: string, sessionId?: string) => {
        if (!isCloudStorage || !user || messages.length <= 1) return; // Don't save if only greeting message

        // Generate title from first user message
        const firstUserMessage = messages.find(m => m.role === 'user');
        const title = firstUserMessage
            ? firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
            : 'New Conversation';

        // Save to Appwrite database in dedicated chat collection
        // Appwrite automatically generates $id and $createdAt fields
        try {
            if (sessionId) {
                // Update existing document
                await databases.updateDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_CHAT_COLLECTION_ID,
                    sessionId,
                    {
                        title: `${context ? `[${context}] ` : ''}${title}`,
                        context: context || '',
                        messages: JSON.stringify(messages),
                    }
                );
            } else {
                // Create new document
                await databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_CHAT_COLLECTION_ID,
                    ID.unique(),
                    {
                        userId: user.$id,
                        title: `${context ? `[${context}] ` : ''}${title}`,
                        context: context || '',
                        messages: JSON.stringify(messages),
                    }
                );
            }
            // Note: We're not calling loadSessionsFromAppwrite() here to avoid potential duplicate saves
            // The sessions will be refreshed when the component re-mounts or when explicitly requested
        } catch (error) {
            console.error('Error saving session to Appwrite:', error);
            throw error;
        }
    };

    const deleteSession = async (sessionId: string) => {
        if (!isCloudStorage || !user) return;

        // Delete from Appwrite database in dedicated chat collection
        try {
            await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_CHAT_COLLECTION_ID,
                sessionId
            );
            // Note: We're not calling loadSessionsFromAppwrite() here to avoid potential issues
            // The sessions will be refreshed when the component re-mounts or when explicitly requested
        } catch (error) {
            console.error('Error deleting session from Appwrite:', error);
            throw error;
        }
    };

    const clearAllSessions = async () => {
        if (!isCloudStorage || !user) return;

        try {
            // Get all chat sessions for this user
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_CHAT_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id)
                ]
            );

            // Delete each document
            await Promise.all(response.documents.map(doc =>
                databases.deleteDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_CHAT_COLLECTION_ID,
                    doc.$id
                )
            ));

            setSessions([]);
        } catch (error) {
            console.error('Error clearing all sessions from Appwrite:', error);
            throw error;
        }
    };

    return (
        <ChatHistoryContext.Provider value={{
            sessions,
            saveSession,
            deleteSession,
            clearAllSessions,
            loadSessionsFromAppwrite,
            isCloudStorage,
            isLoading
        }}>
            {children}
        </ChatHistoryContext.Provider>
    );
};

export const ChatHistoryProvider = ChatHistoryProviderComponent;

export const useChatHistory = () => {
    const context = useContext(ChatHistoryContext);
    if (!context) throw new Error('useChatHistory must be used within ChatHistoryProvider');
    return context;
};