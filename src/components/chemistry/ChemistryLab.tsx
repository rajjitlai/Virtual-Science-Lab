import React, { useState } from 'react';

interface ChemistryLabProps {
  onAskAI: (question: string) => void;
}

const ChemistryLab: React.FC<ChemistryLabProps> = ({ onAskAI }) => {
  const [question, setQuestion] = useState('');

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onAskAI(question);
      // In a real implementation, this would also save to chat history
      setQuestion('');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chemistry Lab</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="font-semibold">Chemicals</h3>
          <ul className="list-disc pl-5 mt-2">
            <li>Hydrogen Peroxide</li>
            <li>Baking Soda</li>
            <li>Vinegar</li>
            <li>Food Coloring</li>
          </ul>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
          <h3 className="font-semibold">Reactions</h3>
          <p className="mt-2">Mix chemicals to see reactions!</p>
          <button 
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => onAskAI("What happens when I mix vinegar and baking soda?")}
          >
            Ask AI: Vinegar + Baking Soda
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-6">
        <h3 className="font-semibold mb-3">Ask the AI Assistant</h3>
        <form onSubmit={handleSubmitQuestion} className="flex">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ask a question about chemistry..."
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
          >
            Ask
          </button>
        </form>
        <div className="mt-3">
          <button 
            onClick={() => window.location.hash = 'chat-history'}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm"
          >
            View Chat History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChemistryLab;