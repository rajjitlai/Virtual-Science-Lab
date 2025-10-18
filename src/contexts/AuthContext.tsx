import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { account } from '../config/appwrite';
import type { Models } from 'appwrite';

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    sendVerificationEmail: () => Promise<void>;
    isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Separate component for the provider to fix fast refresh issue
const AuthProviderComponent = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
            setIsEmailVerified(currentUser.emailVerification);
        } catch (error) {
            console.debug('No user session found:', error);
            setUser(null);
            setIsEmailVerified(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        await account.createEmailPasswordSession(email, password);
        await checkUser();
    };

    const register = async (email: string, password: string, name: string) => {
        await account.create('unique()', email, password, name);
        await login(email, password);
    };

    const logout = async () => {
        await account.deleteSession('current');
        setUser(null);
    };

    const sendVerificationEmail = async () => {
        if (!user) throw new Error('No user logged in');
        await account.createVerification(`${window.location.origin}/verify`);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, sendVerificationEmail, isEmailVerified }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthProvider = AuthProviderComponent;

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};