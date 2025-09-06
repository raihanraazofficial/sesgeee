import React, { useEffect, useState } from 'react';
import { ArrowUp, FolderOpen, Calendar, CheckCircle, Clock, Users, Search, Filter, ExternalLink, Building } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Projects = () => {
  const { projects, fetchData, loading } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetchData('projects');
  }, [fetchData]);

  useEffect(() => {
    if (projects.length > 0) {
      let filtered = projects;
      if (activeTab !== 'all') {
        filtered = projects.filter(project => project.status === activeTab);
      }
      setFilteredProjects(filtered);
    }
  }, [projects, activeTab]);

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
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
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

      {/* Filter Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredProjects.map((project) => {
                    const StatusIcon = getStatusIcon(project.status);
                    return (
                      <div key={project.id} className="research-card border border-gray-200 shadow-lg">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm border ${getStatusColor(project.status)}`}>
                              <StatusIcon className="h-4 w-4" />
                              <span className="capitalize">{project.status}</span>
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {project.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{project.year}</span>
                            </div>
                          </div>
                          
                          <button className="btn-secondary w-full">
                            View Project Details
                          </button>
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