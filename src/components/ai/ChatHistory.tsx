import { useState } from 'react';
import { useChatHistory } from '../../contexts/ChatHistoryContext';
import type { ChatSession } from '../../types/chat';

interface ChatHistoryProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChatHistory = ({ isOpen, onClose }: ChatHistoryProps) => {
    const { sessions, deleteSession, clearAllSessions } = useChatHistory();
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const handleDelete = (sessionId: string) => {
        deleteSession(sessionId);
        if (selectedSession?.id === sessionId) {
            setSelectedSession(null);
        }
    };

    const handleClearAll = () => {
        clearAllSessions();
        setSelectedSession(null);
        setShowDeleteConfirm(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[700px] flex overflow-hidden">
                {/* Sidebar - Session List */}
                <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                💬 Chat History
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {sessions.length > 0 && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg"
                            >
                                Clear All History
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {sessions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    No chat history yet.
                                    <br />
                                    Start a conversation with the AI assistant!
                                </p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => setSelectedSession(session)}
                                    className={`p-4 rounded-lg cursor-pointer transition-all ${selectedSession?.id === session.id
                                            ? 'bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-500'
                                            : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-sm text-gray-800 dark:text-white line-clamp-2">
                                            {session.title}
                                        </h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(session.id);
                                            }}
                                            className="text-red-500 hover:text-red-700 text-sm ml-2"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                        <span>{formatDate(session.createdAt)}</span>
                                        <span>{session.messages.length} messages</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content - Selected Chat */}
                <div className="flex-1 flex flex-col">
                    {selectedSession ? (
                        <>
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                    {selectedSession.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedSession.createdAt.toLocaleString()} • {selectedSession.messages.length} messages
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {selectedSession.messages.map((message) => (
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
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-4">💬</div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Select a conversation to view details
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Clear All History?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            This will permanently delete all your chat conversations. This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};