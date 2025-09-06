import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Trophy, Award, DollarSign, Users, Search, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AdminAchievements = () => {
  const { achievements, fetchData, createItem, updateItem, deleteItem, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    description: '',
    category: 'award',
    amount: '',
    recipient: '',
    organization: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData('achievements');
  }, [fetchData]);

  const categories = [
    { value: 'all', label: 'All Categories', icon: Trophy },
    { value: 'award', label: 'Awards', icon: Award },
    { value: 'funding', label: 'Funding', icon: DollarSign },
    { value: 'recognition', label: 'Recognition', icon: Users },
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = (achievement.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (achievement.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const achievementData = {
        ...formData,
        year: parseInt(formData.year),
      };

      if (editingAchievement) {
        await updateItem('achievements', editingAchievement.id, achievementData);
      } else {
        await createItem('achievements', achievementData);
      }

      // Reset form
      setFormData({
        name: '',
        year: new Date().getFullYear(),
        description: '',
        category: 'award',
        amount: '',
        recipient: '',
        organization: ''
      });
      setShowModal(false);
      setEditingAchievement(null);
      
      // Refresh data
      await fetchData('achievements');
    } catch (error) {
      console.error('Error saving achievement:', error);
      alert('Error saving achievement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      name: achievement.name || '',
      year: achievement.year || new Date().getFullYear(),
      description: achievement.description || '',
      category: achievement.category || 'award',
      amount: achievement.amount || '',
      recipient: achievement.recipient || '',
      organization: achievement.organization || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await deleteItem('achievements', id);
        await fetchData('achievements');
      } catch (error) {
        console.error('Error deleting achievement:', error);
        alert('Error deleting achievement. Please try again.');
      }
    }
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : Award;
  };

  const getCategoryColor = (category) => {
    const colors = {
      award: 'text-yellow-400',
      funding: 'text-green-400',
      recognition: 'text-blue-400'
    };
    return colors[category] || 'text-gray-400';
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
                <h1 className="text-3xl font-bold font-heading text-white">Manage Achievements</h1>
                <p className="text-gray-400 mt-1">Add, edit, and manage achievements</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditingAchievement(null);
                setFormData({
                  name: '',
                  year: new Date().getFullYear(),
                  description: '',
                  category: 'award',
                  amount: '',
                  recipient: '',
                  organization: ''
                });
                setShowModal(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Achievement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select min-w-[150px]"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Achievements List */}
        <div className="space-y-6">
          {loading.achievements ? (
            <div className="glass rounded-xl p-8 text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || selectedCategory !== 'all' ? 'No achievements found' : 'No achievements yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search criteria' 
                  : 'Start by adding your first achievement'}
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn-primary"
                >
                  Add Achievement
                </button>
              )}
            </div>
          ) : (
            filteredAchievements.map((achievement) => {
              const CategoryIcon = getCategoryIcon(achievement.category);
              return (
                <div key={achievement.id} className="glass rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0`}>
                        <CategoryIcon className={`h-6 w-6 text-white`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{achievement.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)} bg-gray-800`}>
                            {achievement.category}
                          </span>
                          <span className="text-gray-400 text-sm">{achievement.year}</span>
                        </div>
                        <p className="text-gray-300 mb-3">{achievement.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          {achievement.recipient && (
                            <span><strong>Recipient:</strong> {achievement.recipient}</span>
                          )}
                          {achievement.organization && (
                            <span><strong>Organization:</strong> {achievement.organization}</span>
                          )}
                          {achievement.amount && (
                            <span><strong>Amount:</strong> {achievement.amount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(achievement)}
                        className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
                        title="Edit achievement"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(achievement.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete achievement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Achievement Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input w-full"
                  placeholder="Enter achievement name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="form-select w-full"
                  >
                    <option value="award">Award</option>
                    <option value="funding">Funding</option>
                    <option value="recognition">Recognition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max="2099"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    className="form-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-textarea w-full"
                  placeholder="Enter achievement description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient
                  </label>
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                    className="form-input w-full"
                    placeholder="Person or team who received the achievement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    className="form-input w-full"
                    placeholder="Awarding organization"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (for funding achievements)
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="form-input w-full"
                  placeholder="e.g., 2.5M BDT, $50,000"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="spinner" />
                      <span>{editingAchievement ? 'Updating...' : 'Creating...'}</span>
                    </div>
                  ) : (
                    editingAchievement ? 'Update Achievement' : 'Create Achievement'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAchievements;