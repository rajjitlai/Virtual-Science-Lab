import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MagicURLLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(true);
  const { createMagicURLToken, updateMagicURLSession } = useAuth();

  // Check for magic URL parameters in the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');

    if (secret && userId) {
      handleMagicURLLogin(userId, secret);
      setShowForm(false);
    }
  }, []);

  const handleMagicURLLogin = async (userId: string, secret: string) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await updateMagicURLSession(userId, secret);
      setMessage('Successfully logged in! You will be redirected shortly.');
      // Redirect to home page after successful login
      setTimeout(() => {
        window.location.hash = '';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to verify magic URL');
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMagicURL = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await createMagicURLToken(userId, email);
      setMessage('Magic URL sent to your email. Please check your inbox and click the link.');
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Magic URL Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleRequestMagicURL}>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-gray-700 font-medium mb-2">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Sending Magic URL...' : 'Send Magic URL'}
          </button>
        </form>
      )}

      {!showForm && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please check your email for the magic link.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Resend Magic URL
          </button>
        </div>
      )}
    </div>
  );
};

export default MagicURLLogin;