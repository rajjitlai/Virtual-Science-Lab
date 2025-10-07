import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatHistoryProvider } from './contexts/ChatHistoryContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { AppwriteProvider, useAppwrite } from './contexts/AppwriteContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingScreen } from './components/common/LoadingScreen';
import { WelcomeTour } from './components/common/WelcomeTour';
import { Login } from './components/auth/Login';
import { useState, useEffect } from 'react';
import { ChemistryLab } from './components/chemistry/ChemistryLab';
import { PhysicsLab } from './components/physics/PhysicsLab';
import { AIAssistant } from './components/ai/AIAssistant';
import { AIButton } from './components/ai/AIButton';
import { Settings } from './components/settings/Settings';
import { ChatHistory } from './components/ai/ChatHistory';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};

const Lab = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { getTourStatus, setTourStatus } = useAppwrite();
  const [activeTab, setActiveTab] = useState<'chemistry' | 'physics'>('chemistry');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome tour based on Appwrite or localStorage
    const checkTourStatus = async () => {
      try {
        const isTourShown = await getTourStatus();
        // Only show tour if it hasn't been shown yet
        if (!isTourShown) {
          setShowWelcomeTour(true);
        }
      } catch (error) {
        console.error('Error checking tour status:', error);
        // Fallback to localStorage approach
        const savedSettings = localStorage.getItem('userSettings');
        let isTourShown = false;
        
        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings);
            isTourShown = settings.isTourShown || false;
          } catch (e) {
            console.error('Failed to parse user settings', e);
          }
        }

        // Only show tour if it hasn't been shown yet
        if (!isTourShown) {
          setShowWelcomeTour(true);
        }
      }
    };

    checkTourStatus();

    // Welcome message - only show once per session
    if (user?.name && !hasShownWelcome) {
      setHasShownWelcome(true);
      showToast(`Welcome back, ${user?.name}!`, 'success');
    }
  }, [user, showToast, hasShownWelcome, getTourStatus]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            🧪 Virtual Science Lab
          </h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {user?.name}
            </span>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-2xl"
              title="Chat History"
            >
              💬
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-2xl"
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setActiveTab('chemistry');
              setTimeout(() => showToast('Switched to Chemistry Lab', 'info'), 0);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'chemistry'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
          >
            🧪 Chemistry
          </button>
          <button
            onClick={() => {
              setActiveTab('physics');
              setTimeout(() => showToast('Switched to Physics Lab', 'info'), 0);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'physics'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
          >
            ⚡ Physics
          </button>
        </div>

        {activeTab === 'chemistry' && <ChemistryLab />}
        {activeTab === 'physics' && <PhysicsLab />}
      </main>

      <AIButton onClick={() => setIsAIOpen(true)} />
      <AIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        context={activeTab}
      />
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ChatHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      {showWelcomeTour && (
        <WelcomeTour onComplete={async () => {
          setShowWelcomeTour(false);
          // Save that tour has been shown using Appwrite or fallback to localStorage
          try {
            await setTourStatus(true);
          } catch (error) {
            console.error('Error saving tour status:', error);
            // Fallback to localStorage
            const savedSettings = localStorage.getItem('userSettings');
            if (savedSettings) {
              try {
                const settings = JSON.parse(savedSettings);
                settings.isTourShown = true;
                localStorage.setItem('userSettings', JSON.stringify(settings));
              } catch (e) {
                console.error('Failed to update user settings', e);
              }
            } else {
              // Create settings with tour shown
              localStorage.setItem('userSettings', JSON.stringify({
                theme: 'system',
                notifications: true,
                soundEffects: true,
                autoSaveExperiments: false,
                defaultLab: 'chemistry',
                isTourShown: true
              }));
            }
          }
        }} />
      )}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppwriteProvider>
            <ChatHistoryProvider>
              <ToastProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/lab" element={
                      <ProtectedRoute>
                        <Lab />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/lab" />} />
                  </Routes>
                </BrowserRouter>
              </ToastProvider>
            </ChatHistoryProvider>
          </AppwriteProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;