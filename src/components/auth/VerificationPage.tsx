import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { account } from '../../config/appwrite';
import { useToast } from '../../contexts/ToastContext';

export const VerificationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const userId = searchParams.get('userId');
                const secret = searchParams.get('secret');

                if (!userId || !secret) {
                    setStatus('error');
                    setMessage('Invalid verification link. Please try again.');
                    return;
                }

                await account.updateVerification(userId, secret);
                setStatus('success');
                setMessage('Email verified successfully! Redirecting to lab...');
                showToast('Email verified successfully!', 'success');

                // Redirect to lab after 2 seconds
                setTimeout(() => {
                    navigate('/lab');
                }, 2000);
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('Failed to verify email. The link may be expired or invalid.');
            }
        };

        verifyEmail();
    }, [searchParams, navigate, showToast]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-96 text-center">
                <div className="mb-6">
                    {status === 'verifying' && (
                        <div className="w-16 h-16 mx-auto mb-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <span className="text-3xl text-green-600 dark:text-green-400">✅</span>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                            <span className="text-3xl text-red-600 dark:text-red-400">❌</span>
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    {status === 'verifying' && 'Verifying Email...'}
                    {status === 'success' && 'Email Verified!'}
                    {status === 'error' && 'Verification Failed'}
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {message}
                </p>

                {status === 'error' && (
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Back to Login
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Redirecting to lab in a few seconds...
                    </div>
                )}
            </div>
        </div>
    );
};
