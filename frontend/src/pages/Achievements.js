import React, { useEffect, useState } from 'react';
import { ArrowUp, Award, DollarSign, Users, Calendar } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Achievements = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Achievements"
        description="Celebrating our research milestones, awards, recognitions, and contributions to the sustainable energy and smart grid research community."
        backgroundImage="https://images.unsplash.com/photo-1553484771-371a605b060b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudHN8ZW58MHx8fHwxNzU2NjU0MTQ5fDA&ixlib=rb-4.1.0&q=85"
        height="h-96"
      />

      {/* Coming Soon */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-xl p-12">
            <h2 className="text-4xl font-bold font-heading text-white mb-6">
              Achievements Portal
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Our achievements showcase is currently under development. 
              This will feature awards, recognitions, milestones, and significant contributions 
              to the research community.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Research Awards</h3>
                <p className="text-gray-400 text-sm">Recognition for outstanding research contributions</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Grant Success</h3>
                <p className="text-gray-400 text-sm">Successful funding acquisitions</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Community Impact</h3>
                <p className="text-gray-400 text-sm">Contributions to society and industry</p>
              </div>
            </div>

            <p className="text-gray-400 mb-8">
              Stay tuned as we prepare to showcase our significant achievements and milestones.
            </p>

            <button className="btn-primary">
              View Research Impact
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

export default Achievements;