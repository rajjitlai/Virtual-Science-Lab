export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    id: string;
    messages: Message[];
    title: string;
    createdAt: Date;
    context?: string;
}

// Appwrite document type (for reference)
// Note: $id and $createdAt are automatically provided by Appwrite and should not be manually set
export interface AppwriteChatDocument {
    $id: string;
    $createdAt: string; // Automatically set by Appwrite
    userId: string;
    title: string;
    context: string;
    messages: string; // JSON stringified array
}