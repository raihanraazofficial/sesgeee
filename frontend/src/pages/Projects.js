import React, { useEffect, useState } from 'react';
import { ArrowUp, FolderOpen, Calendar, CheckCircle, Clock, Users, Search, Filter, ExternalLink, Building } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Projects = () => {
  const { projects, fetchData, loading } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [sortOrder, setSortOrder] = useState('desc');

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
      
      // Sort projects
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'latest':
            comparison = new Date(b.created_at || b.start_date) - new Date(a.created_at || a.start_date);
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
        return 'text-green-600 bg-green-50 border-green-200';
      case 'ongoing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'planning':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTeamMembers = (members) => {
    if (!members || members.length === 0) return 'Not specified';
    if (typeof members === 'string') {
      return members;
    }
    return Array.isArray(members) ? members.join(', ') : 'Not specified';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Research Projects"
        description="Discover our current and completed research projects in sustainable energy and smart grid technologies, driving innovation and real-world impact."
        backgroundImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMHByb2plY3RzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85"
        height="h-96"
      />

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
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

            {/* Filter Controls */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                {[
                  { id: 'all', name: 'All Projects' },
                  { id: 'ongoing', name: 'Ongoing' },
                  { id: 'completed', name: 'Completed' },
                  { id: 'planning', name: 'Planning' }
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

              {/* Sort Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="latest">Latest First</option>
                    <option value="name">Project Name</option>
                    <option value="category">Category</option>
                    <option value="research_area">Research Area</option>
                  </select>
                </div>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm"
                >
                  {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center text-gray-600">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
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
                      <div key={project.id} className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        {/* Project Image */}
                        <div className="relative h-48 rounded-t-xl overflow-hidden">
                          <img
                            src={project.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMHByb2plY3RzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85"}
                            alt={project.name || 'Project image'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute top-4 right-4">
                            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm border backdrop-blur-sm ${getStatusColor(project.status)}`}>
                              <StatusIcon className="h-4 w-4" />
                              <span className="capitalize">{project.status}</span>
                            </span>
                          </div>
                          {!project.image && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                              <div className="text-center text-gray-500">
                                <FolderOpen className="h-12 w-12 mx-auto mb-2" />
                                <p className="text-sm">No Image Available</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          {/* Project Title */}
                          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                            {project.name}
                          </h3>
                          
                          {/* Short Description */}
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                          
                          {/* Duration */}
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Calendar className="h-4 w-4 text-primary-500" />
                            <span>
                              {formatDate(project.start_date)} - {formatDate(project.end_date)}
                            </span>
                          </div>
                          
                          {/* Team Leader */}
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Team Leader: </span>
                            <span className="text-sm text-gray-600">
                              {project.team_leader || 'Not specified'}
                            </span>
                          </div>
                          
                          {/* Team Members */}
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-700">Team Members: </span>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {formatTeamMembers(project.team_members)}
                            </p>
                          </div>
                          
                          {/* Divider */}
                          <hr className="border-gray-200 my-4" />
                          
                          {/* Bottom Section */}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Building className="h-4 w-4 text-primary-500" />
                                <span className="text-xs">
                                  <span className="font-medium">Funded By:</span> {project.funded_by || 'Not specified'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Users className="h-4 w-4 text-primary-500" />
                              <span className="text-xs">
                                {project.total_members || project.team_members?.length || 'N/A'} {project.total_members === 1 ? 'Member' : 'Members'}
                              </span>
                            </div>
                          </div>
                          
                          {/* View Details Button - Only show if project link exists */}
                          {project.project_link && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <a
                                href={project.project_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary w-full flex items-center justify-center space-x-2"
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
                  <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    No Projects Found
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    {activeTab === 'all' 
                      ? 'Our projects database is being updated. Please check back soon or contact us for more information.'
                      : `No ${activeTab} projects available at the moment. Try switching to a different category.`
                    }
                  </p>
                  <div className="space-x-4">
                    {activeTab !== 'all' && (
                      <button 
                        onClick={() => setActiveTab('all')}
                        className="btn-secondary"
                      >
                        View All Projects
                      </button>
                    )}
                    <button className="btn-primary">
                      Explore Collaboration Opportunities
                    </button>
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