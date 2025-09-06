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

  // Research areas for the form
  const researchAreasList = [
    'Smart Grid Technologies',
    'Microgrids & Distributed Energy Systems',
    'Renewable Energy Integration',
    'Grid Optimization & Stability',
    'Energy Storage Systems',
    'Power System Automation',
    'Cybersecurity and AI for Power Infrastructure'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'authors' || name === 'keywords' || name === 'editor') {
      // Split by comma and trim whitespace
      const items = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData(prev => ({
        ...prev,
        [name]: items
      }));
    } else if (name === 'research_areas') {
      // Handle multi-select for research areas
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else if (name === 'year' || name === 'citations') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || (name === 'year' ? new Date().getFullYear() : 0)
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
      title: publication.title || '',
      authors: publication.authors || [],
      publication_type: publication.publication_type || 'journal',
      journal_name: publication.journal_name || '',
      conference_name: publication.conference_name || '',
      book_title: publication.book_title || '',
      volume: publication.volume || '',
      issue: publication.issue || '',
      pages: publication.pages || '',
      year: publication.year || new Date().getFullYear(),
      month: publication.month || '',
      location: publication.location || '',
      editor: publication.editor || [],
      publisher: publication.publisher || '',
      edition: publication.edition || '',
      keywords: publication.keywords || [],
      link: publication.link || '',
      is_open_access: publication.is_open_access || false,
      citations: publication.citations || 0,
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



  const formatCitation = (pub) => {
    const authorsStr = Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors || '';
    
    if (pub.publication_type === 'journal') {
      return `${authorsStr}, "${pub.title}," ${pub.journal_name || 'Journal'}${pub.volume ? `, vol. ${pub.volume}` : ''}${pub.issue ? `, no. ${pub.issue}` : ''}${pub.pages ? `, pp. ${pub.pages}` : ''}, ${pub.year}.`;
    } else if (pub.publication_type === 'conference') {
      return `${authorsStr}, "${pub.title}," in ${pub.conference_name || 'Conference Proceedings'}${pub.location ? `, ${pub.location}` : ''}, ${pub.year}${pub.pages ? `, pp. ${pub.pages}` : ''}.`;
    } else if (pub.publication_type === 'book_chapter') {
      return `${authorsStr}, "${pub.title}," in ${pub.book_title || 'Book Title'}${pub.edition ? `, ${pub.edition}` : ''}${pub.editor && pub.editor.length > 0 ? `, ${pub.editor.join(', ')}, ${pub.editor.length === 1 ? 'Ed.' : 'Eds.'}` : ''}${pub.publisher ? `. ${pub.publisher}` : ''}${pub.location ? `, ${pub.location}` : ''}, ${pub.year}${pub.pages ? `, pp. ${pub.pages}` : ''}.`;
    }
    return `${authorsStr}, "${pub.title}," ${pub.year}.`;
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{publication.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{formatCitation(publication)}</p>
                    
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

                    {publication.research_areas && publication.research_areas.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {publication.research_areas.map((area, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {publication.publication_type === 'journal' ? 'Journal' : publication.publication_type === 'conference' ? 'Conference' : 'Book Chapter'}</span>
                      <span>Year: {publication.year}</span>
                      {publication.citations > 0 && (
                        <span>Citations: {publication.citations}</span>
                      )}
                      {publication.is_open_access && (
                        <span className="text-green-600 font-medium">Open Access</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {publication.link && (
                      <a
                        href={publication.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        title="View Publication"
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
                    placeholder="R. U. Raihan, S. Ahmad"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
              </div>

              {/* Journal Fields */}
              {formData.publication_type === 'journal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
              )}

              {/* Conference Fields */}
              {formData.publication_type === 'conference' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location (city, country)
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Dhaka, Bangladesh"
                    />
                  </div>
                </div>
              )}

              {/* Book Chapter Fields */}
              {formData.publication_type === 'book_chapter' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Edition
                      </label>
                      <input
                        type="text"
                        name="edition"
                        value={formData.edition}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="1st ed."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Editors (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="editor"
                        value={formData.editor.join(', ')}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="J. Smith, A. Johnson"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Publisher
                      </label>
                      <input
                        type="text"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="IEEE Press"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    placeholder="12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue/Number
                  </label>
                  <input
                    type="text"
                    name="issue"
                    value={formData.issue}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="3"
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
                    placeholder="123-130"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Month</option>
                    <option value="Jan.">January</option>
                    <option value="Feb.">February</option>
                    <option value="Mar.">March</option>
                    <option value="Apr.">April</option>
                    <option value="May">May</option>
                    <option value="Jun.">June</option>
                    <option value="Jul.">July</option>
                    <option value="Aug.">August</option>
                    <option value="Sep.">September</option>
                    <option value="Oct.">October</option>
                    <option value="Nov.">November</option>
                    <option value="Dec.">December</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Citations
                  </label>
                  <input
                    type="number"
                    name="citations"
                    value={formData.citations}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DOI/Publication Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://doi.org/10.1000/182 or https://ieeexplore.ieee.org/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <textarea
                  name="keywords"
                  value={formData.keywords.join(', ')}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input resize-none"
                  placeholder="smart grid, renewable energy, power systems, machine learning"
                />
                <p className="text-xs text-gray-500 mt-1">Press comma (,) to separate keywords</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Research Areas
                </label>
                <select
                  name="research_areas"
                  multiple
                  value={formData.research_areas}
                  onChange={handleInputChange}
                  className="form-input"
                  size="4"
                >
                  {researchAreasList.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple research areas</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_open_access"
                  checked={formData.is_open_access}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Open Access Publication
                  <span className="text-xs text-gray-500 block">Check if this publication is freely accessible (no "Request Paper" button will be shown)</span>
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