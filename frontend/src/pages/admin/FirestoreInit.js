import React, { useState } from 'react';
import { initializeFirestore } from '../../utils/initFirestore';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';

const FirestoreInit = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInitialize = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await initializeFirestore();
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="glass rounded-xl p-8 text-center">
          <Database className="h-16 w-16 text-primary-400 mx-auto mb-6" />
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Initialize Firestore Database
          </h2>
          
          <p className="text-gray-400 mb-6">
            This will create admin user and sample data in your Firestore database.
          </p>

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 text-sm">
                Firestore database initialized successfully!
              </p>
              <p className="text-green-300 text-xs mt-2">
                You can now login with: admin / @dminsesg705
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400 mx-auto mb-2" />
              <p className="text-red-400 text-sm">
                Error: {error}
              </p>
            </div>
          )}

          <button
            onClick={handleInitialize}
            disabled={loading || success}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="spinner mr-2" />
                Initializing...
              </>
            ) : success ? (
              'Database Initialized ✓'
            ) : (
              'Initialize Database'
            )}
          </button>

          {success && (
            <div className="mt-6">
              <a
                href="/admin/login"
                className="text-primary-400 hover:text-primary-300 text-sm"
              >
                Go to Admin Login →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirestoreInit;