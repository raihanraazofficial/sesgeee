import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-toastify';

const AdminPeople = () => {
  const { people, fetchData, createItem, updateItem, deleteItem, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [activeTab, setActiveTab] = useState('advisors');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    department: '',
    category: 'advisors',
    bio: '',
    research_interests: [],
    image: '',
    email: '',
    website: '',
    display_order: '',
    social_links: {
      google_scholar: '',
      researchgate: '',
      orcid: '',
      linkedin: '',
      github: '',
      ieee: ''
    }
  });

  useEffect(() => {
    fetchData('people');
  }, [fetchData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_links.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialKey]: value
        }
      }));
    } else if (name === 'research_interests') {
      // Split by comma and trim whitespace
      const interests = value.split(',').map(interest => interest.trim()).filter(interest => interest);
      setFormData(prev => ({
        ...prev,
        research_interests: interests
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
      title: '',
      department: '',
      category: 'advisors',
      bio: '',
      research_interests: [],
      image: '',
      email: '',
      website: '',
      display_order: '',
      social_links: {
        google_scholar: '',
        researchgate: '',
        orcid: '',
        linkedin: '',
        github: '',
        ieee: ''
      }
    });
    setEditingPerson(null);
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setFormData({
      ...person,
      research_interests: person.research_interests || [],
      display_order: person.display_order || '',
      social_links: person.social_links || {
        google_scholar: '',
        researchgate: '',
        orcid: '',
        linkedin: '',
        github: '',
        ieee: ''
      }
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    resetForm();
    setFormData(prev => ({ ...prev, category: activeTab }));
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPerson) {
        await updateItem('people', editingPerson.id, formData);
        toast.success('Person updated successfully!');
      } else {
        await createItem('people', formData);
        toast.success('Person added successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchData('people'); // Refresh data
    } catch (error) {
      toast.error(`Error ${editingPerson ? 'updating' : 'adding'} person: ${error.message}`);
    }
  };

  const handleDelete = async (personId, personName) => {
    if (window.confirm(`Are you sure you want to delete ${personName}?`)) {
      try {
        await deleteItem('people', personId);
        toast.success('Person deleted successfully!');
        fetchData('people'); // Refresh data
      } catch (error) {
        toast.error(`Error deleting person: ${error.message}`);
      }
    }
  };

  const filteredPeople = people.filter(person => person.category === activeTab);

  const categories = [
    { key: 'advisors', label: 'Advisors', count: people.filter(p => p.category === 'advisors').length },
    { key: 'team_members', label: 'Team Members', count: people.filter(p => p.category === 'team_members').length },
    { key: 'collaborators', label: 'Collaborators', count: people.filter(p => p.category === 'collaborators').length }
  ];

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
                <h1 className="text-3xl font-bold font-heading text-gray-900">Manage People</h1>
                <p className="text-gray-600 mt-1">Add, edit, and manage team members</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Person</span>
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

        {/* People Grid */}
        {loading.people ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredPeople.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeople.map((person) => (
              <div key={person.id} className="glass rounded-xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {person.image && (
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-16 h-16 rounded-full object-cover mb-4"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{person.name}</h3>
                    <p className="text-primary-600 text-sm mb-1">{person.title}</p>
                    <p className="text-gray-600 text-sm mb-3">{person.department}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(person)}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(person.id, person.name)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {person.bio && (
                  <p className="text-gray-700 text-sm mb-3 line-clamp-3">{person.bio}</p>
                )}
                
                {person.research_interests && person.research_interests.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-gray-900 text-sm font-medium mb-2">Research Interests:</h4>
                    <div className="flex flex-wrap gap-1">
                      {person.research_interests.slice(0, 3).map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full border border-primary-200"
                        >
                          {interest}
                        </span>
                      ))}
                      {person.research_interests.length > 3 && (
                        <span className="text-gray-500 text-xs">+{person.research_interests.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
                
                {person.email && (
                  <p className="text-gray-600 text-sm">{person.email}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Members Found in this Category</h3>
            <p className="text-gray-600 mb-6">
              We are seeking members for our {activeTab.replace('_', ' ')} team. Join us to contribute to cutting-edge research in sustainable energy and smart grid technologies.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleAdd}
                className="btn-primary"
              >
                Express Interest
              </button>
              <p className="text-sm text-gray-500">Join Our Research Team</p>
              <p className="text-sm text-gray-600">
                Interested in contributing to sustainable energy and smart grid research? We welcome collaborations with researchers, students, and industry partners.
              </p>
              <Link to="/contact" className="btn-secondary">
                Get In Touch
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPerson ? 'Edit Person' : 'Add New Person'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

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
                  <option value="advisors">Advisors</option>
                  <option value="team_members">Team Members</option>
                  <option value="collaborators">Collaborators</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order (ID for sorting)
                </label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter order number (1, 2, 3...)"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first. Leave empty for default ordering.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Research Interests (comma-separated)
                </label>
                <input
                  type="text"
                  name="research_interests"
                  value={formData.research_interests.join(', ')}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Smart Grid Technologies, Renewable Energy, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Social & Research Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Scholar
                    </label>
                    <input
                      type="url"
                      name="social_links.google_scholar"
                      value={formData.social_links.google_scholar}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ResearchGate
                    </label>
                    <input
                      type="url"
                      name="social_links.researchgate"
                      value={formData.social_links.researchgate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ORCID
                    </label>
                    <input
                      type="url"
                      name="social_links.orcid"
                      value={formData.social_links.orcid}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="social_links.linkedin"
                      value={formData.social_links.linkedin}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      name="social_links.github"
                      value={formData.social_links.github}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IEEE Profile
                    </label>
                    <input
                      type="url"
                      name="social_links.ieee"
                      value={formData.social_links.ieee}
                      onChange={handleInputChange}
                      className="form-input"
                    />
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
                  <span>{editingPerson ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPeople;