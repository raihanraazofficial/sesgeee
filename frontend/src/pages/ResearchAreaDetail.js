import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ExternalLink } from 'lucide-react';
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
        description={area.description}
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Research Overview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6">Research Overview</h2>
            <div className="glass rounded-xl p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                {area.research_overview || `
                  This research area focuses on advancing ${area.title.toLowerCase()} through innovative approaches and cutting-edge technologies. 
                  Our team conducts comprehensive research to address current challenges and develop next-generation solutions that contribute 
                  to sustainable energy systems and smart grid infrastructure.
                `}
              </p>
            </div>
          </div>

          {/* Research Objectives */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6">Research Objectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(area.research_objectives || [
                "Advance theoretical understanding of the field",
                "Develop practical solutions for real-world problems", 
                "Foster collaboration with industry partners",
                "Train next-generation researchers"
              ]).map((objective, index) => (
                <div key={index} className="glass rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 font-medium">{objective}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Applications */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6">Key Applications</h2>
            <div className="glass rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(area.key_applications || [
                  "Industrial Applications",
                  "Commercial Solutions", 
                  "Residential Systems",
                  "Research & Development"
                ]).map((application, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">{application}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Research Output */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6">Research Output</h2>
            <div className="glass rounded-xl p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {area.research_output || `Our research in ${area.title.toLowerCase()} has resulted in numerous publications in top-tier journals and conferences, along with several patent applications and prototype developments.`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-2xl">📚</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">Publications</h3>
                  <p className="text-gray-600 text-sm">Journal articles and conference papers</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-2xl">🔬</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">Projects</h3>
                  <p className="text-gray-600 text-sm">Active research projects and collaborations</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-2xl">💡</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">Innovation</h3>
                  <p className="text-gray-600 text-sm">Patents and technology transfer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Related Research */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6">Explore Related Research</h2>
            <div className="glass rounded-xl p-8">
              <p className="text-gray-700 text-lg mb-8">
                Discover our latest publications, ongoing projects, and collaborative opportunities in {area.title.toLowerCase()}.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">📚</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-3">View Publications</h3>
                  <p className="text-gray-600 text-sm mb-4">Explore our research papers and academic contributions</p>
                  <Link to="/publications" className="btn-primary">
                    View Publications
                  </Link>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
                  <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">🔬</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-3">View Projects</h3>
                  <p className="text-gray-600 text-sm mb-4">Discover our ongoing research projects and collaborations</p>
                  <Link to="/projects" className="btn-secondary">
                    View Projects
                  </Link>
                </div>
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