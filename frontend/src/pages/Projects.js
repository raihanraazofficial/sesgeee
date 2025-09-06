import React from 'react';
import { ArrowUp } from 'lucide-react';
import HeroSection from '../components/HeroSection';

const Projects = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* Coming Soon */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-xl p-12">
            <h2 className="text-4xl font-bold font-heading text-white mb-6">
              Projects Portal
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Our comprehensive projects management system is currently under development. 
              This will feature project categorization, search functionality, and detailed project information.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Current Projects</h3>
                <p className="text-gray-400 text-sm">Ongoing research and development initiatives</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Completed Projects</h3>
                <p className="text-gray-400 text-sm">Successfully finished research projects</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Future Projects</h3>
                <p className="text-gray-400 text-sm">Planned research initiatives</p>
              </div>
            </div>

            <p className="text-gray-400 mb-8">
              Contact us to learn more about our current research projects and collaboration opportunities.
            </p>

            <button className="btn-primary">
              Explore Collaboration Opportunities
            </button>
          </div>

          {/* Back to Top */}
          <div className="mt-12">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors mx-auto"
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