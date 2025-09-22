import React, { useState, useEffect, useCallback } from 'react';
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
  const [projectDateDisplay, setProjectDateDisplay] = useState('dateRange'); // 'year' or 'dateRange'
  const [projectDateFormat, setProjectDateFormat] = useState('monthYear'); // 'monthYear' or 'fullDate' or 'shortDate'
  const [projectSettingsLoading, setProjectSettingsLoading] = useState(false);
  
  const { fetchData, createItem, updateItem } = useData();

  const loadSettings = useCallback(async () => {
    try {
      const settings = await fetchData('settings');
      if (settings && settings.length > 0) {
        const settingsData = settings[0];
        setCalendarUrl(settingsData.google_calendar_url || '');
        setProjectDateDisplay(settingsData.project_date_display || 'dateRange');
        setProjectDateFormat(settingsData.project_date_format || 'monthYear');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, [fetchData]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

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

  const handleSaveProjectSettings = async () => {
    setProjectSettingsLoading(true);
    try {
      const settings = await fetchData('settings');
      const settingsData = {
        project_date_display: projectDateDisplay,
        project_date_format: projectDateFormat,
        updated_at: new Date().toISOString()
      };

      if (settings && settings.length > 0) {
        // Update existing settings
        const currentSettings = settings[0];
        const updatedSettings = { ...currentSettings, ...settingsData };
        await updateItem('settings', settings[0].id, updatedSettings);
      } else {
        // Create new settings with default calendar URL
        const newSettings = {
          ...settingsData,
          google_calendar_url: calendarUrl || 'https://calendar.google.com/calendar/embed?src=en.bd%23holiday%40group.v.calendar.google.com&ctz=Asia%2FDhaka'
        };
        await createItem('settings', newSettings);
      }

      toast.success('Project display settings saved successfully!');
    } catch (error) {
      console.error('Error saving project settings:', error);
      toast.error('Failed to save project settings');
    } finally {
      setProjectSettingsLoading(false);
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
                    value={calendarUrl}
                    onChange={(e) => setCalendarUrl(e.target.value)}
                    placeholder="https://calendar.google.com/calendar/embed?src=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get the embed URL from Google Calendar → Settings → Integrate Calendar → Embed Code
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleSaveCalendar}
                    disabled={calendarLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {calendarLoading ? (
                      <>
                        <div className="spinner" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Calendar Settings</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleTestCalendar}
                    className="btn-secondary"
                  >
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

          {/* Project Display Settings */}
          <div className="glass rounded-xl p-8 border border-gray-200 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Project Display Settings</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Date Display Configuration</h3>
              <p className="text-gray-600 text-sm mb-4">
                Configure how project dates are displayed on the projects page cards.
              </p>
              
              <div className="space-y-6">
                {/* Display Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Date Display Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="dateDisplay" 
                        value="year"
                        checked={projectDateDisplay === 'year'}
                        onChange={(e) => setProjectDateDisplay(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        projectDateDisplay === 'year' 
                          ? 'border-primary-600 bg-primary-600' 
                          : 'border-gray-300'
                      }`}>
                        {projectDateDisplay === 'year' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Year Only</div>
                        <div className="text-sm text-gray-500">Display: "2024"</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="dateDisplay" 
                        value="dateRange"
                        checked={projectDateDisplay === 'dateRange'}
                        onChange={(e) => setProjectDateDisplay(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        projectDateDisplay === 'dateRange' 
                          ? 'border-primary-600 bg-primary-600' 
                          : 'border-gray-300'
                      }`}>
                        {projectDateDisplay === 'dateRange' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">📅 Date Range</div>
                        <div className="text-sm text-gray-500">Display with calendar icon</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Date Format Selection (only shown when dateRange is selected) */}
                {projectDateDisplay === 'dateRange' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Date Format
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                        <input 
                          type="radio" 
                          name="dateFormat" 
                          value="monthYear"
                          checked={projectDateFormat === 'monthYear'}
                          onChange={(e) => setProjectDateFormat(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          projectDateFormat === 'monthYear' 
                            ? 'border-primary-600 bg-primary-600' 
                            : 'border-gray-300'
                        }`}>
                          {projectDateFormat === 'monthYear' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Month Year Format</div>
                          <div className="text-sm text-gray-500">Jan 2024 - Dec 2024 / Jan 2024 - Ongoing</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                        <input 
                          type="radio" 
                          name="dateFormat" 
                          value="fullDate"
                          checked={projectDateFormat === 'fullDate'}
                          onChange={(e) => setProjectDateFormat(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          projectDateFormat === 'fullDate' 
                            ? 'border-primary-600 bg-primary-600' 
                            : 'border-gray-300'
                        }`}>
                          {projectDateFormat === 'fullDate' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Full Date Format</div>
                          <div className="text-sm text-gray-500">15 Jan 2024 - 20 Dec 2024 / 15 Jan 2024 - Ongoing</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                        <input 
                          type="radio" 
                          name="dateFormat" 
                          value="shortDate"
                          checked={projectDateFormat === 'shortDate'}
                          onChange={(e) => setProjectDateFormat(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          projectDateFormat === 'shortDate' 
                            ? 'border-primary-600 bg-primary-600' 
                            : 'border-gray-300'
                        }`}>
                          {projectDateFormat === 'shortDate' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Short Date Format</div>
                          <div className="text-sm text-gray-500">2024-01-15 - 2024-12-20 / 2024-01-15 - Ongoing</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleSaveProjectSettings}
                    disabled={projectSettingsLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {projectSettingsLoading ? (
                      <>
                        <div className="spinner" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Project Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h4>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li><strong>Year Only:</strong> Shows just the year (ongoing: start year, completed: end year)</li>
                  <li><strong>Date Range:</strong> Shows calendar icon with start-end date range</li>
                  <li><strong>Month Year:</strong> Jan 2024 - Dec 2024 format</li>
                  <li><strong>Full Date:</strong> 15 Jan 2024 - 20 Dec 2024 format</li>
                  <li><strong>Short Date:</strong> 2024-01-15 - 2024-12-20 format</li>
                  <li>For ongoing projects: End date shows as "Ongoing"</li>
                </ul>
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