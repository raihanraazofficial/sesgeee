import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Award } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-toastify';

const AdminAchievements = () => {
  const { achievements, fetchData, createItem, updateItem, deleteItem, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'award',
    year: new Date().getFullYear(),
    amount: '',
    organization: '',
    recipient: '',
    is_featured: false
  });

  useEffect(() => {
    fetchData('achievements');
  }, [fetchData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'year') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || new Date().getFullYear()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'award',
      year: new Date().getFullYear(),
      amount: '',
      organization: '',
      recipient: '',
      is_featured: false
    });
    setEditingAchievement(null);
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setFormData(achievement);
    setShowModal(true);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAchievement) {
        await updateItem('achievements', editingAchievement.id, formData);
        toast.success('Achievement updated successfully!');
      } else {
        await createItem('achievements', formData);
        toast.success('Achievement added successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchData('achievements');
    } catch (error) {
      toast.error(`Error ${editingAchievement ? 'updating' : 'adding'} achievement: ${error.message}`);
    }
  };

  const handleDelete = async (achievementId, achievementName) => {
    if (window.confirm(`Are you sure you want to delete "${achievementName}"?`)) {
      try {
        await deleteItem('achievements', achievementId);
        toast.success('Achievement deleted successfully!');
        fetchData('achievements');
      } catch (error) {
        toast.error(`Error deleting achievement: ${error.message}`);
      }
    }
  };

  const filteredAchievements = activeTab === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === activeTab);

  const categories = [
    { key: 'all', label: 'All Achievements', count: achievements.length },
    { key: 'award', label: 'Awards', count: achievements.filter(a => a.category === 'award').length },
    { key: 'funding', label: 'Funding', count: achievements.filter(a => a.category === 'funding').length },
    { key: 'recognition', label: 'Recognition', count: achievements.filter(a => a.category === 'recognition').length }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'award':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'funding':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'recognition':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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
                <h1 className="text-3xl font-bold font-heading text-gray-900">Manage Achievements</h1>
                <p className="text-gray-600 mt-1">Add, edit, and manage research achievements</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
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
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleTabChange(category.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === category.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {loading.achievements ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div key={achievement.id} className="glass rounded-xl p-6 border border-gray-200 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    {achievement.is_featured && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mb-2 border border-yellow-200">
                        Featured
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{achievement.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      {achievement.organization && (
                        <p><span className="font-medium">Organization:</span> {achievement.organization}</p>
                      )}
                      {achievement.recipient && (
                        <p><span className="font-medium">Recipient:</span> {achievement.recipient}</p>
                      )}
                      {achievement.amount && (
                        <p><span className="font-medium">Amount:</span> {achievement.amount}</p>
                      )}
                      <p><span className="font-medium">Year:</span> {achievement.year}</p>
                    </div>
                    
                    <div className="mt-3">
                      <span className={`px-2 py-1 rounded text-xs capitalize border ${getCategoryColor(achievement.category)}`}>
                        {achievement.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(achievement.id, achievement.name)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center border border-gray-200 shadow-lg">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No Achievements Found</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'all' 
                ? 'Start showcasing your research achievements by adding your first entry.'
                : `No ${activeTab} achievements available. Try switching to a different category or add a new achievement.`
              }
            </p>
            <button
              onClick={handleAdd}
              className="btn-primary"
            >
              Add First Achievement
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="award">Award</option>
                    <option value="funding">Funding</option>
                    <option value="recognition">Recognition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="form-input"
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Awarding organization"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient
                  </label>
                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Award recipient"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (for funding/grants)
                </label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., $50,000 or ৳5,00,000"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Featured Achievement
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{editingAchievement ? 'Update' : 'Create'}</span>
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