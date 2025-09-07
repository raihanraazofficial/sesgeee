import React, { useEffect, useState } from 'react';
import { ArrowUp, Calendar, Clock, ExternalLink, Search, Filter, SortDesc, Download, Share2, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';
import GoogleCalendar from '../components/GoogleCalendar';

const News = () => {
  const { news, fetchData, loading, settings } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState('');
  const itemsPerPage = 10;

  // Get calendar link from settings or from an event with calendar link
  const getCalendarLink = () => {
    // First try to get from settings
    if (settings?.google_calendar_link) {
      return settings.google_calendar_link;
    }
    
    // Otherwise get from any event that has a calendar link
    const eventWithCalendar = news.find(item => 
      (item.category === 'events' || item.category === 'upcoming_events') && 
      item.google_calendar_link
    );
    
    return eventWithCalendar?.google_calendar_link || null;
  };

  useEffect(() => {
    fetchData('news');
    fetchData('settings');
  }, [fetchData]);

  useEffect(() => {
    if (news.length > 0) {
      let filtered = [...news];

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'featured') {
          filtered = filtered.filter(item => item.is_featured === true);
        } else {
          filtered = filtered.filter(item => item.category === selectedCategory);
        }
      }

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          (item.title || '').toLowerCase().includes(search) ||
          (item.excerpt || '').toLowerCase().includes(search) ||
          (item.author || '').toLowerCase().includes(search) ||
          (Array.isArray(item.tags) ? item.tags.join(' ') : '').toLowerCase().includes(search)
        );
      }

      // Sort
      filtered.sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.published_date || 0) - new Date(a.published_date || 0);
        } else if (sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        return 0;
      });

      setFilteredItems(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    } else {
      setFilteredItems([]);
    }
  }, [news, selectedCategory, searchTerm, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);
  
  // Separate featured and regular news for display
  const featuredNews = currentItems.filter(item => item.is_featured === true);
  const regularNews = currentItems.filter(item => item.is_featured !== true);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = parseInt(goToPage);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setGoToPage('');
    }
  };

  const categoryButtons = [
    { value: 'all', label: 'All Items', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300' },
    { value: 'news', label: 'News', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300' },
    { value: 'events', label: 'Events', color: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300' },
    { value: 'upcoming_events', label: 'Upcoming Events', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300' },
    { value: 'featured', label: 'Featured', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300' }
  ];

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
            <LoadingSpinner text="Loading news and events..." />
          ) : (
            <>
              {/* Category Buttons */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-3 justify-center">
                  {categoryButtons.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.value 
                          ? category.color.replace('hover:', '') 
                          : category.color
                      } ${selectedCategory === category.value ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search news, events, or author..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <SortDesc className="text-gray-400 h-5 w-5" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="title">Sort by Title</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Results */}
              {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="glass rounded-xl p-12 border border-gray-200 shadow-lg">
                    <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6">
                      {news.length === 0 ? 'No News & Events Found' : 'No Results Found'}
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                      {news.length === 0 
                        ? 'There are currently no news articles or events published. Please check back later for updates.'
                        : searchTerm || selectedCategory !== 'all'
                          ? 'No items match your current search criteria. Try adjusting your filters or search terms.'
                          : 'No items found in the selected category.'
                      }
                    </p>
                    
                    {(searchTerm || selectedCategory !== 'all') && (
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('all');
                          }}
                          className="btn-primary"
                        >
                          Clear Filters
                        </button>
                        <Link to="/contact" className="btn-secondary">
                          Contact Us
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="glass rounded-xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex flex-col lg:flex-row">
                        {item.image && (
                          <div className="lg:w-1/3 h-64 lg:h-auto">
                            <img
                              src={item.image}
                              alt={item.image_alt || item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className={`p-6 ${item.image ? 'lg:w-2/3' : 'w-full'}`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                  item.category === 'news' ? 'text-blue-800 bg-blue-100 border-blue-200' :
                                  item.category === 'events' ? 'text-green-800 bg-green-100 border-green-200' :
                                  item.category === 'upcoming_events' ? 'text-purple-800 bg-purple-100 border-purple-200' :
                                  'text-gray-800 bg-gray-100 border-gray-200'
                                }`}>
                                  {item.category === 'upcoming_events' ? 'Upcoming Events' : 
                                   item.category?.charAt(0).toUpperCase() + item.category?.slice(1) || 'News'}
                                </span>
                                {item.is_featured && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-yellow-800 bg-yellow-100 border border-yellow-200">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                                <Link to={`/news/${item.id}`}>
                                  {item.title}
                                </Link>
                              </h3>
                              <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(item.published_date).toLocaleDateString()}
                                </span>
                                {item.author && (
                                  <span>By {item.author}</span>
                                )}
                                {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                                  <span>Tags: {item.tags.slice(0, 3).join(', ')}{item.tags.length > 3 ? '...' : ''}</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4">
                                <Link
                                  to={`/news/${item.id}`}
                                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                                >
                                  <span>Read More</span>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                                <button className="text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                                  <Share2 className="h-4 w-4" />
                                  <span>Share</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Google Calendar Integration for Events */}
              {(selectedCategory === 'events' || selectedCategory === 'upcoming_events' || selectedCategory === 'all') && (
                <div className="mt-16">
                  <GoogleCalendar 
                    calendarLink={getCalendarLink()}
                    title="Upcoming Events Calendar"
                    height={500}
                  />
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;