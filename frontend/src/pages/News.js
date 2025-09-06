import React, { useEffect, useState } from 'react';
import { ArrowUp, Calendar, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const News = () => {
  const { news, fetchData, loading } = useData();
  const [featuredNews, setFeaturedNews] = useState([]);
  const [recentNews, setRecentNews] = useState([]);

  useEffect(() => {
    fetchData('news');
  }, [fetchData]);

  useEffect(() => {
    if (news.length > 0) {
      const featured = news.filter(item => item.is_featured);
      const recent = news.filter(item => !item.is_featured);
      setFeaturedNews(featured);
      setRecentNews(recent);
    }
  }, [news]);

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
        enableAnimations={false}
      />

      {/* News & Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading.news ? (
            <LoadingSpinner text="Loading news..." />
          ) : news.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass rounded-xl p-12 border border-gray-200 shadow-lg">
                <h2 className="text-4xl font-bold font-heading text-gray-900 mb-6">
                  News & Events Portal
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Our comprehensive news and events system is currently under development. 
                  This will feature real-time updates, event calendars, and blog-style articles 
                  with rich text editing capabilities.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-gray-900 font-semibold mb-2">Latest News</h3>
                    <p className="text-gray-600 text-sm">Real-time updates on research developments</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-gray-900 font-semibold mb-2">Event Calendar</h3>
                    <p className="text-gray-600 text-sm">Interactive calendar for upcoming events</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-gray-900 font-semibold mb-2">Rich Content</h3>
                    <p className="text-gray-600 text-sm">WordPress-style editor with LaTeX support</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-8">
                  Meanwhile, please check our other sections for research updates and contact us for the latest information.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn-primary">
                    Subscribe for Updates
                  </button>
                  <Link to="/contact" className="btn-secondary">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured News */}
              {featuredNews.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold font-heading text-gray-900 mb-8">Featured News</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredNews.map((item) => (
                      <div key={item.id} className="research-card border border-gray-200 shadow-lg">
                        <div className="relative h-64">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxuZXdzJTIwZXZlbnRzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(item.published_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Link
                              to={`/news/${item.id}`}
                              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                            >
                              <span>Read More</span>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent News */}
              {recentNews.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold font-heading text-gray-900 mb-8">Recent News</h2>
                  <div className="space-y-6">
                    {recentNews.map((item) => (
                      <div key={item.id} className="glass rounded-xl p-6 card-hover border border-gray-200 shadow-lg">
                        <div className="flex space-x-6">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxuZXdzJTIwZXZlbnRzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85"}
                            alt={item.title}
                            className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{new Date(item.published_date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <Link
                                to={`/news/${item.id}`}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                              >
                                Read More
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Back to Top */}
          <div className="mt-12 text-center">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mx-auto"
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