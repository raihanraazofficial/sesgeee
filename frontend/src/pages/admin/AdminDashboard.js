import React, { useState, useEffect, useCallback } from 'react';
import { Users, FileText, FolderOpen, Award, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const { people, publications, projects, achievements, fetchData } = useData();
  const [stats, setStats] = useState([
    { name: 'Total People', value: '0', icon: Users, color: 'text-blue-400' },
    { name: 'Publications', value: '0', icon: FileText, color: 'text-green-400' },
    { name: 'Projects', value: '0', icon: FolderOpen, color: 'text-purple-400' },
    { name: 'Achievements', value: '0', icon: Award, color: 'text-yellow-400' },
  ]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all data from Firestore
      await Promise.all([
        fetchData('people'),
        fetchData('publications'),
        fetchData('projects'),
        fetchData('achievements'),
        fetchData('news')
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    // Update stats when data changes
    setStats([
      { name: 'Total People', value: people.length.toString(), icon: Users, color: 'text-blue-400' },
      { name: 'Publications', value: publications.length.toString(), icon: FileText, color: 'text-green-400' },
      { name: 'Projects', value: projects.length.toString(), icon: FolderOpen, color: 'text-purple-400' },
      { name: 'Achievements', value: achievements.length.toString(), icon: Award, color: 'text-yellow-400' },
    ]);
    setLoading(false);
  }, [people, publications, projects, achievements]);

  const quickActions = [
    { name: 'Manage People', href: '/admin/people', icon: Users },
    { name: 'Publications', href: '/admin/publications', icon: FileText },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'News & Events', href: '/admin/news', icon: Calendar },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold font-heading text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {user?.username}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="glass rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">
                        {loading ? (
                          <div className="animate-pulse">
                            <div className="h-8 bg-gray-700 rounded w-12"></div>
                          </div>
                        ) : (
                          stat.value
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-heading text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="glass rounded-xl p-6 card-hover group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">
                      {action.name}
                    </h3>
                    <p className="text-gray-400 text-sm">Manage and update content</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-2xl font-bold font-heading text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-dark-700 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white">System initialized successfully</p>
                <p className="text-gray-400 text-sm">Welcome to SESGRG Admin Portal</p>
              </div>
              <span className="text-gray-400 text-sm">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;