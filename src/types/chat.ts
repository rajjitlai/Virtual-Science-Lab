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
}