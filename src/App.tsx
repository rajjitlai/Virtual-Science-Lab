import React, { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useTheme } from './contexts/ThemeContext'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import UserProfile from './components/auth/UserProfile'
import UserSettings from './components/settings/UserSettings'
import ChatHistory from './components/ai/ChatHistory'
import ChemistryLab from './components/chemistry/ChemistryLab'
import PhysicsLab from './components/physics/PhysicsLab'
import './App.css'

function App() {
  const { user, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'chemistry' | 'physics'>('chemistry')
  const [authView, setAuthView] = useState<'login' | 'register'>('login')
  const [showSettings, setShowSettings] = useState(false)
  const [showChatHistory, setShowChatHistory] = useState(false)

  const handleAskAI = (question: string) => {
    alert(`AI Assistant would answer: ${question}\n\nIn a real implementation, this would connect to the Gemini API.`);
  };

  // Handle hash changes for navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#register') {
        setAuthView('register')
      } else if (window.location.hash === '#login') {
        setAuthView('login')
      } else if (window.location.hash === '#settings') {
        setShowSettings(true)
        setShowChatHistory(false)
      } else if (window.location.hash === '#profile') {
        setShowSettings(false)
        setShowChatHistory(false)
      } else if (window.location.hash === '#chat-history') {
        setShowChatHistory(true)
        setShowSettings(false)
      } else {
        setShowSettings(false)
        setShowChatHistory(false)
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🧪 Virtual Science Lab</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {authView === 'login' ? <LoginForm /> : <RegisterForm />}
        </main>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🧪 Virtual Science Lab</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button 
                onClick={() => {
                  window.location.hash = 'profile';
                  setShowSettings(false);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Back to Profile
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <UserSettings />
        </main>
      </div>
    );
  }

  if (showChatHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🧪 Virtual Science Lab</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button 
                onClick={() => {
                  window.location.hash = '';
                  setShowChatHistory(false);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Back to Lab
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <ChatHistory />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🧪 Virtual Science Lab</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">Interactive chemistry and physics experiments</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
              <span className="text-gray-700 dark:text-gray-300">{user.name}</span>
            </div>
            <button 
              onClick={() => window.location.hash = 'profile'}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      {window.location.hash === '#profile' ? (
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <UserProfile />
        </main>
      ) : (
        <>
          <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('chemistry')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'chemistry'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  🧪 Chemistry Lab
                </button>
                <button
                  onClick={() => setActiveTab('physics')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'physics'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
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
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-center text-gray-500 dark:text-gray-400">
                🤖 Ask the AI Lab Assistant: "What happens when I mix vinegar and baking soda?"
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}

export default App