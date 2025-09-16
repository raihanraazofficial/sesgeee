import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ResearchAreas = () => {
  const { researchAreas, fetchData, loading } = useData();

  useEffect(() => {
    fetchData('researchAreas');
  }, [fetchData]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Research Areas"
        backgroundImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MHx8fHwxNzU2NjU0MTQ5fDA&ixlib=rb-4.1.0&q=85"
        height="h-96"
        enableAnimations={false}
      />

      {/* Research Areas Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
          </div>

          {loading.researchAreas ? (
            <LoadingSpinner text="Loading research areas..." />
          ) : (
                {/* Research Areas Grid */}
                <div className="space-y-8">
                  {researchAreas.map((area, index) => (
                    <div key={area.id} className="group glass rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 hover:border-primary-300">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                        {/* Image Section - Enhanced with overlay */}
                        <div className="lg:col-span-2 relative">
                          <div className="relative h-72 lg:h-80 overflow-hidden">
                            <img
                              src={area.image}
                              alt={area.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 via-transparent to-secondary-500/10" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent h-24" />
                          </div>
                        </div>
                        
                        {/* Content Section - Redesigned */}
                        <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/50">
                          <div className="flex-grow">
                            <div className="mb-4">
                              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors duration-300">
                                {area.title}
                              </h3>
                              
                              {/* Research Focus Badge */}
                              <div className="mb-6">
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-full">
                                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></div>
                                  <span className="text-primary-700 font-medium text-sm">Active Research Area</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-8">
                              <p className="text-gray-600 text-lg leading-relaxed line-clamp-4">
                                {area.detailed_description || area.description}
                              </p>
                            </div>

                            {/* Enhanced Key Highlights */}
                            <div className="mb-6">
                              <h4 className="text-gray-900 font-semibold mb-4 flex items-center">
                                <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full mr-2"></div>
                                Key Research Focus
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-200 transition-colors">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-gray-700 text-sm font-medium">Advanced Technologies</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-200 transition-colors">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-gray-700 text-sm font-medium">Sustainable Solutions</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Button - Enhanced */}
                          <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Link
                              to={`/research/${area.id}`}
                              className="group/btn bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                              <span>Learn More</span>
                              <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          )}
        </div>
      </section>





      {/* Back to Top */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mx-auto"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ResearchAreas;