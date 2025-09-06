import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Newspaper, Calendar, Search, Filter, Star } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AdminNews = () => {
  const { news, fetchData, createItem, updateItem, deleteItem, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    published_date: new Date().toISOString().split('T')[0],
    is_featured: false,
    image: '',
    author: '',
    tags: '',
    status: 'published'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData('news');
  }, [fetchData]);

  const filters = [
    { value: 'all', label: 'All News' },
    { value: 'featured', label: 'Featured' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

  const filteredNews = news.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'featured') {
      matchesFilter = item.is_featured === true;
    } else if (selectedFilter === 'published') {
      matchesFilter = item.status === 'published';
    } else if (selectedFilter === 'draft') {
      matchesFilter = item.status === 'draft';
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newsData = {
        ...formData,
        is_featured: formData.is_featured,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        published_date: formData.published_date,
      };

      if (editingNews) {
        await updateItem('news', editingNews.id, newsData);
      } else {
        await createItem('news', newsData);
      }

      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        published_date: new Date().toISOString().split('T')[0],
        is_featured: false,
        image: '',
        author: '',
        tags: '',
        status: 'published'
      });
      setShowModal(false);
      setEditingNews(null);
      
      // Refresh data
      await fetchData('news');
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Error saving news article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title || '',
      excerpt: newsItem.excerpt || '',
      content: newsItem.content || '',
      published_date: newsItem.published_date ? newsItem.published_date.split('T')[0] : new Date().toISOString().split('T')[0],
      is_featured: newsItem.is_featured || false,
      image: newsItem.image || '',
      author: newsItem.author || '',
      tags: Array.isArray(newsItem.tags) ? newsItem.tags.join(', ') : '',
      status: newsItem.status || 'published'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await deleteItem('news', id);
        await fetchData('news');
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Error deleting news article. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
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
                <h1 className="text-3xl font-bold font-heading text-white">Manage News & Events</h1>
                <p className="text-gray-400 mt-1">Add, edit, and manage news articles and events</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditingNews(null);
                setFormData({
                  title: '',
                  excerpt: '',
                  content: '',
                  published_date: new Date().toISOString().split('T')[0],
                  is_featured: false,
                  image: '',
                  author: '',
                  tags: '',
                  status: 'published'
                });
                setShowModal(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add News/Event</span>
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
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="form-select min-w-[150px]"
            >
              {filters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* News List */}
        <div className="space-y-6">
          {loading.news ? (
            <div className="glass rounded-xl p-8 text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || selectedFilter !== 'all' ? 'No news articles found' : 'No news articles yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'Try adjusting your search criteria' 
                  : 'Start by adding your first news article'}
              </p>
              {!searchTerm && selectedFilter === 'all' && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn-primary"
                >
                  Add News Article
                </button>
              )}
            </div>
          ) : (
            filteredNews.map((newsItem) => (
              <div key={newsItem.id} className="glass rounded-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {newsItem.image && (
                    <div className="lg:w-1/4 h-48 lg:h-auto">
                      <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`p-6 ${newsItem.image ? 'lg:w-3/4' : 'w-full'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{newsItem.title}</h3>
                          {newsItem.is_featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-yellow-400 bg-yellow-400/20">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            newsItem.status === 'published' ? 'text-green-400 bg-green-400/20' : 'text-gray-400 bg-gray-400/20'
                          }`}>
                            {newsItem.status || 'published'}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{newsItem.excerpt}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(newsItem.published_date)}
                          </span>
                          {newsItem.author && (
                            <span><strong>Author:</strong> {newsItem.author}</span>
                          )}
                          {newsItem.tags && Array.isArray(newsItem.tags) && newsItem.tags.length > 0 && (
                            <span><strong>Tags:</strong> {newsItem.tags.join(', ')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(newsItem)}
                          className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
                          title="Edit news article"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(newsItem.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete news article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingNews ? 'Edit News Article' : 'Add News Article'}
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
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="form-input w-full"
                  placeholder="Enter news article title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="form-textarea w-full"
                  placeholder="Brief summary of the news article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  rows="8"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="form-textarea w-full"
                  placeholder="Full content of the news article"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Published Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.published_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
                    className="form-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="form-select w-full"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="form-input w-full"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="form-input w-full"
                    placeholder="Article author"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="form-input w-full"
                    placeholder="research, innovation, technology"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="is_featured" className="ml-2 text-sm text-gray-300">
                  Featured article (appears prominently on the website)
                </label>
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
                      <span>{editingNews ? 'Updating...' : 'Creating...'}</span>
                    </div>
                  ) : (
                    editingNews ? 'Update Article' : 'Create Article'
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

export default AdminNews;