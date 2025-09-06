import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, Zap, Network, Cpu, Shield } from 'lucide-react';
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

  const impactAreas = [
    {
      title: "Grid Modernization",
      description: "Upgrading infrastructure for 21st century energy needs",
      icon: Network
    },
    {
      title: "Clean Energy Transition", 
      description: "Accelerating adoption of renewable energy sources",
      icon: Zap
    },
    {
      title: "AI-Driven Optimization",
      description: "Intelligent systems for maximum efficiency",
      icon: Cpu
    },
    {
      title: "Energy Security",
      description: "Protecting critical infrastructure from threats",
      icon: Shield
    }
  ];

  const disciplines = [
    "Electrical Engineering",
    "Computer Science", 
    "Environmental Science",
    "Policy & Economics"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Research Areas"
        description="Explore our comprehensive research domains that are driving innovation in sustainable energy and smart grid technologies."
        backgroundImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MHx8fHwxNzU2NjU0MTQ5fDA&ixlib=rb-4.1.0&q=85"
        height="h-96"
      />

      {/* Research Areas Grid */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading.researchAreas ? (
            <LoadingSpinner text="Loading research areas..." />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {researchAreas.slice(0, 6).map((area) => (
                  <div key={area.id} className="research-card">
                    <div className="relative h-48">
                      <img
                        src={area.image}
                        alt={area.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-3">{area.title}</h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">{area.description}</p>
                      <Link
                        to={`/research/${area.id}`}
                        className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Center the 7th research area if it exists */}
              {researchAreas.length === 7 && (
                <div className="flex justify-center mt-8">
                  <div className="research-card max-w-md">
                    <div className="relative h-48">
                      <img
                        src={researchAreas[6].image}
                        alt={researchAreas[6].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-3">{researchAreas[6].title}</h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">{researchAreas[6].description}</p>
                      <Link
                        to={`/research/${researchAreas[6].id}`}
                        className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Research Impact & Applications */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-white mb-4">
              Research Impact & Applications
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our research drives innovation across multiple domains, creating real-world impact in sustainable energy systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="glass rounded-xl p-6 text-center card-hover">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <area.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{area.title}</h3>
                <p className="text-gray-300">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interdisciplinary Approach */}
      <section className="py-20 bg-gradient-to-r from-dark-900 via-primary-900 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-white mb-4">
              Interdisciplinary Approach
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Our research combines expertise from multiple disciplines to tackle complex energy challenges 
              through innovative, holistic solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {disciplines.map((discipline, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-green-600 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                  <span className="text-white font-bold text-xl">{discipline.split(' ')[0][0]}</span>
                </div>
                <h3 className="text-white font-semibold text-lg">{discipline}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back to Top */}
      <section className="py-12 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors mx-auto"
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