import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ExternalLink } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ResearchAreaDetail = () => {
  const { areaId } = useParams();
  const { researchAreas, loading } = useData();
  const [area, setArea] = useState(null);

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
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <LoadingSpinner text="Loading research area..." />
      </div>
    );
  }

  if (!area) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Research Area Not Found</h1>
          <p className="text-gray-400 mb-8">The requested research area could not be found.</p>
          <Link to="/research" className="btn-primary">
            Back to Research Areas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title={area.title}
        description={area.description}
        backgroundImage={area.image}
        height="h-96"
      />

      {/* Back Navigation */}
      <section className="py-6 bg-dark-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/research"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Research Areas</span>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-white mb-6">Overview</h2>
            <div className="glass rounded-xl p-8">
              <p className="text-gray-300 text-lg leading-relaxed">
                {area.details || `
                  This research area focuses on advancing ${area.title.toLowerCase()} through innovative approaches and cutting-edge technologies. 
                  Our team conducts comprehensive research to address current challenges and develop next-generation solutions that contribute 
                  to sustainable energy systems and smart grid infrastructure.
                  
                  Our research encompasses both theoretical foundations and practical applications, ensuring that our work has real-world impact. 
                  We collaborate with industry partners, government agencies, and international research institutions to drive innovation 
                  and implement solutions that benefit society and the environment.
                `}
              </p>
            </div>
          </div>

          {/* Research Focus Areas */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-white mb-6">Research Focus Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Theoretical Foundations and Modeling",
                "System Design and Optimization", 
                "Performance Analysis and Simulation",
                "Real-world Implementation and Testing",
                "Industry Collaboration and Partnerships",
                "Policy Development and Standards"
              ].map((focus, index) => (
                <div key={index} className="glass rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <h3 className="text-white font-medium">{focus}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Technologies */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-white mb-6">Key Technologies & Methods</h2>
            <div className="glass rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  "Advanced Modeling",
                  "Machine Learning", 
                  "IoT Integration",
                  "Data Analytics",
                  "Simulation Tools",
                  "Hardware Testing"
                ].map((tech, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">{tech.charAt(0)}</span>
                    </div>
                    <h3 className="text-white font-medium">{tech}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Projects */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-white mb-6">Current Projects</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((project) => (
                <div key={project} className="glass rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Research Project {project}: Advanced {area.title} Solutions
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Developing innovative solutions for {area.title.toLowerCase()} challenges through 
                        interdisciplinary research and collaboration with industry partners.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-primary-600/20 text-primary-400 px-2 py-1 rounded text-sm">
                          Ongoing
                        </span>
                        <span className="bg-secondary-600/20 text-secondary-400 px-2 py-1 rounded text-sm">
                          2024-2026
                        </span>
                      </div>
                    </div>
                    <button className="text-primary-400 hover:text-primary-300 ml-4">
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publications & Resources */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-white mb-6">Related Publications</h2>
            <div className="glass rounded-xl p-8">
              <p className="text-gray-300 mb-6">
                Our research in {area.title.toLowerCase()} has resulted in numerous publications in 
                top-tier journals and conferences. View our complete publication list for detailed information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/publications" className="btn-primary">
                  View All Publications
                </Link>
                <Link to="/projects" className="btn-secondary">
                  Related Projects
                </Link>
              </div>
            </div>
          </div>

          {/* Collaboration Opportunities */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-white mb-6">Collaboration Opportunities</h2>
            <div className="glass rounded-xl p-8">
              <p className="text-gray-300 text-lg mb-6">
                We welcome collaborations with researchers, industry partners, and students interested in 
                {area.title.toLowerCase()}. Join us in advancing this critical field of research.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-2">Research Partnerships</h3>
                  <p className="text-gray-400 text-sm">Academic and industry collaborations</p>
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-2">Student Opportunities</h3>
                  <p className="text-gray-400 text-sm">Graduate and undergraduate research</p>
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-2">Industry Projects</h3>
                  <p className="text-gray-400 text-sm">Applied research and development</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <Link to="/contact" className="btn-primary">
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>

          {/* Back to Top */}
          <div className="text-center">
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

export default ResearchAreaDetail;