import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Search, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-toastify';

const AdminPublications = () => {
  const { publications, fetchData, createItem, updateItem, deleteItem, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [formData, setFormData] = useState({
    title: '',
    authors: [],
    publication_type: 'journal',
    journal_name: '',
    conference_name: '',
    book_title: '',
    volume: '',
    issue: '',
    pages: '',
    year: new Date().getFullYear(),
    month: '',
    location: '',
    editor: [],
    publisher: '',
    edition: '',
    keywords: [],
    link: '',
    is_open_access: false,
    citations: 0,
    research_areas: []
  });

  useEffect(() => {
    fetchData('publications');
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'authors' || name === 'editor' || name === 'keywords' || name === 'research_areas') {
      // Split by comma and trim whitespace
      const items = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData(prev => ({
        ...prev,
        [name]: items
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
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
      title: '',
      authors: [],
      publication_type: 'journal',
      journal_name: '',
      conference_name: '',
      book_title: '',
      volume: '',
      issue: '',
      pages: '',
      year: new Date().getFullYear(),
      month: '',
      location: '',
      editor: [],
      publisher: '',
      edition: '',
      keywords: [],
      link: '',
      is_open_access: false,
      citations: 0,
      research_areas: []
    });
    setEditingPublication(null);
  };

  const handleEdit = (publication) => {
    setEditingPublication(publication);
    setFormData({
      ...publication,
      authors: publication.authors || [],
      editor: publication.editor || [],
      keywords: publication.keywords || [],
      research_areas: publication.research_areas || []
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPublication) {
        await updateItem('publications', editingPublication.id, formData);
        toast.success('Publication updated successfully!');
      } else {
        await createItem('publications', formData);
        toast.success('Publication added successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchData('publications');
    } catch (error) {
      toast.error(`Error ${editingPublication ? 'updating' : 'adding'} publication: ${error.message}`);
    }
  };

  const handleDelete = async (publicationId, publicationTitle) => {
    if (window.confirm(`Are you sure you want to delete "${publicationTitle}"?`)) {
      try {
        await deleteItem('publications', publicationId);
        toast.success('Publication deleted successfully!');
        fetchData('publications');
      } catch (error) {
        toast.error(`Error deleting publication: ${error.message}`);
      }
    }
  };

  const formatIEEECitation = (pub) => {
    const authors = Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors || '';
    
    if (pub.publication_type === 'journal') {
      return `${authors}, "${pub.title}," ${pub.journal_name ? `${pub.journal_name}, ` : ''}${pub.volume ? `vol. ${pub.volume}, ` : ''}${pub.issue ? `no. ${pub.issue}, ` : ''}${pub.pages ? `pp. ${pub.pages}, ` : ''}${pub.month ? `${pub.month} ` : ''}${pub.year}.`;
    } else if (pub.publication_type === 'conference') {
      return `${authors}, "${pub.title}," in ${pub.conference_name || 'Conference Proceedings'}, ${pub.location || 'Location'}, ${pub.year}${pub.pages ? `, pp. ${pub.pages}` : ''}.`;
    } else if (pub.publication_type === 'book_chapter') {
      return `${authors}, "${pub.title}," in ${pub.book_title || 'Book Title'}${pub.edition ? `, ${pub.edition}` : ''}${pub.editor && pub.editor.length > 0 ? `, ${pub.editor.join(', ')}, ${pub.editor.length === 1 ? 'Ed.' : 'Eds.'}` : ''}${pub.publisher ? `. ${pub.publisher}` : ''}${pub.year ? `, ${pub.year}` : ''}${pub.pages ? `, pp. ${pub.pages}` : ''}.`;
    }
    return `${authors}, "${pub.title}," ${pub.year}.`;
  };

  // Filter and sort publications
  const filteredPublications = publications
    .filter(pub => {
      const matchesSearch = searchTerm === '' || 
        pub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(pub.authors) ? pub.authors.join(' ') : pub.authors || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.journal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.conference_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || pub.publication_type === filterType;
      const matchesYear = filterYear === 'all' || pub.year.toString() === filterYear;
      
      return matchesSearch && matchesType && matchesYear;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'title') {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

  const publicationTypes = [
    { key: 'journal', label: 'Journal Articles' },
    { key: 'conference', label: 'Conference Proceedings' },
    { key: 'book_chapter', label: 'Book Chapters' }
  ];

  const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);

  const stats = {
    total: publications.length,
    citations: publications.reduce((sum, pub) => sum + (pub.citations || 0), 0),
    latest_year: Math.max(...publications.map(pub => pub.year), 0)
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
                <h1 className="text-3xl font-bold font-heading text-white">Manage Publications</h1>
                <p className="text-gray-400 mt-1">Add, edit, and manage research publications</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Publication</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Publications</h3>
            <p className="text-3xl font-bold text-primary-400">{stats.total}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Citations</h3>
            <p className="text-3xl font-bold text-green-400">{stats.citations}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Latest Year</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.latest_year}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by title, author, journal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-input"
              >
                <option value="all">All Types</option>
                {publicationTypes.map(type => (
                  <option key={type.key} value={type.key}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="form-input"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort</label>
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-input flex-1"
                >
                  <option value="year">Year</option>
                  <option value="title">Title</option>
                  <option value="citations">Citations</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="form-input"
                >
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Publications List */}
        {loading.publications ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredPublications.length > 0 ? (
          <div className="space-y-4">
            {filteredPublications.map((publication) => (
              <div key={publication.id} className="glass rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full">
                        {publicationTypes.find(t => t.key === publication.publication_type)?.label || publication.publication_type}
                      </span>
                      <span className="text-gray-400 text-sm">{publication.year}</span>
                      {publication.is_open_access && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                          Open Access
                        </span>
                      )}
                    </div>
                    
                    <div className="text-gray-300 text-sm leading-relaxed mb-3">
                      {formatIEEECitation(publication)}
                    </div>
                    
                    {publication.keywords && publication.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {publication.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      {publication.citations > 0 && (
                        <span>Citations: {publication.citations}</span>
                      )}
                      {publication.link && (
                        <a
                          href={publication.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:text-primary-300"
                        >
                          View Paper
                        </a>
                      )}
                      {!publication.is_open_access && (
                        <span className="text-yellow-400">Request Paper</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(publication)}
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(publication.id, publication.title)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No Publications Found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterType !== 'all' || filterYear !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'Start by adding your first publication'
              }
            </p>
            <button onClick={handleAdd} className="btn-primary">
              Add Publication
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingPublication ? 'Edit Publication' : 'Add New Publication'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Authors * (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="authors"
                    value={Array.isArray(formData.authors) ? formData.authors.join(', ') : formData.authors}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Author 1, Author 2, Author 3"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Publication Type *
                    </label>
                    <select
                      name="publication_type"
                      value={formData.publication_type}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="journal">Journal Article</option>
                      <option value="conference">Conference Proceedings</option>
                      <option value="book_chapter">Book Chapter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1900"
                      max="2100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Citations
                    </label>
                    <input
                      type="number"
                      name="citations"
                      value={formData.citations}
                      onChange={handleInputChange}
                      className="form-input"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Publication-Specific Fields */}
              {formData.publication_type === 'journal' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Journal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Journal Name *
                      </label>
                      <input
                        type="text"
                        name="journal_name"
                        value={formData.journal_name}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Volume
                      </label>
                      <input
                        type="text"
                        name="volume"
                        value={formData.volume}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Issue
                      </label>
                      <input
                        type="text"
                        name="issue"
                        value={formData.issue}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Month
                      </label>
                      <input
                        type="text"
                        name="month"
                        value={formData.month}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="January, Feb, etc."
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.publication_type === 'conference' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Conference Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Conference Name *
                      </label>
                      <input
                        type="text"
                        name="conference_name"
                        value={formData.conference_name}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.publication_type === 'book_chapter' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Book Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Book Title *
                      </label>
                      <input
                        type="text"
                        name="book_title"
                        value={formData.book_title}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Publisher
                      </label>
                      <input
                        type="text"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Edition
                      </label>
                      <input
                        type="text"
                        name="edition"
                        value={formData.edition}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="2nd ed."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Editors (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="editor"
                        value={Array.isArray(formData.editor) ? formData.editor.join(', ') : formData.editor}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Common Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pages
                  </label>
                  <input
                    type="text"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="45-68"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : formData.keywords}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Smart Grid, Renewable Energy, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Research Areas (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="research_areas"
                    value={Array.isArray(formData.research_areas) ? formData.research_areas.join(', ') : formData.research_areas}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Smart Grid Technologies, Renewable Energy Integration"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Link/DOI
                    </label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="flex items-center space-x-3 pt-6">
                    <input
                      type="checkbox"
                      name="is_open_access"
                      checked={formData.is_open_access}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                    />
                    <label className="text-sm font-medium text-gray-300">
                      Open Access
                    </label>
                  </div>
                </div>
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
                  <span>{editingPublication ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPublications;