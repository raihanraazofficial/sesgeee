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
        enableAnimations={false}
      />

      {/* Research Areas Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our multidisciplinary research spans across smart grid technologies, renewable energy systems, 
              and AI-driven energy solutions to create a sustainable future.
            </p>
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
                        
                        {/* Stats Row */}
                        <div className="flex items-center space-x-6 mb-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                            <span className="text-gray-500">0 Projects</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                            <span className="text-gray-500">0 Papers</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-500">Multiple Researchers</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-500 text-xs">Real-time data</span>
                          </div>
                        </div>

                        {/* Research Team Preview */}
                        <div className="mb-6">
                          <h4 className="text-gray-900 font-medium mb-3">Research Team:</h4>
                          <div className="flex items-center space-x-2">
                            {/* Mock team member images */}
                            <img 
                              src="https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Shameem%20Ahmad.jpg"
                              alt="Team member"
                              className="w-10 h-10 rounded-full border-2 border-primary-500"
                            />
                            <img 
                              src="https://i.ibb.co.com/mVjdfL22/Nazmul-sir.jpg"
                              alt="Team member"
                              className="w-10 h-10 rounded-full border-2 border-secondary-500"
                            />
                            <img 
                              src="https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Amirul%20Islam.jpg"
                              alt="Team member"
                              className="w-10 h-10 rounded-full border-2 border-green-500"
                            />
                            {index % 2 === 0 && (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border border-gray-300">
                                +{Math.floor(Math.random() * 3) + 1}
                              </div>
                            )}
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

      {/* Research Impact & Applications */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">
              Research Impact & Applications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our research drives innovation across multiple domains, creating real-world impact in sustainable energy systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="glass rounded-xl p-6 text-center card-hover border border-gray-200 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <area.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{area.title}</h3>
                <p className="text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interdisciplinary Approach */}
      <section className="py-20 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">
              Interdisciplinary Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our research combines expertise from multiple disciplines to tackle complex energy challenges 
              through innovative, holistic solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {disciplines.map((discipline, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-green-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-xl">{discipline.split(' ')[0][0]}</span>
                </div>
                <h3 className="text-gray-900 font-semibold text-lg">{discipline}</h3>
              </div>
            ))}
          </div>
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