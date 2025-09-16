import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ExternalLink, ArrowRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ResearchAreaDetail = () => {
  const { areaId } = useParams();
  const { researchAreas, fetchData, loading } = useData();
  const [area, setArea] = useState(null);

  useEffect(() => {
    // Fetch research areas if not already loaded
    if (researchAreas.length === 0) {
      fetchData('researchAreas');
    }
  }, [fetchData, researchAreas.length]);

  useEffect(() => {
    if (researchAreas.length > 0) {
      const foundArea = researchAreas.find(a => a.id === areaId);
      setArea(foundArea);
    }
  }, [researchAreas, areaId]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading.researchAreas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading research area..." />
      </div>
    );
  }

  if (!area) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Research Area Not Found</h1>
          <p className="text-gray-600 mb-8">The requested research area could not be found.</p>
          <Link to="/research" className="btn-primary">
            Back to Research Areas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        title={area.title}
        description=""
        backgroundImage={area.image}
        height="h-96"
      />

      {/* Back Navigation */}
      <section className="py-6 bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/research"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Research Areas</span>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Research Objectives - Redesigned Single Column */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">Research Objectives</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-6">
              {(area.research_objectives || [
                "Advance theoretical understanding of the field",
                "Develop practical solutions for real-world problems", 
                "Foster collaboration with industry partners",
                "Train next-generation researchers"
              ]).map((objective, index) => (
                <div key={index} className="group glass rounded-xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-800 font-semibold text-lg leading-relaxed group-hover:text-primary-700 transition-colors duration-300">
                        {objective}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Applications - Redesigned Single Column */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">Key Applications</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <div className="glass rounded-2xl p-8 border border-gray-200">
              <div className="space-y-6">
                {(area.key_applications || [
                  "Industrial Applications",
                  "Commercial Solutions", 
                  "Residential Systems",
                  "Research & Development"
                ]).map((application, index) => (
                  <div key={index} className="group flex items-center space-x-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="text-gray-800 font-semibold text-lg group-hover:text-primary-700 transition-colors duration-300 flex-1">
                      {application}
                    </span>
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="h-4 w-4 text-primary-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Link
              to="/research"
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Research</span>
            </Link>
            
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => window.close()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>Close Window</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchAreaDetail;