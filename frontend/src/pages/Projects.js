import React, { useEffect, useState, useMemo } from 'react';
import { ArrowUp, FolderOpen, Calendar, CheckCircle, Clock, Users, Search, Filter, ExternalLink, ClipboardList, BarChart3 } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Projects = () => {
  const { projects, fetchData, loading } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchData('projects');
  }, [fetchData]);

  useEffect(() => {
    if (projects.length > 0) {
      let filtered = projects;
      
      // Filter by category
      if (activeTab !== 'all') {
        filtered = filtered.filter(project => project.status === activeTab);
      }
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(project => 
          project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.research_area?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Sort projects - prioritize by start_date (newest first), then by created_at
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'latest':
            // First try to sort by start_date, then fallback to created_at
            const aDate = new Date(a.start_date || a.created_at || 0);
            const bDate = new Date(b.start_date || b.created_at || 0);
            comparison = bDate - aDate; // newest first
            break;
          case 'category':
            comparison = (a.status || '').localeCompare(b.status || '');
            break;
          case 'research_area':
            comparison = (a.research_area || '').localeCompare(b.research_area || '');
            break;
          case 'name':
            comparison = (a.name || '').localeCompare(b.name || '');
            break;
          default:
            comparison = 0;
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
      
      setFilteredProjects(filtered);
    }
  }, [projects, activeTab, searchTerm, sortBy, sortOrder]);

  // Calculate project statistics
  const projectStats = useMemo(() => {
    const total = projects.length;
    const ongoing = projects.filter(p => p.status === 'ongoing').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    
    return { total, ongoing, completed };
  }, [projects]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'ongoing':
        return Clock;
      default:
        return FolderOpen;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100 border-green-300';
      case 'ongoing':
        return 'text-amber-700 bg-amber-100 border-amber-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const truncateDescription = (description, wordLimit = 100) => {
    if (!description) return 'No description available for this research project.';
    
    const words = description.split(' ');
    if (words.length <= wordLimit) return description;
    
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric' 
      });
    } catch (error) {
      return 'Invalid date';
    }
  };



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Projects"
        backgroundImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMHByb2plY3RzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85"
        height="h-64"
      />

      {/* Summary Cards Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Projects Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{projectStats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Ongoing Projects Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Ongoing Projects</p>
                  <p className="text-3xl font-bold text-yellow-600">{projectStats.ongoing}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Completed Projects Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completed Projects</p>
                  <p className="text-3xl font-bold text-green-600">{projectStats.completed}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Search Bar */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search projects by name, description, or research area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Category Tabs - Centered */}
            <div className="flex justify-center">
              <div className="flex bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                {[
                  { id: 'all', name: 'All Projects' },
                  { id: 'ongoing', name: 'Ongoing' },
                  { id: 'completed', name: 'Completed' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Controls - Moved to separate row, centered */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-4 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 min-w-[140px]"
                  >
                    <option value="latest">Latest First</option>
                    <option value="name">Project Name</option>
                    <option value="category">Category</option>
                    <option value="research_area">Research Area</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 font-medium">Order:</span>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className={`px-4 py-2 border rounded-md transition-colors text-sm font-medium min-w-[120px] ${
                      sortOrder === 'desc' 
                        ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading.projects ? (
            <LoadingSpinner text="Loading projects..." />
          ) : (
            <>
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => {
                    const StatusIcon = getStatusIcon(project.status);
                    return (
                      <div key={project.id} className="group bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                        {/* Project Image */}
                        <div className="relative h-48 overflow-hidden flex-shrink-0">
                          <img
                            src={project.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMHByb2plY3RzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85"}
                            alt={project.name || 'Project image'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute top-4 right-4 z-10">
                            <span className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold shadow-xl border border-white/20 ${getStatusColor(project.status)}`}>
                              <StatusIcon className="h-5 w-5" />
                              <span className="capitalize">{project.status || 'Unknown'}</span>
                            </span>
                          </div>
                          {!project.image && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-center text-gray-500">
                                <FolderOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm font-medium">Research Project</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          {/* Project Title - Show full title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                            {project.name || 'Untitled Project'}
                          </h3>
                          
                          {/* Description - Truncated to 100 words */}
                          <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                            {truncateDescription(project.description)}
                          </p>
                          
                          {/* Project Meta Information */}
                          <div className="space-y-3 mb-4">
                            {/* Duration */}
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-primary-500 flex-shrink-0" />
                              <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                            </div>
                            
                            {/* Team Leader */}
                            {project.team_leader && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Team Leader:</span> {project.team_leader}
                              </div>
                            )}
                            
                            {/* Team Members */}
                            {project.team_members && project.team_members.length > 0 && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Team Members:</span> {
                                  Array.isArray(project.team_members) 
                                    ? project.team_members.join(', ')
                                    : project.team_members
                                }
                              </div>
                            )}
                          </div>
                          
                          {/* Divider */}
                          <hr className="border-gray-200 my-4" />
                          
                          {/* Bottom Section - Always Fixed at Bottom */}
                          <div className="space-y-2 mt-auto">
                            {/* Funding Information - Only show if funding_amount exists */}
                            {project.funding_amount && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Funding:</span> {project.funding_amount} {project.currency || 'BDT'}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Funded By:</span> {project.funded_by || 'Not specified'}
                              </div>
                              <div className="flex items-center space-x-1 text-sm">
                                <Users className="h-4 w-4 text-primary-500" />
                                <span className="text-gray-600 font-medium">
                                  {project.total_members || project.team_members?.length || 0} Members
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* View Details Button - Only show if project link exists */}
                          {project.project_link && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <a
                                href={project.project_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary w-full flex items-center justify-center space-x-2 group-hover:bg-primary-700 transition-colors"
                              >
                                <span>View Project Details</span>
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <ClipboardList className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                      No Projects Available
                    </h3>
                    <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                      {activeTab === 'all' 
                        ? 'We are currently working on exciting new research projects. Our team is developing innovative solutions in sustainable energy and smart grid technologies. Check back soon for updates on our latest initiatives.'
                        : `No ${activeTab} projects are currently available. Our research portfolio includes various stages of development. Please explore other categories or visit our research areas page to learn more about our ongoing work.`
                      }
                    </p>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {activeTab !== 'all' && (
                          <button 
                            onClick={() => setActiveTab('all')}
                            className="btn-secondary"
                          >
                            View All Projects
                          </button>
                        )}
                        <a href="/research" className="btn-primary">
                          Explore Research Areas
                        </a>
                      </div>
                      <p className="text-sm text-gray-400 mt-4">
                        For collaboration opportunities, please <a href="/contact" className="text-primary-600 hover:text-primary-700 underline">contact us</a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Back to Top */}
          <div className="mt-12 text-center">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mx-auto"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;