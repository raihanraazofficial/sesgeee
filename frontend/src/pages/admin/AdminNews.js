import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { useData } from '../../contexts/DataContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Configure KaTeX for math formulas
window.katex = katex;

const AdminNews = () => {
  const { fetchData, createItem, updateItem, deleteItem } = useData();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    published_date: new Date().toISOString().slice(0, 16),
    category: 'news',
    is_featured: false,
    image: '',
    image_alt: '',
    tags: [],
    seo_keywords: '',
    status: 'published',
    google_calendar_link: ''
  });

  // ReactQuill configuration for rich text editing
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        [{ 'table': 'table' }, { 'pdf': 'pdf' }, { 'formula': 'formula' }],
        ['clean']
      ],
      handlers: {
        'table': function() {
          insertTable(this.quill);
        },
        'pdf': function() {
          insertPDF(this.quill);
        },
        'formula': function() {
          insertFormula(this.quill);
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video',
    'table', 'formula'
  ];

  // Custom handlers for toolbar buttons
  const insertTable = (quill) => {
    // Professional table creation with user input
    const rows = prompt('Enter number of rows (1-20):', '3');
    const cols = prompt('Enter number of columns (1-10):', '3');
    
    if (!rows || !cols) return;
    
    const numRows = parseInt(rows);
    const numCols = parseInt(cols);
    
    if (isNaN(numRows) || isNaN(numCols) || numRows < 1 || numRows > 20 || numCols < 1 || numCols > 10) {
      toast.error('Please enter valid numbers (Rows: 1-20, Columns: 1-10)');
      return;
    }
    
    // Create professional table HTML
    let tableHTML = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;">
    `;
    
    // Add header cells
    for (let col = 1; col <= numCols; col++) {
      tableHTML += `<th style="border: 1px solid #dee2e6; padding: 12px; text-align: left; font-weight: 600; color: #495057;">Header ${col}</th>`;
    }
    
    tableHTML += `
          </tr>
        </thead>
        <tbody>
    `;
    
    // Add data rows
    for (let row = 1; row <= numRows; row++) {
      tableHTML += `<tr style="${row % 2 === 0 ? 'background-color: #f8f9fa;' : ''}">`;
      for (let col = 1; col <= numCols; col++) {
        tableHTML += `<td style="border: 1px solid #dee2e6; padding: 12px; color: #495057;">Row ${row}, Col ${col}</td>`;
      }
      tableHTML += `</tr>`;
    }
    
    tableHTML += `
        </tbody>
      </table>
    `;
    
    const range = quill.getSelection();
    if (range) {
      quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
    }
  };

  const insertPDF = (quill) => {
    const url = prompt('Enter PDF URL:');
    if (!url) return;
    
    // Validate URL
    if (!url.match(/^https?:\/\/.+\.(pdf)(\?.*)?$/i) && !url.includes('drive.google.com') && !url.includes('dropbox.com')) {
      const proceed = confirm('The URL doesn\'t appear to be a PDF. Continue anyway?');
      if (!proceed) return;
    }
    
    const title = prompt('Enter PDF title (optional):', 'Document') || 'Document';
    
    const pdfHTML = `
      <div style="border: 2px solid #e9ecef; border-radius: 12px; padding: 24px; margin: 24px 0; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="display: flex; align-items: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #dee2e6;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #dc3545, #c82333); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
            <svg style="width: 24px; height: 24px; color: white;" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 18h12V6h-4V2H4v16zm-2 1V1a1 1 0 011-1h8.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V19a1 1 0 01-1 1H3a1 1 0 01-1-1z"/>
            </svg>
          </div>
          <div>
            <h4 style="margin: 0; font-size: 18px; font-weight: 600; color: #212529;">${title}</h4>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #6c757d;">PDF Document</p>
          </div>
        </div>
        
        <div style="background: white; border-radius: 8px; overflow: hidden; margin-bottom: 16px;">
          <iframe 
            src="${url}#toolbar=1&navpanes=1&scrollbar=1" 
            width="100%" 
            height="500px" 
            style="border: none; display: block;"
            loading="lazy"
            title="${title}">
          </iframe>
        </div>
        
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <a href="${url}" target="_blank" 
               style="display: inline-flex; align-items: center; padding: 10px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; transition: background-color 0.2s;">
              <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/>
              </svg>
              Download PDF
            </a>
            <a href="${url}" target="_blank" 
               style="display: inline-flex; align-items: center; padding: 10px 16px; background: #6c757d; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; transition: background-color 0.2s;">
              <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
              </svg>
              Open in New Tab
            </a>
          </div>
          <div style="font-size: 12px; color: #6c757d;">
            📄 PDF • Professional Document Viewer
          </div>
        </div>
      </div>
    `;
    
    const range = quill.getSelection();
    if (range) {
      quill.clipboard.dangerouslyPasteHTML(range.index, pdfHTML);
    }
  };

  const insertFormula = (quill) => {
    const formula = prompt('Enter LaTeX formula (e.g., E = mc^2, \\frac{a}{b}, \\sqrt{x^2+y^2}):');
    if (!formula) return;
    
    try {
      // Test the formula first
      const katexHTML = katex.renderToString(formula, {
        throwOnError: false,
        displayMode: false,
        output: 'html'
      });
      
      // Create professional formula wrapper
      const formulaHTML = `
        <span style="display: inline-block; background: linear-gradient(135deg, #e3f2fd, #f3e5f5); border: 1px solid #bbdefb; border-radius: 6px; padding: 8px 12px; margin: 4px; font-family: 'Times New Roman', serif; position: relative;">
          <span class="katex-formula" style="font-size: 16px;">${katexHTML}</span>
          <span style="position: absolute; top: -8px; right: -8px; background: #2196f3; color: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">fx</span>
        </span>
      `;
      
      const range = quill.getSelection();
      if (range) {
        quill.clipboard.dangerouslyPasteHTML(range.index, formulaHTML);
      }
      
      toast.success('Formula inserted successfully!');
    } catch (error) {
      console.error('Formula error:', error);
      toast.error('Invalid LaTeX formula. Please check your syntax.');
    }
  };

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      const newsData = await fetchData('news');
      setNews(newsData || []);
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Failed to load news data');
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = !searchTerm || 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [news, searchTerm, statusFilter, categoryFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.author) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newsData = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags : 
              formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        published_date: new Date(formData.published_date).toISOString()
      };

      if (editingItem) {
        await updateItem('news', editingItem.id, newsData);
        toast.success('News updated successfully!');
      } else {
        await createItem('news', newsData);
        toast.success('News created successfully!');
      }

      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
      loadNews();
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error(editingItem ? 'Failed to update news' : 'Failed to create news');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      content: item.content || '',
      excerpt: item.excerpt || '',
      author: item.author || '',
      published_date: item.published_date ? new Date(item.published_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      category: item.category || 'news',
      is_featured: item.is_featured || false,
      image: item.image || '',
      image_alt: item.image_alt || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      seo_keywords: item.seo_keywords || '',
      status: item.status || 'published',
      google_calendar_link: item.google_calendar_link || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        await deleteItem('news', item.id);
        toast.success('News deleted successfully!');
        loadNews();
      } catch (error) {
        console.error('Error deleting news:', error);
        toast.error('Failed to delete news');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      published_date: new Date().toISOString().slice(0, 16),
      category: 'news',
      is_featured: false,
      image: '',
      image_alt: '',
      tags: [],
      seo_keywords: '',
      status: 'published',
      google_calendar_link: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      published: 'bg-green-100 text-green-800 border-green-300',
      draft: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryStyles = {
      news: 'bg-blue-100 text-blue-800 border-blue-300',
      events: 'bg-green-100 text-green-800 border-green-300',
      upcoming_events: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    
    const categoryNames = {
      news: 'News',
      events: 'Events',
      upcoming_events: 'Upcoming Events'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryStyles[category] || categoryStyles.news}`}>
        {categoryNames[category] || 'News'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold font-heading text-gray-900">News & Events Management</h1>
              <p className="text-gray-600 mt-1">Create and manage news articles and events</p>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                resetForm();
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add News/Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search news & events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="news">News</option>
              <option value="events">Events</option>
              <option value="upcoming_events">Upcoming Events</option>
            </select>
          </div>
        </div>

        {/* News List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No news or events</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new news article or event.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title & Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNews.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {item.image ? (
                              <img className="h-10 w-10 rounded object-cover" src={item.image} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-medium text-gray-900">{item.title}</div>
                              {item.is_featured && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full border border-yellow-300">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">by {item.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCategoryBadge(item.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.published_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-primary-600 hover:text-primary-900 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Edit News/Event' : 'Add News/Event'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="news">News</option>
                    <option value="events">Events</option>
                    <option value="upcoming_events">Upcoming Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Published Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                    Featured Article
                  </label>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Brief summary of the article..."
                />
              </div>

              {/* Rich Text Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ zIndex: 1000, position: 'relative' }}>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{
                      height: '300px',
                      zIndex: 1000,
                      position: 'relative',
                      pointerEvents: 'auto'
                    }}
                    className="bg-white"
                    readOnly={false}
                  />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Rich Text Editor Features:</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Formatting:</strong> Bold, Italic, Underline, Headers, Lists, Quotes</li>
                    <li><strong>Tables:</strong> Click the table button (⊞) to insert formatted tables</li>
                    <li><strong>PDF:</strong> Click PDF button (📄) to embed PDF documents</li>
                    <li><strong>Math Formulas:</strong> Click formula button to add LaTeX equations</li>
                    <li><strong>Links & Media:</strong> Insert links, images, and videos</li>
                  </ul>
                </div>
              </div>

              {/* Image & Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
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
                    onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Description for accessibility"
                  />
                </div>
              </div>

              {/* Tags & SEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="technology, research, energy (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="smart grid, renewable energy, research"
                  />
                </div>
              </div>

              {/* Google Calendar Link (for events) */}
              {(formData.category === 'events' || formData.category === 'upcoming_events') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Calendar Embed Link
                  </label>
                  <input
                    type="url"
                    value={formData.google_calendar_link}
                    onChange={(e) => setFormData({ ...formData, google_calendar_link: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="https://calendar.google.com/calendar/embed?src=..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Embed link from Google Calendar for event scheduling
                  </p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  {editingItem ? 'Update' : 'Create'} News/Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Styles for ReactQuill */}
      <style jsx global>{`
        .ql-editor {
          min-height: 250px !important;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          background: white;
          position: relative;
          z-index: 1001;
        }
        
        .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          background: white;
          position: relative;
          z-index: 1000;
        }
        
        .ql-toolbar .ql-picker {
          position: relative;
          z-index: 1002;
        }
        
        .ql-toolbar .ql-picker-options {
          position: absolute;
          z-index: 1003;
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        /* Custom toolbar button styles */
        .ql-toolbar .ql-table::before {
          content: "⊞";
          font-weight: bold;
          font-size: 16px;
        }
        
        .ql-toolbar .ql-pdf::before {
          content: "📄";
          font-size: 14px;
        }
        
        .ql-toolbar .ql-formula::before {
          content: "fx";
          font-weight: bold;
          font-size: 12px;
          background: #2196f3;
          color: white;
          border-radius: 3px;
          padding: 2px 4px;
        }
        
        .ql-toolbar .ql-table:hover,
        .ql-toolbar .ql-pdf:hover,
        .ql-toolbar .ql-formula:hover {
          background-color: #f3f4f6;
          border-radius: 4px;
        }

        .katex-formula {
          background-color: #f8f9fa;
          padding: 2px 4px;
          border-radius: 3px;
          border: 1px solid #e9ecef;
        }
        
        /* Improve table styling in editor */
        .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
        }
        
        .ql-editor table td, 
        .ql-editor table th {
          border: 1px solid #dee2e6;
          padding: 8px 12px;
          text-align: left;
        }
        
        .ql-editor table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        
        .ql-editor table tr:nth-child(even) {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default AdminNews;