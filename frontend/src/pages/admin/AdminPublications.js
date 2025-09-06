import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-toastify';

const AdminPublications = () => {
  const { publications, fetchData, createItem, updateItem, deleteItem, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: [],
    journal: '',
    year: new Date().getFullYear(),
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    abstract: '',
    keywords: [],
    type: 'journal',
    url: '',
    is_featured: false
  });

  useEffect(() => {
    fetchData('publications');
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'authors' || name === 'keywords') {
      // Split by comma and trim whitespace
      const items = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData(prev => ({
        ...prev,
        [name]: items
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
      title: '',
      authors: [],
      journal: '',
      year: new Date().getFullYear(),
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      abstract: '',
      keywords: [],
      type: 'journal',
      url: '',
      is_featured: false
    });
    setEditingPublication(null);
  };

  const handleEdit = (publication) => {
    setEditingPublication(publication);
    setFormData({
      ...publication,
      authors: publication.authors || [],
      keywords: publication.keywords || []
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

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'No authors';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors[0]} et al.`;
  };

  const formatCitation = (pub) => {
    const authorsStr = formatAuthors(pub.authors);
    let citation = `${authorsStr}. "${pub.title}." `;
    
    if (pub.journal) {
      citation += `${pub.journal}`;
      if (pub.volume) citation += ` ${pub.volume}`;
      if (pub.issue) citation += `.${pub.issue}`;
      if (pub.pages) citation += ` (${pub.pages})`;
    }
    
    citation += ` (${pub.year}).`;
    
    return citation;
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
                <h1 className="text-3xl font-bold font-heading text-gray-900">Manage Publications</h1>
                <p className="text-gray-600 mt-1">Add, edit, and manage research publications</p>
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
        {loading.publications ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        ) : publications.length > 0 ? (
          <div className="space-y-6">
            {publications.map((publication) => (
              <div key={publication.id} className="glass rounded-xl p-6 border border-gray-200 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    {publication.is_featured && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mb-2 border border-yellow-200">
                        Featured
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{publication.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{formatCitation(publication)}</p>
                    
                    {publication.abstract && (
                      <p className="text-gray-700 text-sm mb-3 line-clamp-3">{publication.abstract}</p>
                    )}
                    
                    {publication.keywords && publication.keywords.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {publication.keywords.slice(0, 5).map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
                            >
                              {keyword}
                            </span>
                          ))}
                          {publication.keywords.length > 5 && (
                            <span className="text-gray-500 text-xs">+{publication.keywords.length - 5} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {publication.type}</span>
                      <span>Year: {publication.year}</span>
                      {publication.doi && (
                        <span>DOI: {publication.doi}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {publication.url && (
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEdit(publication)}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(publication.id, publication.title)}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No Publications Found</h3>
            <p className="text-gray-600 mb-6">
              Start building your research portfolio by adding your first publication.
            </p>
            <button
              onClick={handleAdd}
              className="btn-primary"
            >
              Add First Publication
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPublication ? 'Edit Publication' : 'Add New Publication'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authors (comma-separated) *
                  </label>
                  <input
                    type="text"
                    name="authors"
                    value={formData.authors.join(', ')}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="John Doe, Jane Smith, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publication Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="journal">Journal Article</option>
                    <option value="conference">Conference Paper</option>
                    <option value="book">Book</option>
                    <option value="chapter">Book Chapter</option>
                    <option value="thesis">Thesis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Journal/Conference *
                  </label>
                  <input
                    type="text"
                    name="journal"
                    value={formData.journal}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pages
                  </label>
                  <input
                    type="text"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="1-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DOI
                  </label>
                  <input
                    type="text"
                    name="doi"
                    value={formData.doi}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="10.1000/182"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/paper"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract
                </label>
                <textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords.join(', ')}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="smart grid, renewable energy, etc."
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
                  Featured Publication
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