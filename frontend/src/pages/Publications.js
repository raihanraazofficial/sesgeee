import React, { useEffect, useState } from 'react';
import { ArrowUp, Search, BookOpen, ExternalLink } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Publications = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Publications"
        description="Explore our research publications in sustainable energy and smart grid technologies. Discover cutting-edge research that's shaping the future of energy systems."
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxwdWJsaWNhdGlvbnN8ZW58MHx8fHwxNzU2NjU0MTQ5fDA&ixlib=rb-4.1.0&q=85"
        height="h-96"
      />

      {/* Coming Soon */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-xl p-12">
            <h2 className="text-4xl font-bold font-heading text-white mb-6">
              Publications Portal
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Our comprehensive publications system is currently under development. 
              This will feature IEEE-styled citations, advanced search and filtering, 
              and real-time statistics.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">IEEE Style Citations</h3>
                <p className="text-gray-400 text-sm">Journal articles, conference proceedings, and book chapters</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Advanced Search</h3>
                <p className="text-gray-400 text-sm">Filter by author, year, research area, and keywords</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Real-time Stats</h3>
                <p className="text-gray-400 text-sm">Live publication counts and citation metrics</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-primary-600/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary-400 mb-1">16</div>
                <div className="text-sm text-gray-400">Total Publications</div>
              </div>
              <div className="bg-secondary-600/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-secondary-400 mb-1">182</div>
                <div className="text-sm text-gray-400">Total Citations</div>
              </div>
              <div className="bg-primary-600/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary-400 mb-1">2025</div>
                <div className="text-sm text-gray-400">Latest Year</div>
              </div>
              <div className="bg-secondary-600/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-secondary-400 mb-1">8</div>
                <div className="text-sm text-gray-400">Research Areas</div>
              </div>
            </div>

            <p className="text-gray-400 mb-8">
              Meanwhile, please contact us for specific publication requests or academic collaborations.
            </p>

            <button className="btn-primary">
              Request Publication Access
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

export default Publications;