import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Newspaper, Calendar, Search, Filter, Star, X, Copy, Download, Image, Video, Link as LinkIcon, Table, Code, FileText, Calculator, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Quote, Minus, Smile, Subscript, Superscript, Palette, Type } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-toastify';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Make katex available globally for formula rendering
window.katex = katex;

// Custom Quill modules for advanced features
const BlockEmbed = Quill.import('blots/block/embed');
const Inline = Quill.import('blots/inline');

// Custom PDF Embed Blot
class PDFEmbed extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute('src', value.url);
    node.setAttribute('data-pdf-title', value.title || 'PDF Document');
    node.style.width = '100%';
    node.style.height = '500px';
    node.style.border = '1px solid #ddd';
    node.style.borderRadius = '8px';
    node.classList.add('pdf-embed');
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('src'),
      title: node.getAttribute('data-pdf-title')
    };
  }
}
PDFEmbed.blotName = 'pdf';
PDFEmbed.tagName = 'iframe';
Quill.register(PDFEmbed);

// Custom Code Block with Copy Button
class CodeBlockWithCopy extends BlockEmbed {
  static create(value) {
    let node = super.create();
    let wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.marginBottom = '16px';
    
    let header = document.createElement('div');
    header.className = 'code-block-header';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.backgroundColor = '#f8f9fa';
    header.style.padding = '8px 12px';
    header.style.borderRadius = '6px 6px 0 0';
    header.style.border = '1px solid #e9ecef';
    header.style.borderBottom = 'none';
    
    let language = document.createElement('span');
    language.textContent = value.language || 'Code';
    language.style.fontSize = '12px';
    language.style.fontWeight = '600';
    language.style.color = '#495057';
    
    let copyBtn = document.createElement('button');
    copyBtn.innerHTML = '📋 Copy';
    copyBtn.style.fontSize = '12px';
    copyBtn.style.padding = '4px 8px';
    copyBtn.style.backgroundColor = '#007bff';
    copyBtn.style.color = 'white';
    copyBtn.style.border = 'none';
    copyBtn.style.borderRadius = '4px';
    copyBtn.style.cursor = 'pointer';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(value.code);
      copyBtn.innerHTML = '✓ Copied!';
      setTimeout(() => copyBtn.innerHTML = '📋 Copy', 2000);
    };
    
    header.appendChild(language);
    header.appendChild(copyBtn);
    
    let pre = document.createElement('pre');
    pre.style.margin = '0';
    pre.style.padding = '16px';
    pre.style.backgroundColor = '#f8f9fa';
    pre.style.border = '1px solid #e9ecef';
    pre.style.borderRadius = '0 0 6px 6px';
    pre.style.overflowX = 'auto';
    
    let code = document.createElement('code');
    code.textContent = value.code;
    code.style.fontFamily = 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    code.style.fontSize = '14px';
    code.style.lineHeight = '1.5';
    
    pre.appendChild(code);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);
    
    node.appendChild(wrapper);
    return node;
  }

  static value(node) {
    const wrapper = node.querySelector('.code-block-wrapper');
    const code = wrapper.querySelector('code');
    const language = wrapper.querySelector('.code-block-header span');
    return {
      code: code.textContent,
      language: language.textContent
    };
  }
}
CodeBlockWithCopy.blotName = 'codeblock';
CodeBlockWithCopy.tagName = 'div';
Quill.register(CodeBlockWithCopy);

