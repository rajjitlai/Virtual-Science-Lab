import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

const ChatHistory: React.FC = () => {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real implementation, this would fetch from Appwrite database
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;
      
      try {
        // Simulate API call to fetch chat history
        // In a real implementation, this would use Appwrite databases
        const mockHistory: ChatMessage[] = [
          {
            id: '1',
            question: 'What happens when I mix vinegar and baking soda?',
            answer: 'When you mix vinegar (acetic acid) and baking soda (sodium bicarbonate), they react to form carbon dioxide gas, water, and sodium acetate. This creates the characteristic fizzing effect.',
            createdAt: '2023-05-15T10:30:00Z'
          },
          {
            id: '2',
            question: 'What is the acceleration due to gravity?',
            answer: 'The acceleration due to gravity on Earth is approximately 9.8 m/s². This means that for every second an object falls, its velocity increases by 9.8 meters per second.',
            createdAt: '2023-05-16T14:22:00Z'
          }
        ];
        
        setChatHistory(mockHistory);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">AI Chat History</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : chatHistory.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center py-8">
          No chat history yet. Ask the AI assistant a question during your experiments!
        </p>
      ) : (
        <div className="space-y-6">
          {chatHistory.map((chat) => (
            <div key={chat.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="mb-3">
                <p className="font-medium text-gray-900 dark:text-white">Q: {chat.question}</p>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">A: {chat.answer}</p>
              </div>
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {new Date(chat.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;