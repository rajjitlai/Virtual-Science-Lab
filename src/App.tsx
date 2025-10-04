import React, { useState } from 'react'
import ChemistryLab from './components/chemistry/ChemistryLab'
import PhysicsLab from './components/physics/PhysicsLab'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'chemistry' | 'physics'>('chemistry')

  const handleAskAI = (question: string) => {
    alert(`AI Assistant would answer: ${question}\n\nIn a real implementation, this would connect to the Gemini API.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">🧪 Virtual Science Lab</h1>
          <p className="mt-1 text-gray-600">Interactive chemistry and physics experiments</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('chemistry')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chemistry'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🧪 Chemistry Lab
            </button>
            <button
              onClick={() => setActiveTab('physics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'physics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⚡ Physics Lab
            </button>
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'chemistry' ? (
            <ChemistryLab onAskAI={handleAskAI} />
          ) : (
            <PhysicsLab onAskAI={handleAskAI} />
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-8">
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-500">
            🤖 Ask the AI Lab Assistant: "What happens when I mix vinegar and baking soda?"
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App