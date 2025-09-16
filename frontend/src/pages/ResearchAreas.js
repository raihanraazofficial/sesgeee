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
                        <div className="mb-6">
                          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 group-hover:text-primary-700 transition-colors duration-300">
                            {area.title}
                          </h3>
                        </div>
                        
                        <div className="mb-8">
                          <p className="text-gray-600 text-lg leading-relaxed">
                            {area.detailed_description || area.description}
                          </p>
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