// Custom File Download Blot
class FileDownload extends Inline {
  static create(value) {
    let node = super.create();
    node.setAttribute('href', value.url);
    node.setAttribute('download', value.filename);
    node.setAttribute('target', '_blank');
    node.style.display = 'inline-flex';
    node.style.alignItems = 'center';
    node.style.padding = '8px 12px';
    node.style.backgroundColor = '#28a745';
    node.style.color = 'white';
    node.style.textDecoration = 'none';
    node.style.borderRadius = '4px';
    node.style.fontSize = '14px';
    node.style.fontWeight = '500';
    node.style.margin = '0 4px';
    node.innerHTML = `📁 ${value.filename}`;
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('href'),
      filename: node.getAttribute('download')
    };
  }
}
FileDownload.blotName = 'filedownload';
FileDownload.tagName = 'a';
Quill.register(FileDownload);

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
    category: 'news',
    status: 'published',
    google_calendar_link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [editorKey, setEditorKey] = useState(0); // Force re-render key
  const quillRef = useRef(null);

  useEffect(() => {
    fetchData('news');
  }, [fetchData]);

  // Handle editor content when editing news
  useEffect(() => {
    if (showModal && editingNews && editorReady && quillRef.current) {
      const editor = quillRef.current.getEditor();
      if (editor && editingNews.content) {
        // Small delay to ensure editor is fully ready
        setTimeout(() => {
          try {
            editor.root.innerHTML = editingNews.content;
            setFormData(prev => ({ ...prev, content: editingNews.content }));
          } catch (error) {
            console.log('Editor content setting error:', error);
            // Fallback: set content directly
            setFormData(prev => ({ ...prev, content: editingNews.content }));
          }
        }, 100);
      }
    }
  }, [showModal, editingNews, editorReady]);

  // Reset editor when modal closes
  useEffect(() => {
    if (!showModal) {
      setEditorReady(false);
      setEditorKey(prev => prev + 1); // Force re-render
    }
  }, [showModal]);

  const filters = [
    { value: 'all', label: 'All Items' },
    { value: 'news', label: 'News' },
    { value: 'events', label: 'Events' },
    { value: 'upcoming_events', label: 'Upcoming Events' },
    { value: 'featured', label: 'Featured' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

  // Enhanced Rich Text Editor Configuration
  const quillModules = {
    toolbar: {
      container: [
        // Formatting Group
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'color': [] }, { 'background': [] }],
        
        // Paragraph Group
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        
        // Insert Group
        ['link', 'image', 'video'],
        ['formula'],
        ['insertTable', 'insertPDF', 'insertCodeBlock', 'insertFileDownload'],
        
        // Utilities
        ['clean', 'undo', 'redo']
      ],
      handlers: {
        // Enhanced Table Handler
        insertTable: function() {
          const tableHtml = `
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #dee2e6; font-family: inherit;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left; font-weight: 600; background-color: #e9ecef;">Header 1</th>
                  <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left; font-weight: 600; background-color: #e9ecef;">Header 2</th>
                  <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left; font-weight: 600; background-color: #e9ecef;">Header 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #dee2e6; padding: 12px; background-color: white;">Click to edit</td>
                  <td style="border: 1px solid #dee2e6; padding: 12px; background-color: white;">Click to edit</td>
                  <td style="border: 1px solid #dee2e6; padding: 12px; background-color: white;">Click to edit</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="border: 1px solid #dee2e6; padding: 12px;">Click to edit</td>
                  <td style="border: 1px solid #dee2e6; padding: 12px;">Click to edit</td>
                  <td style="border: 1px solid #dee2e6; padding: 12px;">Click to edit</td>
                </tr>
              </tbody>
            </table>
            <p><br></p>
          `;
          const range = this.quill.getSelection(true);
          this.quill.clipboard.dangerouslyPasteHTML(range.index, tableHtml);
          this.quill.setSelection(range.index + tableHtml.length);
        },

        // Enhanced PDF Handler
        insertPDF: function() {
          const pdfUrl = prompt('Enter PDF URL:');
          if (pdfUrl && pdfUrl.trim()) {
            const range = this.quill.getSelection(true);
            this.quill.insertEmbed(range.index, 'pdf', {
              url: pdfUrl,
              title: 'PDF Document'
            });
            this.quill.setSelection(range.index + 1);
          }
        },

        // Enhanced Code Block Handler
        insertCodeBlock: function() {
          const code = prompt('Enter code:');
          const language = prompt('Enter language (optional):') || 'Code';
          if (code && code.trim()) {
            const range = this.quill.getSelection(true);
            this.quill.insertEmbed(range.index, 'codeblock', {
              code: code,
              language: language
            });
            this.quill.setSelection(range.index + 1);
          }
        },

        // File Download Handler
        insertFileDownload: function() {
          const url = prompt('Enter file URL:');
          const filename = prompt('Enter filename:');
          if (url && filename) {
            const range = this.quill.getSelection(true);
            this.quill.insertEmbed(range.index, 'filedownload', {
              url: url,
              filename: filename
            });
            this.quill.setSelection(range.index + 1);
          }
        },

        // Undo Handler
        undo: function() {
          this.quill.history.undo();
        },

        // Redo Handler
        redo: function() {
          this.quill.history.redo();
        }
      }
    },
    keyboard: {
      bindings: {
        // LaTeX shortcut: Ctrl+Shift+L
        latex: {
          key: 'L',
          ctrlKey: true,
          shiftKey: true,
          handler: function() {
            const latex = prompt('Enter LaTeX formula (e.g., E = mc^2, \\frac{a}{b}, \\sum_{i=1}^{n} x_i):');
            if (latex && latex.trim()) {
              try {
                const range = this.quill.getSelection(true);
                this.quill.insertEmbed(range.index, 'formula', latex);
                this.quill.setSelection(range.index + 1);
              } catch (error) {
                alert('Invalid LaTeX formula. Please check your syntax.');
              }
            }
          }
        },
        // Enhanced keyboard shortcuts
        bold: {
          key: 'B',
          ctrlKey: true,
          handler: function() {
            this.quill.format('bold', !this.quill.getFormat().bold);
          }
        },
        italic: {
          key: 'I',
          ctrlKey: true,
          handler: function() {
            this.quill.format('italic', !this.quill.getFormat().italic);
          }
        },
        underline: {
          key: 'U',
          ctrlKey: true,
          handler: function() {
            this.quill.format('underline', !this.quill.getFormat().underline);
          }
        },
        // Table shortcut: Ctrl+Shift+T
        table: {
          key: 'T',
          ctrlKey: true,
          shiftKey: true,
          handler: function() {
            this.quill.getModule('toolbar').handlers.insertTable.call(this);
          }
        },
        // Code block shortcut: Ctrl+Shift+C
        codeblock: {
          key: 'C',
          ctrlKey: true,
          shiftKey: true,
          handler: function() {
            this.quill.getModule('toolbar').handlers.insertCodeBlock.call(this);
          }
        }
      }
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true
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
    'formula',
    'pdf', 'codeblock', 'filedownload'
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

      resetForm();
      await fetchData('news');
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Error saving news article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
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
    setEditorReady(false);
    setEditorKey(prev => prev + 1);
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title || '',
      excerpt: newsItem.excerpt || '',
      content: '', // Will be set after editor is ready
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

  // Handle editor ready state
  const handleEditorReady = useCallback(() => {
    setEditorReady(true);
  }, []);

  // Handle editor content change
  const handleEditorChange = useCallback((content) => {
    setFormData(prev => ({ ...prev, content }));
  }, []);

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
                <h1 className="text-3xl font-bold text-gray-900">📰 Advanced News & Events Editor</h1>
                <p className="text-gray-600 mt-1">Create rich content with WordPress-like editing features</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditingNews(null);
                resetForm();
                setShowModal(true);
              }}
              className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Article</span>
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
                placeholder="Search articles, authors, content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-[150px] text-gray-900"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedFilter !== 'all' ? 'No articles found' : 'No articles yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'Try adjusting your search criteria' 
                  : 'Start creating amazing content with our advanced editor'}
              </p>
              {!searchTerm && selectedFilter === 'all' && (
                <button 
                  onClick={() => {
                    setEditingNews(null);
                    resetForm();
                    setShowModal(true);
                  }}
                  className="btn-primary"
                >
                  Create First Article
                </button>
              )}
            </div>
          ) : (
            filteredNews.map((newsItem) => (
              <div key={newsItem.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
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
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{newsItem.title}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            newsItem.category === 'news' ? 'text-blue-800 bg-blue-100 border-blue-200' :
                            newsItem.category === 'events' ? 'text-green-800 bg-green-100 border-green-200' :
                            newsItem.category === 'upcoming_events' ? 'text-purple-800 bg-purple-100 border-purple-200' :
                            'text-gray-800 bg-gray-100 border-gray-200'
                          }`}>
                            {newsItem.category === 'upcoming_events' ? 'Upcoming Events' : 
                             newsItem.category?.charAt(0).toUpperCase() + newsItem.category?.slice(1) || 'News'}
                          </span>
                          {newsItem.is_featured && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-yellow-800 bg-yellow-100 border border-yellow-200">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            newsItem.status === 'published' ? 'text-green-800 bg-green-100 border-green-200' : 'text-gray-800 bg-gray-100 border-gray-200'
                          }`}>
                            {newsItem.status || 'published'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-3">{newsItem.excerpt}</p>
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
                          {newsItem.google_calendar_link && (
                            <span className="text-blue-600"><strong>Calendar:</strong> Linked</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(newsItem)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit article"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(newsItem.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete article"
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

      {/* Enhanced Modal with Advanced Editor */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto border border-gray-200 shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Newspaper className="h-6 w-6 mr-3 text-primary-600" />
                  {editingNews ? 'Edit Article' : 'Create New Article'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter compelling article title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📂 Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="news">📰 News</option>
                    <option value="events">🎉 Events</option>
                    <option value="upcoming_events">📅 Upcoming Events</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📋 Article Summary/Excerpt *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief, engaging summary for preview and SEO (2-3 sentences)"
                />
              </div>

              {/* Rich Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ✍️ Rich Content Editor *
                  <span className="text-xs text-gray-500 ml-2 block mt-1">
                    WordPress-style editor with advanced features - Click toolbar icons or use keyboard shortcuts
                  </span>
                </label>
                
                {/* Editor Toolbar Guide */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">📝 Text Formatting</h4>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Ctrl+B (Bold)</li>
                        <li>• Ctrl+I (Italic)</li>
                        <li>• Ctrl+U (Underline)</li>
                        <li>• Headers H1-H6</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">🔧 Advanced Tools</h4>
                      <ul className="space-y-1 text-green-700">
                        <li>• Ctrl+Shift+T (Table)</li>
                        <li>• Ctrl+Shift+L (Math)</li>
                        <li>• Ctrl+Shift+C (Code)</li>
                        <li>• 📄 PDF Embed</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">🎨 Styling</h4>
                      <ul className="space-y-1 text-purple-700">
                        <li>• Colors & Backgrounds</li>
                        <li>• Font Sizes</li>
                        <li>• Alignment Options</li>
                        <li>• Lists & Quotes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">📎 Media</h4>
                      <ul className="space-y-1 text-red-700">
                        <li>• Images with Alt Text</li>
                        <li>• Video Embedding</li>
                        <li>• File Downloads</li>
                        <li>• Links & Anchors</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-lg bg-white" style={{ minHeight: '500px' }}>
                  <ReactQuill
                    key={editorKey} // Force re-render when key changes
                    ref={quillRef}
                    value={formData.content}
                    onChange={handleEditorChange}
                    onReady={handleEditorReady}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Start writing your amazing content... Use the toolbar above or keyboard shortcuts for formatting!"
                    style={{ height: '400px' }}
                    theme="snow"
                  />
                </div>
                
                {/* Editor Tips */}
                <div className="mt-3 text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <div className="font-semibold text-yellow-800 mb-2">💡 Pro Editor Tips:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>• Select text and use toolbar buttons for quick formatting</div>
                    <div>• Use keyboard shortcuts for faster editing</div>
                    <div>• Math formulas: Ctrl+Shift+L then enter LaTeX (e.g., E=mc^2)</div>
                    <div>• Tables: Ctrl+Shift+T for instant table creation</div>
                    <div>• Always add alt text to images for accessibility</div>
                    <div>• Code blocks include automatic copy buttons</div>
                  </div>
                </div>
              </div>

              {/* Metadata and Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Published Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.published_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔄 Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="published">✅ Published</option>
                    <option value="draft">📝 Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Author name"
                  />
                </div>
              </div>

              {/* Media and SEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🖼️ Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ♿ Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.image_alt}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_alt: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe the image for accessibility"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏷️ Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="research, innovation, technology, energy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔍 SEO Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="SEO keywords for search optimization"
                  />
                </div>
              </div>

              {/* Event-specific fields */}
              {(formData.category === 'events' || formData.category === 'upcoming_events') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Google Calendar Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.google_calendar_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, google_calendar_link: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://calendar.google.com/calendar/embed?src=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Embed URL from Google Calendar to display event calendar
                  </p>
                </div>
              )}

              {/* Featured toggle */}
              <div className="flex items-center bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-3 text-sm text-gray-700 flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  <strong>Featured Article</strong> - Will appear prominently on the website homepage
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{editingNews ? 'Updating...' : 'Creating...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{editingNews ? '💾 Update Article' : '🚀 Create Article'}</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Styles for the Editor */}
      <style jsx>{`
        .ql-toolbar {
          border-top: 1px solid #e5e7eb !important;
          border-left: 1px solid #e5e7eb !important;
          border-right: 1px solid #e5e7eb !important;
          border-bottom: 1px solid #e5e7eb !important;
          border-radius: 8px 8px 0 0 !important;
          background: linear-gradient(to right, #f8fafc, #f1f5f9) !important;
          padding: 12px !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }

        .ql-container {
          border-left: 1px solid #e5e7eb !important;
          border-right: 1px solid #e5e7eb !important;
          border-bottom: 1px solid #e5e7eb !important;
          border-radius: 0 0 8px 8px !important;
          font-family: inherit !important;
          font-size: 16px !important;
          background: white !important;
        }

        .ql-editor {
          min-height: 300px !important;
          padding: 20px !important;
          line-height: 1.7 !important;
          color: #374151 !important;
          background: white !important;
        }

        .ql-editor.ql-blank::before {
          font-style: italic !important;
          color: #9ca3af !important;
          font-size: 16px !important;
        }

        .ql-toolbar .ql-picker-label {
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
          padding: 6px 8px !important;
          margin: 2px !important;
        }

        .ql-toolbar button {
          border: 1px solid transparent !important;
          border-radius: 6px !important;
          padding: 6px !important;
          margin: 2px !important;
          transition: all 0.2s ease !important;
        }

        .ql-toolbar button:hover {
          background-color: #e5e7eb !important;
          border-color: #d1d5db !important;
          transform: translateY(-1px) !important;
        }

        .ql-toolbar button.ql-active {
          background-color: #3b82f6 !important;
          color: white !important;
          border-color: #2563eb !important;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3) !important;
        }

        .ql-toolbar .ql-insertTable:before {
          content: '⊞' !important;
          font-size: 16px !important;
          font-weight: bold !important;
        }

        .ql-toolbar .ql-insertPDF:before {
          content: '📄' !important;
          font-size: 14px !important;
        }

        .ql-toolbar .ql-insertCodeBlock:before {
          content: '💻' !important;
          font-size: 14px !important;
        }

        .ql-toolbar .ql-insertFileDownload:before {
          content: '📁' !important;
          font-size: 14px !important;
        }

        .ql-toolbar .ql-undo:before {
          content: '↶' !important;
          font-size: 16px !important;
          font-weight: bold !important;
        }

        .ql-toolbar .ql-redo:before {
          content: '↷' !important;
          font-size: 16px !important;
          font-weight: bold !important;
        }

        .ql-formats {
          margin-right: 15px !important;
        }

        .ql-picker-options {
          background-color: white !important;
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
          z-index: 9999 !important;
          max-height: 200px !important;
          overflow-y: auto !important;
        }

        .ql-snow .ql-tooltip {
          z-index: 9999 !important;
          background: white !important;
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
          padding: 12px !important;
        }

        .pdf-embed {
          display: block !important;
          margin: 16px 0 !important;
          border: 2px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }

        .code-block-wrapper {
          margin: 16px 0 !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }

        .line-clamp-2 {
          display: -webkit-box !important;
          -webkit-line-clamp: 2 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
        }

        .line-clamp-3 {
          display: -webkit-box !important;
          -webkit-line-clamp: 3 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
        }
      `}</style>
    </div>
  );
};

export default AdminNews;