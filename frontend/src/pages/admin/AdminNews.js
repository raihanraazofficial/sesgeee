import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Newspaper, Calendar, Search, Filter, Star, X, Download, Copy, Image, Quote, Code } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';
window.katex = katex;

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
    image_alt: '',
    author: '',
    tags: '',
    seo_keywords: '',
    category: 'news', // news, events, upcoming_events
    status: 'published',
    google_calendar_link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData('news');
  }, [fetchData]);

  const filters = [
    { value: 'all', label: 'All Items' },
    { value: 'news', label: 'News' },
    { value: 'events', label: 'Events' },
    { value: 'upcoming_events', label: 'Upcoming Events' },
    { value: 'featured', label: 'Featured' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

  // Rich Text Editor Configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['formula'],
      ['clean']
    ],
    formula: true,
    imageResize: {
      parchment: ReactQuill.Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'align',
    'link', 'image', 'video',
    'formula'
  ];

  const filteredNews = news.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.author || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'news') {
      matchesFilter = item.category === 'news';
    } else if (selectedFilter === 'events') {
      matchesFilter = item.category === 'events';
    } else if (selectedFilter === 'upcoming_events') {
      matchesFilter = item.category === 'upcoming_events';
    } else if (selectedFilter === 'featured') {
      matchesFilter = item.is_featured === true;
    } else if (selectedFilter === 'published') {
      matchesFilter = item.status === 'published';
    } else if (selectedFilter === 'draft') {
      matchesFilter = item.status === 'draft';
    }
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // Sort by published_date, latest first
    const dateA = new Date(a.published_date || 0);
    const dateB = new Date(b.published_date || 0);
    return dateB - dateA;
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
        toast.success('News article updated successfully!');
      } else {
        await createItem('news', newsData);
        toast.success('News article created successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        published_date: new Date().toISOString().split('T')[0],
        is_featured: false,
        image: '',
        image_alt: '',
        author: '',
        tags: '',
        seo_keywords: '',
        category: 'news',
        status: 'published',
        google_calendar_link: ''
      });
      setShowModal(false);
      setEditingNews(null);
      
      // Refresh data
      await fetchData('news');
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Error saving news article. Please try again.');
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
      image_alt: newsItem.image_alt || '',
      author: newsItem.author || '',
      tags: Array.isArray(newsItem.tags) ? newsItem.tags.join(', ') : '',
      seo_keywords: newsItem.seo_keywords || '',
      category: newsItem.category || 'news',
      status: newsItem.status || 'published',
      google_calendar_link: newsItem.google_calendar_link || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await deleteItem('news', id);
        toast.success('News article deleted successfully!');
        await fetchData('news');
      } catch (error) {
        console.error('Error deleting news:', error);
        toast.error('Error deleting news article. Please try again.');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage News & Events</h1>
                <p className="text-gray-600 mt-1">Create and manage news, events, and upcoming events with rich content</p>
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
                  image_alt: '',
                  author: '',
                  tags: '',
                  seo_keywords: '',
                  category: 'news',
                  status: 'published',
                  google_calendar_link: ''
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
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-[150px]"
              >
                {filters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="space-y-6">
          {loading.news ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedFilter !== 'all' ? 'No news articles found' : 'No news articles yet'}
              </h3>
              <p className="text-gray-600 mb-6">
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
              <div key={newsItem.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
                          <h3 className="text-xl font-semibold text-gray-900">{newsItem.title}</h3>
                          {newsItem.is_featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-yellow-800 bg-yellow-100 border border-yellow-200">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            newsItem.status === 'published' ? 'text-green-800 bg-green-100 border-green-200' : 'text-gray-800 bg-gray-100 border-gray-200'
                          }`}>
                            {newsItem.status || 'published'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{newsItem.excerpt}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Edit news article"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(newsItem.id)}
                          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
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
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingNews ? 'Edit News Article' : 'Add News Article'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter article title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="news">News</option>
                    <option value="events">Events</option>
                    <option value="upcoming_events">Upcoming Events</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt/Summary *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief summary for preview and SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rich Content *
                  <span className="text-xs text-gray-500 ml-2">
                    (Supports formatting, images, videos, math formulas, code blocks, tables)
                  </span>
                </label>
                <div className="border border-gray-300 rounded-md">
                  <ReactQuill
                    value={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your content using the rich text editor..."
                    style={{ height: '300px', marginBottom: '50px' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Published Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.published_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.image_alt}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_alt: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe the image for accessibility"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="research, innovation, technology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="SEO keywords for search optimization"
                  />
                </div>
              </div>

              {formData.category === 'events' || formData.category === 'upcoming_events' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Calendar Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.google_calendar_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, google_calendar_link: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://calendar.google.com/calendar/embed?src=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Embed URL from Google Calendar to display event calendar
                  </p>
                </div>
              ) : null}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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