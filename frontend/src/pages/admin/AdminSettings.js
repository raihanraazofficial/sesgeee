import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, CheckCircle, AlertCircle, Settings, RefreshCw, Calendar, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { initializeFirestore } from '../../utils/initFirestore';
import { useData } from '../../contexts/DataContext';

const AdminSettings = () => {
  const [initLoading, setInitLoading] = useState(false);
  const [initSuccess, setInitSuccess] = useState(false);
  const [initError, setInitError] = useState(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState('');
  const [calendarLoading, setCalendarLoading] = useState(false);
  
  const { fetchData, createItem, updateItem } = useData();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await fetchData('settings');
      if (settings && settings.length > 0) {
        const settingsData = settings[0];
        setCalendarUrl(settingsData.google_calendar_url || '');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveCalendar = async () => {
    if (!calendarUrl.trim()) {
      toast.error('Please enter a valid Google Calendar URL');
      return;
    }

    setCalendarLoading(true);
    try {
      const settings = await fetchData('settings');
      const settingsData = {
        google_calendar_url: calendarUrl.trim(),
        updated_at: new Date().toISOString()
      };

      if (settings && settings.length > 0) {
        // Update existing settings
        await updateItem('settings', settings[0].id, settingsData);
      } else {
        // Create new settings
        await createItem('settings', settingsData);
      }

      toast.success('Google Calendar settings saved successfully!');
    } catch (error) {
      console.error('Error saving calendar settings:', error);
      toast.error('Failed to save calendar settings');
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleTestCalendar = () => {
    if (!calendarUrl.trim()) {
      toast.error('Please enter a Google Calendar URL first');
      return;
    }
    
    // Open calendar in new tab to test
    window.open(calendarUrl, '_blank');
    toast.info('Calendar opened in new tab for testing');
  };

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
          fetchData('achievements')
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
        fetchData('researchAreas')
      ]);
      setRefreshLoading(false);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setRefreshLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold font-heading text-gray-900">Admin Settings</h1>
                <p className="text-gray-600 mt-1">Manage system configuration and database</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Database Management Section */}
          <div className="glass rounded-xl p-8 border border-gray-200 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="h-8 w-8 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Initialize Database Card */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Initialize Database</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Create admin user and populate database with sample data for People, Publications, Projects, and Achievements.
                </p>
                
                {initSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-green-700 text-sm">Database initialized successfully!</p>
                    </div>
                  </div>
                )}

                {initError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="text-red-700 text-sm">Error: {initError}</p>
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
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Refresh Data</h3>
                <p className="text-gray-600 text-sm mb-4">
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
          <div className="glass rounded-xl p-8 border border-gray-200 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-8 w-8 text-secondary-600" />
              <h2 className="text-2xl font-bold text-gray-900">System Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">v1.0.0</div>
                <div className="text-gray-600 text-sm">System Version</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">Firebase</div>
                <div className="text-gray-600 text-sm">Database Type</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">React</div>
                <div className="text-gray-600 text-sm">Frontend Framework</div>
              </div>
            </div>
          </div>

          {/* Google Calendar Integration */}
          <div className="glass rounded-xl p-8 border border-gray-200 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Google Calendar Integration</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Events Calendar Setup</h3>
              <p className="text-gray-600 text-sm mb-4">
                Set up Google Calendar integration for displaying upcoming events.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Calendar Embed URL
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://calendar.google.com/calendar/embed?src=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get the embed URL from Google Calendar → Settings → Integrate Calendar → Embed Code
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="btn-primary">
                    Save Calendar Settings
                  </button>
                  <button className="btn-secondary">
                    Test Calendar
                  </button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">How to get Google Calendar embed URL:</h4>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to Google Calendar and create/select your events calendar</li>
                  <li>Click on Settings (gear icon) → Settings</li>
                  <li>Select your calendar from the left sidebar</li>
                  <li>Scroll down to "Integrate calendar" section</li>
                  <li>Copy the "Embed code" URL (the src attribute of the iframe)</li>
                  <li>Paste it above and save</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Admin Credentials */}
          <div className="glass rounded-xl p-8 border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Credentials</h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                  <input 
                    type="text" 
                    value="admin" 
                    readOnly 
                    className="form-input bg-gray-100 cursor-not-allowed opacity-75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                  <input 
                    type="password" 
                    value="@dminsesg705" 
                    readOnly 
                    className="form-input bg-gray-100 cursor-not-allowed opacity-75"
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