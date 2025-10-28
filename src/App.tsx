import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatHistoryProvider } from './contexts/ChatHistoryContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { AppwriteProvider, useAppwrite } from './contexts/AppwriteContext';
import { SimulatorProvider } from './contexts/SimulatorContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { DemoProvider } from './contexts/DemoContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingScreen } from './components/common/LoadingScreen';
import { WelcomeTour } from './components/common/WelcomeTour';
import { MobileNav } from './components/common/MobileNav';
import { PerformanceMonitor } from './components/common/PerformanceMonitor';
import { Analytics } from './components/common/Analytics';
import { Login } from './components/auth/Login';
import { VerificationPage } from './components/auth/VerificationPage';
import { useState, useEffect, lazy, Suspense } from 'react';
const ChemistryLab = lazy(() => import('./components/chemistry/ChemistryLab').then(m => ({ default: m.ChemistryLab })));
const PhysicsLab = lazy(() => import('./components/physics/PhysicsLab').then(m => ({ default: m.PhysicsLab })));
const AIAssistant = lazy(() => import('./components/ai/AIAssistant').then(m => ({ default: m.AIAssistant })));
const AIButton = lazy(() => import('./components/ai/AIButton').then(m => ({ default: m.AIButton })));
const Settings = lazy(() => import('./components/settings/Settings').then(m => ({ default: m.Settings })));
const ChatHistory = lazy(() => import('./components/ai/ChatHistory').then(m => ({ default: m.ChatHistory })));
import type { UserSettings } from './types/settings';
import type { ChatSession } from './types/chat';
import { DEFAULT_SETTINGS } from './types/settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) return <Navigate to="/lab" />;

  return <>{children}</>;
};

const Lab = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { getTourStatus, setTourStatus, getUserSettings, saveUserSettings, isCloudStorage } = useAppwrite();
  const [activeTab, setActiveTab] = useState<'chemistry' | 'physics'>('chemistry');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [continuedChat, setContinuedChat] = useState<{ messages: any[]; context?: 'chemistry' | 'physics' } | null>(null);
  const [isContinuingChat, setIsContinuingChat] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [showPerformance, setShowPerformance] = useState(false);
  const [focusLab, setFocusLab] = useState<'chemistry' | 'physics' | null>(null);

  useEffect(() => {
    // Load user settings
    const loadUserSettings = async () => {
      try {
        const settings = await getUserSettings();
        const isTourShown = await getTourStatus();

        if (settings) {
          // Combine settings with tour status
          const combinedSettings = {
            ...settings,
            isTourShown: isTourShown || false
          };

          setUserSettings(combinedSettings);
          // Apply theme from settings
          if (combinedSettings.theme !== 'system') {
            document.documentElement.classList.toggle('dark', combinedSettings.theme === 'dark');
          }
          // Set the default lab from settings
          setActiveTab(combinedSettings.defaultLab);
        }
      } catch (error) {
        console.error('Error loading user settings from Appwrite:', error);
      }
    };

    loadUserSettings();
  }, [getUserSettings, getTourStatus]);

  useEffect(() => {
    // Check if user has seen welcome tour
    const checkTourStatus = async () => {
      try {
        const isTourShown = await getTourStatus();
        // Only show tour if it hasn't been shown yet
        if (!isTourShown) {
          setShowWelcomeTour(true);
        }
      } catch (error) {
        console.error('Error checking tour status:', error);
        // If Appwrite is not configured, we can't show the tour
        if (!isCloudStorage) {
          console.warn('Appwrite not configured - tour functionality disabled');
        }
      }
    };

    checkTourStatus();

    // Welcome message - only show once per session
    if (user?.name && !hasShownWelcome) {
      setHasShownWelcome(true);
      showToast(`Welcome back, ${user?.name}!`, 'success');
    }
  }, [user, showToast, hasShownWelcome, getTourStatus, isCloudStorage]);

  // Listen for focusLab change from DemoMode
  useEffect(() => {
    if (focusLab) {
      setActiveTab(focusLab);
      setFocusLab(null);
    }
  }, [focusLab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onHistoryClick={() => setIsHistoryOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAnalyticsClick={() => setIsAnalyticsOpen(true)}
        userName={user?.name}
      />

      <main className="container mx-auto p-6">
        {/* Desktop Tab Navigation - Hidden on mobile */}
        <div className="hidden lg:flex gap-4 mb-6">
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

        <Suspense fallback={<LoadingScreen />}>
          {activeTab === 'chemistry' && <ChemistryLab />}
          {activeTab === 'physics' && <PhysicsLab />}
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <AIButton onClick={() => setIsAIOpen(true)} />
        <AIAssistant
          isOpen={isAIOpen}
          onClose={() => {
            setIsAIOpen(false);
            // Reset continued chat state after a delay to allow close animation
            setTimeout(() => {
              setContinuedChat(null);
              setIsContinuingChat(false);
            }, 300);
          }}
          context={continuedChat?.context || activeTab}
          initialMessages={continuedChat?.messages || []}
          isContinuedChat={isContinuingChat}
        />
        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          initialSettings={userSettings}
          onSaveSettings={saveUserSettings}
        />
        <ChatHistory
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onContinueChat={(session: ChatSession) => {
            setContinuedChat({ messages: session.messages, context: (session.context as 'chemistry' | 'physics') || activeTab });
            setIsContinuingChat(true);
            setIsAIOpen(true);
          }}
        />
        <PerformanceMonitor
          isVisible={showPerformance}
          onToggle={() => setShowPerformance(!showPerformance)}
        />
        <Analytics
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
        />
      </Suspense>

      {/* Performance Toggle - Hidden on mobile */}
      <button
        onClick={() => setShowPerformance(!showPerformance)}
        className="hidden lg:block fixed bottom-6 left-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg z-40"
        title="Toggle Performance Monitor"
      >
        📊
      </button>

      {showWelcomeTour && (
        <WelcomeTour onComplete={async () => {
          setShowWelcomeTour(false);
          // Save that tour has been shown
          try {
            await setTourStatus(true);
          } catch (error) {
            console.error('Error saving tour status:', error);
            if (!isCloudStorage) {
              console.warn('Appwrite not configured - tour status not saved');
            }
          }
        }} />
      )
      }
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
              <SimulatorProvider>
                <ToastProvider>
                  <SettingsProvider>
                    <DemoProvider>
                      <BrowserRouter>
                        <Routes>
                          <Route path="/login" element={
                            <AuthRedirect>
                              <Login />
                            </AuthRedirect>
                          } />
                          <Route path="/verify" element={<VerificationPage />} />
                          <Route path="/lab" element={
                            <ProtectedRoute>
                              <Lab />
                            </ProtectedRoute>
                          } />
                          <Route path="/" element={<Navigate to="/lab" />} />
                        </Routes>
                      </BrowserRouter>
                    </DemoProvider>
                  </SettingsProvider>
                </ToastProvider>
              </SimulatorProvider>
            </ChatHistoryProvider>
          </AppwriteProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;