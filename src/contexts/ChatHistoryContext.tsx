import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Message, ChatSession } from '../types/chat';
import { useAuth } from './AuthContext';
import { databases } from '../config/appwrite';
import { ID, Query } from 'appwrite';

interface ChatHistoryContextType {
    sessions: ChatSession[];
    saveSession: (messages: Message[], context?: string) => void;
    deleteSession: (sessionId: string) => void;
    clearAllSessions: () => void;
    isCloudStorage: boolean;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

// Separate component for the provider to fix fast refresh issue
const ChatHistoryProviderComponent = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const isCloudStorage = !!import.meta.env.VITE_APPWRITE_DATABASE_ID && !!import.meta.env.VITE_APPWRITE_COLLECTION_ID;
    const [lastLoadedUser, setLastLoadedUser] = useState<string | null>(null);

    // Load sessions from localStorage or Appwrite on mount
    useEffect(() => {
        if (user && lastLoadedUser !== user.$id) {
            setLastLoadedUser(user.$id);
            if (isCloudStorage) {
                // Load from Appwrite database
                loadSessionsFromAppwrite();
            } else {
                // Load from localStorage
                loadSessionsFromLocalStorage();
            }
        }
    }, [user, isCloudStorage, lastLoadedUser]);

    const loadSessionsFromLocalStorage = () => {
        const saved = localStorage.getItem(`chatHistory_${user?.$id}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Convert date strings back to Date objects
            const sessionsWithDates = parsed.map((session: ChatSession) => ({
                ...session,
                createdAt: new Date(session.createdAt),
                messages: session.messages.map((msg) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                })),
            }));
            setSessions(sessionsWithDates);
        }
    };

    const loadSessionsFromAppwrite = async () => {
        try {
            const response = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [Query.orderDesc('$createdAt')]
            );

            const sessionsWithDates = response.documents.map((doc: any) => ({
                id: doc.$id,
                messages: JSON.parse(doc.messages),
                title: doc.title,
                createdAt: new Date(doc.$createdAt),
            }));

            setSessions(sessionsWithDates);
        } catch (error) {
            console.error('Error loading sessions from Appwrite:', error);
            // Fallback to localStorage
            loadSessionsFromLocalStorage();
        }
    };

    // Save to localStorage or Appwrite whenever sessions change
    useEffect(() => {
        if (user && sessions.length > 0 && !isCloudStorage) {
            // Save to localStorage only for local storage mode
            localStorage.setItem(`chatHistory_${user.$id}`, JSON.stringify(sessions));
        }
    }, [sessions, user, isCloudStorage]);

    const saveSession = async (messages: Message[], context?: string) => {
        if (!user || messages.length <= 1) return; // Don't save if only greeting message

        // Generate title from first user message
        const firstUserMessage = messages.find(m => m.role === 'user');
        const title = firstUserMessage
            ? firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
            : 'New Conversation';

        const newSession: ChatSession = {
            id: Date.now().toString(),
            messages,
            title: `${context ? `[${context}] ` : ''}${title}`,
            createdAt: new Date(),
        };

        if (isCloudStorage) {
            // Save to Appwrite database
            try {
                await databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                    ID.unique(),
                    {
                        title: newSession.title,
                        context: context || '',
                        messages: JSON.stringify(newSession.messages),
                    }
                );
                // Refresh sessions from Appwrite
                await loadSessionsFromAppwrite();
            } catch (error) {
                console.error('Error saving session to Appwrite:', error);
                // Add to local state as fallback
                setSessions(prev => [newSession, ...prev]);
            }
        } else {
            // Save to local state (will be saved to localStorage by useEffect)
            setSessions(prev => [newSession, ...prev]);
        }
    };

    const deleteSession = async (sessionId: string) => {
        if (isCloudStorage) {
            // Delete from Appwrite database
            try {
                await databases.deleteDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                    sessionId
                );
                // Refresh sessions from Appwrite
                await loadSessionsFromAppwrite();
            } catch (error) {
                console.error('Error deleting session from Appwrite:', error);
                // Fallback to local state update
                setSessions(prev => prev.filter(s => s.id !== sessionId));
            }
        } else {
            // Delete from local state (will be saved to localStorage by useEffect)
            setSessions(prev => prev.filter(s => s.id !== sessionId));
        }
    };

    const clearAllSessions = async () => {
        if (user) {
            if (isCloudStorage) {
                // Delete all from Appwrite database
                try {
                    // Note: Appwrite doesn't have a bulk delete API, so we need to delete one by one
                    // This is a simplified approach - in production, you might want to handle this differently
                    const response = await databases.listDocuments(
                        import.meta.env.VITE_APPWRITE_DATABASE_ID,
                        import.meta.env.VITE_APPWRITE_COLLECTION_ID
                    );
                    
                    // Delete each document
                    await Promise.all(response.documents.map(doc => 
                        databases.deleteDocument(
                            import.meta.env.VITE_APPWRITE_DATABASE_ID,
                            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                            doc.$id
                        )
                    ));
                    
                    setSessions([]);
                } catch (error) {
                    console.error('Error clearing all sessions from Appwrite:', error);
                    // Fallback to localStorage
                    localStorage.removeItem(`chatHistory_${user.$id}`);
                    setSessions([]);
                }
            } else {
                // Clear from localStorage
                localStorage.removeItem(`chatHistory_${user.$id}`);
                setSessions([]);
            }
        }
    };

    return (
        <ChatHistoryContext.Provider value={{ sessions, saveSession, deleteSession, clearAllSessions, isCloudStorage }}>
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