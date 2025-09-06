import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Database, CheckCircle, AlertCircle, Settings, Trash2, RefreshCw } from 'lucide-react';
import { initializeFirestore } from '../../utils/initFirestore';
import { useData } from '../../contexts/DataContext';

const AdminSettings = () => {
  const [initLoading, setInitLoading] = useState(false);
  const [initSuccess, setInitSuccess] = useState(false);
  const [initError, setInitError] = useState(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  
  const { fetchData } = useData();

  const handleInitializeDatabase = async () => {
    setInitLoading(true);
    setInitError(null);
    setInitSuccess(false);
    
    try {
      await initializeFirestore();
      setInitSuccess(true);
      setInitLoading(false);
      
      // Refresh all data after initialization
      setTimeout(async () => {
        await Promise.all([
          fetchData('people'),
          fetchData('publications'),
          fetchData('projects'),
          fetchData('achievements'),
          fetchData('news')
        ]);
      }, 1000);
      
    } catch (err) {
      setInitError(err.message);
      setInitLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setRefreshLoading(true);
    try {
      await Promise.all([
        fetchData('people'),
        fetchData('publications'),
        fetchData('projects'),
        fetchData('achievements'),
        fetchData('news'),
        fetchData('researchAreas')
      ]);
      setRefreshLoading(false);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setRefreshLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold font-heading text-white">Admin Settings</h1>
                <p className="text-gray-400 mt-1">Manage system configuration and database</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Database Management Section */}
          <div className="glass rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="h-8 w-8 text-primary-400" />
              <h2 className="text-2xl font-bold text-white">Database Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Initialize Database Card */}
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Initialize Database</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Create admin user and populate database with sample data for People, Publications, Projects, Achievements, and News.
                </p>
                
                {initSuccess && (
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <p className="text-green-400 text-sm">Database initialized successfully!</p>
                    </div>
                  </div>
                )}

                {initError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <p className="text-red-400 text-sm">Error: {initError}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleInitializeDatabase}
                  disabled={initLoading || initSuccess}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {initLoading ? (
                    <>
                      <div className="spinner" />
                      <span>Initializing...</span>
                    </>
                  ) : initSuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Initialized ✓</span>
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      <span>Initialize Database</span>
                    </>
                  )}
                </button>
              </div>

              {/* Refresh Data Card */}
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Refresh Data</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Refresh all data from Firestore database to sync the latest changes across all admin panels.
                </p>

                <button
                  onClick={handleRefreshData}
                  disabled={refreshLoading}
                  className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {refreshLoading ? (
                    <>
                      <div className="spinner" />
                      <span>Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh All Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="glass rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-8 w-8 text-secondary-400" />
              <h2 className="text-2xl font-bold text-white">System Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400 mb-2">v1.0.0</div>
                <div className="text-gray-400 text-sm">System Version</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">Firebase</div>
                <div className="text-gray-400 text-sm">Database Type</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">React</div>
                <div className="text-gray-400 text-sm">Frontend Framework</div>
              </div>
            </div>
          </div>

          {/* Admin Credentials */}
          <div className="glass rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Credentials</h2>
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                  <input 
                    type="text" 
                    value="admin" 
                    readOnly 
                    className="form-input bg-gray-800 cursor-not-allowed opacity-75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                  <input 
                    type="password" 
                    value="@dminsesg705" 
                    readOnly 
                    className="form-input bg-gray-800 cursor-not-allowed opacity-75"
                  />
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-3">
                These credentials are stored in Firestore database and used for admin authentication.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;