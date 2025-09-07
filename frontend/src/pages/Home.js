import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Latest News & Events Component
const LatestNewsSection = () => {
  const { fetchData } = useData();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestNews();
  }, []);

  const loadLatestNews = async () => {
    try {
      setLoading(true);
      const newsData = await fetchData('news', { 
        status: 'published',
        sort_by: 'published_date',
        sort_order: 'desc',
        limit: 6
      });
      setNews(newsData || []);
    } catch (error) {
      console.error('Error loading latest news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

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
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryStyles[category] || categoryStyles.news}`}>
        {categoryNames[category] || 'News'}
      </span>
    );
  };

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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const featuredNews = news.filter(item => item.is_featured);
  const regularNews = news.filter(item => !item.is_featured);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner text="Loading latest news..." />
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">Latest News & Events</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest research developments, achievements, and upcoming events.
          </p>
        </div>

        <div className="space-y-12">
          {/* Featured News */}
          {featuredNews.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Featured</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredNews.slice(0, 2).map((item) => (
                  <article key={item.id} className="group bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    {item.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.image_alt || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          <span className="bg-yellow-100 text-yellow-800 border-yellow-300 px-2 py-1 rounded-full text-xs font-medium border">
                            Featured
                          </span>
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
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      
                      {item.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {item.excerpt}
                        </p>
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
            </div>
          )}

          {/* Recent News */}
          {regularNews.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Recent News</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularNews.slice(0, 3).map((item) => (
                  <article key={item.id} className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                    {item.image && (
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.image_alt || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          {getCategoryBadge(item.category)}
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(item.published_date)}</span>
                      </div>
                      
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">by {item.author}</span>
                        <Link
                          to={getNewsUrl(item)}
                          className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                        >
                          Read →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link to="/news" className="btn-primary">
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const { researchAreas, fetchData, loading } = useData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    // Load data
    fetchData('researchAreas');
    fetchData('photoGallery');
  }, [fetchData]);

  const objectives = [
    {
      number: "1",
      text: "Bridge the gap between research and real-world applications."
    },
    {
      number: "2", 
      text: "Optimize power network efficiency and reliability."
    },
    {
      number: "3",
      text: "Advance renewable energy integration technologies."
    },
    {
      number: "4",
      text: "Create sustainable microgrids for distributed energy systems."
    },
    {
      number: "5",
      text: "Develop Energy Storage and EV Integration Systems."
    },
    {
      number: "6",
      text: "Enhance Cybersecurity and AI Measures for Power Grid Protection."
    },
    {
      number: "7",
      text: "Promote Sustainable Energy Policy and Economics."
    }
  ];

  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
      title: "Solar Energy Infrastructure",
      description: "Advanced photovoltaic systems"
    },
    {
      url: "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
      title: "Modern Wind Technology",
      description: "Efficient wind energy generation"
    },
    {
      url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85",
      title: "Smart Grid Infrastructure",
      description: "Next-generation power systems"
    },
    {
      url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
      title: "Sustainable Energy Systems",
      description: "Clean energy solutions"
    }
  ];



  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  }, [carouselImages.length]);

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage]);

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1655300256620-680cb0f1cec3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneSUyMHJlc2VhcmNoJTIwbGFib3JhdG9yeXxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85",
      category: "Renewable Energy",
      title: "Solar Panel Installation Research"
    },
    {
      url: "https://images.unsplash.com/photo-1639313521811-fdfb1c040ddb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxzdXN0YWluYWJsZSUyMGVuZXJneSUyMHJlc2VhcmNoJTIwbGFib3JhdG9yeXxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85",
      category: "Smart Grid",
      title: "Control Room Monitoring"
    },
    {
      url: "https://images.pexels.com/photos/3861435/pexels-photo-3861435.jpeg",
      category: "Research Activities",
      title: "Laboratory Research Work"
    },
    {
      url: "https://images.unsplash.com/photo-1606206873764-fd15e242df52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MHx8fHwxNzU2NjU0MTU2fDA&ixlib=rb-4.1.0&q=85",
      category: "Research Activities",
      title: "Laboratory Equipment Analysis"
    },
    {
      url: "https://images.unsplash.com/photo-1608037222011-cbf484177126?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MHx8fHwxNzU2NjU0MTU2fDA&ixlib=rb-4.1.0&q=85",
      category: "Research Activities",
      title: "University Laboratory Environment"
    },
    {
      url: "https://images.pexels.com/photos/8539753/pexels-photo-8539753.jpeg",
      category: "Research Activities",
      title: "Professional Research Activities"
    },
    {
      url: "https://images.unsplash.com/photo-1632103996718-4a47cf68b75e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
      category: "Renewable Energy",
      title: "Wind Turbine Research"
    },
    {
      url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
      category: "Renewable Energy",
      title: "Wind Farm Installation"
    },
    {
      url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
      category: "Renewable Energy",
      title: "Solar Panel Farm"
    },
    {
      url: "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
      category: "Renewable Energy",
      title: "Modern Wind Turbines"
    },
    {
      url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85",
      category: "Smart Grid",
      title: "Power Transmission Infrastructure"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Sustainable Energy & Smart Grid Research"
        description="Pioneering Research in Clean Energy, Renewable Integration, and Next-Generation Smart Grid Systems."
        backgroundImage="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85"
        height="h-[60vh]"
        showScrollIndicator={false}
        buttons={[]}
        enableAnimations={true}
      />

      {/* About Us Section - Moved right after Hero */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold font-heading text-gray-900 mb-6">About Us</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 text-justified">
                The Sustainable Energy and Smart Grid Research Group (SESGRG) is an independent research group established in 2025, 
                affiliated with the BSRM School of Engineering, BRAC University. We specialize in sustainable energy systems, 
                smart grid technologies, and advanced power network optimization, taking a comprehensive approach that spans 
                generation, transmission, distribution, and microgrids.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed text-justified">
                Committed to developing innovative and resilient energy solutions, we address modern power system challenges 
                while promoting environmental stewardship through cutting-edge research and collaboration. Guided by principles 
                of excellence, integrity, and sustainability, our vision is to revolutionize global power systems by advancing 
                human well-being through intelligent infrastructure and renewable energy integration.
              </p>
            </div>

            {/* Image Carousel */}
            <div className="relative">
              <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={carouselImages[currentImageIndex].url}
                  alt={carouselImages[currentImageIndex].title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">{carouselImages[currentImageIndex].title}</h3>
                  <p className="text-gray-200">{carouselImages[currentImageIndex].description}</p>
                </div>
                
                {/* Navigation buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Carousel indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-primary-500' : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Objectives Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">Our Objectives</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our research objectives guide our mission to advance sustainable energy and smart grid technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((objective, index) => (
              <div key={index} className="glass rounded-xl p-6 card-hover">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {objective.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed">{objective.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas Section */}
      <section id="research" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">Research Areas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive research domains that are driving innovation in sustainable energy and smart grid technologies.
            </p>
          </div>

          {loading.researchAreas ? (
            <LoadingSpinner text="Loading research areas..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {researchAreas.slice(0, 6).map((area, index) => (
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{area.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{area.description}</p>
                  </div>
                </div>
              ))}
              
              {/* Center the 7th research area */}
              {researchAreas.length >= 7 && (
                <div className="md:col-span-2 lg:col-span-3 flex justify-center">
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{researchAreas[6].title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{researchAreas[6].description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/research" className="btn-primary">
              Know More
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News & Events Section */}
      <LatestNewsSection />

      {/* Photo Gallery Section */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">Photo Gallery</h2>
            <p className="text-xl text-gray-600">
              Glimpses of our research activities, laboratory work, and sustainable energy installations.
            </p>
          </div>
        </div>

        {/* Railway-style scrolling gallery */}
        <div className="relative">
          <div className="flex space-x-6 animate-scroll-x" ref={galleryRef}>
            {/* Duplicate images for seamless loop */}
            {[...galleryImages, ...galleryImages].map((image, index) => (
              <div key={index} className="flex-shrink-0 w-80 h-64 relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-primary-500/80 text-xs px-2 py-1 rounded mb-2 block w-fit">
                    {image.category}
                  </span>
                  <h4 className="font-medium">{image.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/gallery" className="btn-primary">
            View All Photos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;