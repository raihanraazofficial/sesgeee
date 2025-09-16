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
            <div className="space-y-12">
              {researchAreas.map((area, index) => (
                <div key={area.id} className="glass rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                    {/* Image Section */}
                    <div className="lg:col-span-1">
                      <div className="relative h-64 lg:h-full rounded-lg overflow-hidden">
                        <img
                          src={area.image}
                          alt={area.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="lg:col-span-2 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{area.title}</h3>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                          {area.detailed_description || area.description}
                        </p>
                        
                        {/* Research Focus Badge */}
                        <div className="mb-6">
                          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-full">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-primary-700 font-medium text-sm">Active Research Area</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex justify-end">
                        <Link
                          to={`/research/${area.id}`}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-md"
                        >
                          <span>Learn More</span>
                          <ArrowRight className="h-4 w-4" />
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