import React from 'react';
import { ArrowUp } from 'lucide-react';
import HeroSection from '../components/HeroSection';

const News = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="News & Events"
        description="Stay updated with our latest research developments, achievements, events, and announcements from the world of sustainable energy and smart grid research."
        backgroundImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxuZXdzJTIwZXZlbnRzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85"
        height="h-96"
      />

      {/* Coming Soon */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-xl p-12">
            <h2 className="text-4xl font-bold font-heading text-white mb-6">
              News & Events Portal
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Our comprehensive news and events system is currently under development. 
              This will feature real-time updates, event calendars, and blog-style articles 
              with rich text editing capabilities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Latest News</h3>
                <p className="text-gray-400 text-sm">Real-time updates on research developments</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Event Calendar</h3>
                <p className="text-gray-400 text-sm">Interactive calendar for upcoming events</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Rich Content</h3>
                <p className="text-gray-400 text-sm">WordPress-style editor with LaTeX support</p>
              </div>
            </div>

            <p className="text-gray-400 mb-8">
              Meanwhile, please check our other sections for research updates and contact us for the latest information.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Subscribe for Updates
              </button>
              <button className="btn-secondary">
                Contact Us
              </button>
            </div>
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

export default News;