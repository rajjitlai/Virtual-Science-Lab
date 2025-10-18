import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthError {
    message: string;
    code?: number;
}

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { login, register, sendVerificationEmail, isEmailVerified, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (isLogin) {
                await login(email, password);
                navigate('/lab');
            } else {
                await register(email, password, name);
                setSuccess('Account created! Please check your email to verify your account.');
            }
        } catch (err) {
            const authError = err as AuthError;
            setError(authError.message || 'Authentication failed');
        }
    };

    const handleSendVerification = async () => {
        try {
            await sendVerificationEmail();
            setSuccess('Verification email sent! Check your inbox.');
        } catch (err) {
            const authError = err as AuthError;
            setError(authError.message || 'Failed to send verification email');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-96">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    🧪 Science Lab
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                            required
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        required
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                {/* Email Verification Status */}
                {user && !isEmailVerified && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                        <div className="flex items-center mb-2">
                            <span className="text-yellow-600 dark:text-yellow-400 text-lg mr-2">⚠️</span>
                            <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
                                Email Not Verified
                            </p>
                        </div>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                            Please verify your email address to access all features.
                        </p>
                        <button
                            onClick={handleSendVerification}
                            className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 text-sm"
                        >
                            Send Verification Email
                        </button>
                    </div>
                )}

                {/* Email Verification Success */}
                {user && isEmailVerified && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                        <div className="flex items-center">
                            <span className="text-green-600 dark:text-green-400 text-lg mr-2">✅</span>
                            <p className="text-green-800 dark:text-green-200 font-semibold">
                                Email Verified
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 dark:text-indigo-400 text-sm"
                    >
                        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};