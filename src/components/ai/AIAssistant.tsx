import { useState, useRef, useEffect } from 'react';
import { model, SYSTEM_PROMPT } from '../../config/gemini';
import type { Message } from '../../types/chat';
import { useChatHistory } from '../../contexts/ChatHistoryContext';

interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    context?: 'chemistry' | 'physics';
}

export const AIAssistant = ({ isOpen, onClose, context }: AIAssistantProps) => {
    const { saveSession } = useChatHistory();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: `Hi! 👋 I'm your AI Lab Assistant. I'm here to help you understand ${context || 'science'} experiments! Ask me anything about chemical reactions, physics concepts, or how things work. What would you like to learn today?`,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleClose = () => {
        // Save session before closing if there are user messages
        if (messages.some(m => m.role === 'user')) {
            saveSession(messages, context);
        }
        onClose();
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!model) {
                throw new Error('Gemini API not configured. Please add your API key to .env file.');
            }

            const conversationHistory = messages
                .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
                .join('\n');

            const contextPrompt = context
                ? `Current lab: ${context}. User is working with ${context === 'chemistry' ? 'chemical reactions and mixtures' : 'physics simulations and gravity'}.`
                : '';

            const fullPrompt = `${SYSTEM_PROMPT}\n\n${contextPrompt}\n\nConversation history:\n${conversationHistory}\n\nUser: ${input}\n\nAssistant:`;

            const result = await model.generateContent(fullPrompt);
            const response = result.response.text();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('Error calling Gemini API:', error);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: error.message || 'Sorry, I encountered an error. Please make sure your Gemini API key is configured correctly in the .env file.',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        "What happens when vinegar and baking soda mix?",
        "Explain gravity in simple terms",
        "Why do objects bounce?",
        "What is a chemical reaction?",
        "How does mass affect falling speed?",
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                AI Lab Assistant
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {context ? `${context} mode` : 'Ready to help'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs mt-2 opacity-70">
                                    {message.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length <= 1 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Quick questions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.slice(0, 3).map((question, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(question)}
                                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about science..."
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                            rows={2}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};