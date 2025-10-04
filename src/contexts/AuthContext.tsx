import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { account, databases, DATABASE_ID, COLLECTION_USER_SETTINGS } from '../config/appwrite';
import { Models } from 'appwrite';

interface UserSettings {
  theme: 'light' | 'dark';
  avatar?: string;
  notifications: boolean;
}

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  userSettings: UserSettings | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  // Magic URL functions
  createMagicURLToken: (userId: string, email: string) => Promise<void>;
  updateMagicURLSession: (userId: string, secret: string) => Promise<void>;
  // User settings functions
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  loadUserSettings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const user = await account.get();
      setUser(user);
      await loadUserSettings();
    } catch (error) {
      console.error('User not authenticated:', error);
      setUser(null);
      setUserSettings(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setUser(user);
      await loadUserSettings();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await account.create('unique()', email, password, name);
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setUserSettings(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Magic URL functions
  const createMagicURLToken = async (userId: string, email: string) => {
    try {
      await account.createMagicURLToken(userId, email);
    } catch (error) {
      console.error('Magic URL token creation error:', error);
      throw error;
    }
  };

  const updateMagicURLSession = async (userId: string, secret: string) => {
    try {
      await account.updateMagicURLSession(userId, secret);
      const user = await account.get();
      setUser(user);
      await loadUserSettings();
    } catch (error) {
      console.error('Magic URL session update error:', error);
      throw error;
    }
  };

  // User settings functions
  const loadUserSettings = async () => {
    if (!user) return;

    try {
      // Try to get existing settings
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_USER_SETTINGS,
        [
          `userId=${user.$id}`
        ]
      );

      if (response.documents.length > 0) {
        const settings = response.documents[0];
        setUserSettings({
          theme: settings.theme || 'light',
          avatar: settings.avatar,
          notifications: settings.notifications ?? true
        });
      } else {
        // Create default settings if none exist
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_USER_SETTINGS,
          'unique()',
          {
            userId: user.$id,
            theme: 'light',
            notifications: true
          }
        );
        setUserSettings({
          theme: 'light',
          notifications: true
        });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      // Set default settings if there's an error
      setUserSettings({
        theme: 'light',
        notifications: true
      });
    }
  };

  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      // Get existing settings document ID
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_USER_SETTINGS,
        [
          `userId=${user.$id}`
        ]
      );

      if (response.documents.length > 0) {
        const docId = response.documents[0].$id;
        // Update existing settings
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_USER_SETTINGS,
          docId,
          settings
        );
      } else {
        // Create new settings if none exist
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_USER_SETTINGS,
          'unique()',
          {
            userId: user.$id,
            ...settings
          }
        );
      }

      // Update local state
      setUserSettings(prev => ({
        ...prev,
        ...settings
      } as UserSettings));
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  };

  const value = {
    user,
    userSettings,
    loading,
    login,
    register,
    logout,
    initAuth,
    createMagicURLToken,
    updateMagicURLSession,
    updateUserSettings,
    loadUserSettings
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};