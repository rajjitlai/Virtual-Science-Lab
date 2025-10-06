import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Message, ChatSession } from '../types/chat';
import { useAuth } from './AuthContext';

interface ChatHistoryContextType {
    sessions: ChatSession[];
    saveSession: (messages: Message[], context?: string) => void;
    deleteSession: (sessionId: string) => void;
    clearAllSessions: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<ChatSession[]>([]);

    // Load sessions from localStorage on mount
    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`chatHistory_${user.$id}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Convert date strings back to Date objects
                const sessionsWithDates = parsed.map((session: any) => ({
                    ...session,
                    createdAt: new Date(session.createdAt),
                    messages: session.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp),
                    })),
                }));
                setSessions(sessionsWithDates);
            }
        }
    }, [user]);

    // Save to localStorage whenever sessions change
    useEffect(() => {
        if (user && sessions.length > 0) {
            localStorage.setItem(`chatHistory_${user.$id}`, JSON.stringify(sessions));
        }
    }, [sessions, user]);

    const saveSession = (messages: Message[], context?: string) => {
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

        setSessions(prev => [newSession, ...prev]);
    };

    const deleteSession = (sessionId: string) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
    };

    const clearAllSessions = () => {
        if (user) {
            localStorage.removeItem(`chatHistory_${user.$id}`);
            setSessions([]);
        }
    };

    return (
        <ChatHistoryContext.Provider value={{ sessions, saveSession, deleteSession, clearAllSessions }}>
            {children}
        </ChatHistoryContext.Provider>
    );
};

export const useChatHistory = () => {
    const context = useContext(ChatHistoryContext);
    if (!context) throw new Error('useChatHistory must be used within ChatHistoryProvider');
    return context;
};