import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import HeroSection from '../components/HeroSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { testFirebaseConnection, addTestNewsItem } from '../utils/firebaseDebug';

const News = () => {
  const { fetchData } = useData();
  const [news, setNews] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadSettings = useCallback(async () => {
    try {
      const settingsData = await fetchData('settings');
      if (settingsData && settingsData.length > 0) {
        setSettings(settingsData[0]);
      } else if (settingsData && !Array.isArray(settingsData)) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, [fetchData]);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      const newsData = await fetchData('news', { 
        status: 'published',
        sort_by: 'published_date',
        sort_order: 'desc'
      });
      setNews(newsData || []);
    } catch (error) {
      console.error('Error loading news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    loadNews();
    loadSettings();
  }, [loadNews, loadSettings]);

  // Debug function to test Firebase connection
  const debugFirebase = async () => {
    console.log('🔧 Starting Firebase debug test...');
    const result = await testFirebaseConnection();
    console.log('🔧 Firebase test result:', result);
    
    if (result.success && result.newsCount === 0) {
      console.log('📝 No news found, adding test item...');
      const addResult = await addTestNewsItem();
      console.log('📝 Add test result:', addResult);
      
      if (addResult.success) {
        console.log('🔄 Reloading news after adding test item...');
        setTimeout(() => loadNews(), 2000);
      }
    }
  };

  // Filter and sort news
  const filteredNews = useMemo(() => {
    let filtered = news.filter(item => {
      const matchesSearch = !searchTerm || 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory && item.status === 'published';
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.published_date);
          bValue = new Date(b.published_date);
          break;
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        default:
          aValue = new Date(a.published_date);
          bValue = new Date(b.published_date);
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [news, searchTerm, categoryFilter, sortBy, sortOrder]);

  // Separate featured and regular news
  const featuredNews = filteredNews.filter(item => item.is_featured);
  const regularNews = filteredNews.filter(item => !item.is_featured);

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const getCategoryBadge = (category) => {
    const categoryStyles = {
      news: 'bg-blue-100 text-blue-800 border-blue-300',
      events: 'bg-green-100 text-green-800 border-green-300',
      upcoming_events: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    
    const categoryNames = {
      news: 'News',
      events: 'Events',
      upcoming_events: 'Upcoming Events'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryStyles[category] || categoryStyles.news}`}>
        {categoryNames[category] || 'News'}
      </span>
    );
  };

  const getFeaturedBadge = () => (
    <span className="bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-1 rounded-full text-sm font-medium border">
      Featured
    </span>
  );

  const createSlug = (title, id) => {
    const slug = title?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'untitled';
    return `${slug}-${id}`;
  };

  const getNewsUrl = (item) => {
    const slug = createSlug(item.title, item.id);
    
    switch (item.category) {
      case 'events':
        return `/events/${slug}`;
      case 'upcoming_events':
        return `/upcoming-events/${slug}`;
      default:
        return `/news/${slug}`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Fixed like other pages */}
      <HeroSection
        title="News & Events"
        backgroundImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxuZXdzJTIwZXZlbnRzfGVufDB8fHx8MTc1NjUzNTE2OHww&ixlib=rb-4.1.0&q=85"
        height="h-96"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Filter Buttons */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 border-2 ${
                  categoryFilter === 'all'
                    ? 'bg-gray-100 text-gray-800 border-gray-300 shadow-md'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              <button
                onClick={() => {
                  setCategoryFilter('news');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 border-2 ${
                  categoryFilter === 'news'
                    ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-md'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50'
                }`}
              >
                News
              </button>
              <button
                onClick={() => {
                  setCategoryFilter('events');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 border-2 ${
                  categoryFilter === 'events'
                    ? 'bg-green-100 text-green-800 border-green-300 shadow-md'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => {
                  setCategoryFilter('upcoming_events');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 border-2 ${
                  categoryFilter === 'upcoming_events'
                    ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-md'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-purple-50'
                }`}
              >
                Upcoming Events
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search news & events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
              </select>

              {/* Sort Order */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading news & events..." />
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">No news or events found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your search terms or filters.</p>
              
              {/* Debug button for testing Firebase connection */}
              <div className="mt-6">
                <button
                  onClick={debugFirebase}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  🔧 Debug Firebase Connection
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Click to test Firebase connection and add sample data if needed
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured News Section */}
              {featuredNews.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-lg font-medium mr-3">
                      Featured News
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredNews.slice(0, 4).map((item) => (
                      <article key={item.id} className="group bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                        {item.image && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.image_alt || item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                              {getFeaturedBadge()}
                              {getCategoryBadge(item.category)}
                            </div>
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatDate(item.published_date)}</span>
                            <span className="mx-2">•</span>
                            <span>by {item.author}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                            {item.title}
                          </h3>
                          
                          {item.excerpt && (
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {item.excerpt}
                            </p>
                          )}
                          
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <Link
                            to={getNewsUrl(item)}
                            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group-hover:gap-2 transition-all duration-200"
                          >
                            Read Full Story
                            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Latest News Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
                <div className="space-y-6">
                  {regularNews.slice(0, 6).map((item) => (
                    <article key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {item.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.image_alt || item.title}
                              className="w-full lg:w-32 h-24 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            {getCategoryBadge(item.category)}
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{formatTimeAgo(item.published_date)}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                            <Link to={getNewsUrl(item)}>
                              {item.title}
                            </Link>
                          </h3>
                          
                          {item.excerpt && (
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {item.excerpt}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">by {item.author}</span>
                            <Link
                              to={getNewsUrl(item)}
                              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm hover:gap-1 transition-all duration-200"
                            >
                              Read More
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const pageNum = currentPage <= 3 
                        ? index + 1 
                        : currentPage + index - 2;
                      
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-primary-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Upcoming Events Calendar */}
              {(categoryFilter === 'all' || categoryFilter === 'upcoming_events') && settings.google_calendar_url && (
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Calendar className="h-6 w-6 mr-3 text-primary-600" />
                    Upcoming Events Calendar
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="relative">
                      <iframe
                        src={settings.google_calendar_url}
                        style={{ border: 0 }}
                        width="100%"
                        height="400"
                        frameBorder="0"
                        scrolling="no"
                        title="Upcoming Events Calendar"
                        className="rounded-lg"
                        onError={() => console.error('Calendar iframe failed to load')}
                        onLoad={() => console.log('Calendar iframe loaded successfully')}
                      ></iframe>
                      <div className="absolute inset-0 pointer-events-none bg-transparent rounded-lg" style={{zIndex: 1}}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 text-center">
                      Stay updated with our latest events and workshops. 
                      <a 
                        href="https://calendar.google.com/calendar" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 ml-1 inline-flex items-center"
                      >
                        View in Google Calendar
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </p>
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;