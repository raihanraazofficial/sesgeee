import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Zap, Target, Users, Globe } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { researchAreas, news, photoGallery, fetchData, loading } = useData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryRef = useRef(null);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [recentNews, setRecentNews] = useState([]);

  useEffect(() => {
    // Load data
    fetchData('news', { limit: 6 });
    fetchData('photoGallery');
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      const featured = news.filter(item => item.is_featured);
      const recent = news.filter(item => !item.is_featured).slice(0, 5);
      setFeaturedNews(featured);
      setRecentNews(recent);
    }
  }, [news]);

  const objectives = [
    {
      number: "1",
      text: "Bridge the gap between research and real-world applications.",
      icon: Target
    },
    {
      number: "2", 
      text: "Optimize power network efficiency and reliability.",
      icon: Zap
    },
    {
      number: "3",
      text: "Advance renewable energy integration technologies.",
      icon: Globe
    },
    {
      number: "4",
      text: "Create sustainable microgrids for distributed energy systems.",
      icon: Users
    },
    {
      number: "5",
      text: "Develop Energy Storage and EV Integration Systems.",
      icon: Zap
    },
    {
      number: "6",
      text: "Enhance Cybersecurity and AI Measures for Power Grid Protection.",
      icon: Users
    },
    {
      number: "7",
      text: "Promote Sustainable Energy Policy and Economics.",
      icon: Globe
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

  const scrollToSection = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

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
        showScrollIndicator={true}
        onScrollClick={scrollToSection}
        buttons={[
          {
            text: "Explore Research",
            onClick: () => document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' }),
            icon: ArrowRight
          }
        ]}
      />

      {/* About Us Section */}
      <section id="about" className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold font-heading text-white mb-6">About Us</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                The Sustainable Energy and Smart Grid Research Group (SESGRG) is an independent research group established in 2025, 
                affiliated with the BSRM School of Engineering, BRAC University. We specialize in sustainable energy systems, 
                smart grid technologies, and advanced power network optimization, taking a comprehensive approach that spans 
                generation, transmission, distribution, and microgrids.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Committed to developing innovative and resilient energy solutions, we address modern power system challenges 
                while promoting environmental stewardship through cutting-edge research and collaboration. Guided by principles 
                of excellence, integrity, and sustainability, our vision is to revolutionize global power systems by advancing 
                human well-being through intelligent infrastructure and renewable energy integration.
              </p>
            </div>

            {/* Image Carousel */}
            <div className="relative">
              <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
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
                      index === currentImageIndex ? 'bg-primary-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Objectives Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-white mb-4">Our Objectives</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
                    <objective.icon className="h-8 w-8 text-primary-400 mb-3" />
                    <p className="text-gray-300 leading-relaxed">{objective.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas Section */}
      <section id="research" className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-white mb-4">Research Areas</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
              
              {/* Center the last research area if it's the 7th one */}
              {researchAreas.length === 7 && (
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
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/research" className="btn-primary">
              Know More
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News & Events */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold font-heading text-white mb-4">Latest News & Events</h2>
              <p className="text-xl text-gray-300">
                Stay updated with our recent achievements, news, events, and upcoming activities.
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="text-primary-400 hover:text-primary-300 font-medium">
                Refresh
              </button>
              <Link to="/news" className="text-primary-400 hover:text-primary-300 font-medium flex items-center space-x-1">
                <span>View All</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {loading.news ? (
            <LoadingSpinner text="Loading news..." />
          ) : news.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-white mb-4">No Recent News</h3>
              <p className="text-gray-400 mb-8">No recent news or events are available at the moment. Please check back later.</p>
              <div className="space-x-4">
                <button className="btn-secondary">Try Again</button>
                <Link to="/news" className="btn-primary">
                  Visit News Page
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured News */}
              {featuredNews.length > 0 && (
                <div className="lg:col-span-2">
                  <div className="research-card h-full">
                    <div className="relative h-64">
                      <img
                        src={featuredNews[0].image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxuZXdzJTIwZXZlbnRzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85"}
                        alt={featuredNews[0].title}
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
                      <h3 className="text-2xl font-semibold text-white mb-3">{featuredNews[0].title}</h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">{featuredNews[0].excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          {new Date(featuredNews[0].published_date).toLocaleDateString()}
                        </span>
                        <Link
                          to={`/news/${featuredNews[0].id}`}
                          className="text-primary-400 hover:text-primary-300 font-medium"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Recent News */}
              <div className="space-y-6">
                {recentNews.map((item) => (
                  <div key={item.id} className="glass rounded-lg p-4 card-hover">
                    <div className="flex space-x-4">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxuZXdzJTIwZXZlbnRzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85"}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-2 line-clamp-2">{item.title}</h4>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-1">{item.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(item.published_date).toLocaleDateString()}
                          </span>
                          <Link
                            to={`/news/${item.id}`}
                            className="text-primary-400 hover:text-primary-300 text-sm"
                          >
                            Read
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
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20 bg-dark-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold font-heading text-white mb-4">Photo Gallery</h2>
            <p className="text-xl text-gray-300">
              Glimpses of our research activities, laboratory work, and sustainable energy installations.
            </p>
          </div>
        </div>

        {/* Railway-style scrolling gallery */}
        <div className="relative">
          <div className="flex space-x-6 animate-scroll-x" ref={galleryRef}>
            {/* Duplicate images for seamless loop */}
            {[...galleryImages, ...galleryImages].map((image, index) => (
              <div key={index} className="flex-shrink-0 w-80 h-64 relative rounded-xl overflow-hidden">
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