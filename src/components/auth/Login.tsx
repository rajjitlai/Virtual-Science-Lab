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
    const [useMagicURL, setUseMagicURL] = useState(false);

    const { login, register, loginWithMagicURL } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (useMagicURL) {
                await loginWithMagicURL(email);
                alert('Magic link sent! Check your email.');
            } else if (isLogin) {
                await login(email, password);
                navigate('/lab');
            } else {
                await register(email, password, name);
                navigate('/lab');
            }
        } catch (err) {
            const authError = err as AuthError;
            setError(authError.message || 'Authentication failed');
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

                    {!useMagicURL && (
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                            required
                        />
                    )}

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                        {useMagicURL ? 'Send Magic Link' : isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <div className="mt-4 text-center space-y-2">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 dark:text-indigo-400 text-sm"
                    >
                        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                    </button>

                    <button
                        onClick={() => setUseMagicURL(!useMagicURL)}
                        className="block w-full text-gray-600 dark:text-gray-400 text-sm"
                    >
                        {useMagicURL ? 'Use password instead' : 'Use magic link instead'}
                    </button>
                </div>
            </div>
        </div>
    );
};