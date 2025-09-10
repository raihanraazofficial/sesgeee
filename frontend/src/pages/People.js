import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Users, UserCheck, Handshake } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const People = () => {
  const { people, fetchData, loading } = useData();
  const [activeCategory, setActiveCategory] = useState('advisors');
  const [filteredPeople, setFilteredPeople] = useState([]);

  useEffect(() => {
    fetchData('people');
  }, [fetchData]);

  useEffect(() => {
    if (people.length > 0) {
      const filtered = people.filter(person => person.category === activeCategory);
      // Sort by display_order first (ascending), then by creation date for those without display_order
      const sorted = filtered.sort((a, b) => {
        const orderA = a.display_order;
        const orderB = b.display_order;
        
        // Both have display_order
        if (orderA !== null && orderA !== undefined && orderB !== null && orderB !== undefined) {
          return orderA - orderB;
        }
        // Only A has display_order (A comes first)
        if (orderA !== null && orderA !== undefined) {
          return -1;
        }
        // Only B has display_order (B comes first)
        if (orderB !== null && orderB !== undefined) {
          return 1;
        }
        // Neither has display_order, sort by creation date
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return filtered.indexOf(b) - filtered.indexOf(a);
      });
      setFilteredPeople(sorted);
    }
  }, [people, activeCategory]);

  const categories = [
    { id: 'advisors', name: 'Advisors', icon: UserCheck },
    { id: 'team_members', name: 'Team Members', icon: Users },
    { id: 'collaborators', name: 'Collaborators', icon: Handshake }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentData = filteredPeople;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="People"
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85"
        height="h-96"
        enableAnimations={false}
      />

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-gray-100 rounded-lg p-2 border border-gray-200">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="h-5 w-5" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* People Grid */}
          {loading.people ? (
            <LoadingSpinner text="Loading team members..." />
          ) : (
            <>
              {currentData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentData.map((person) => (
                    <div key={person.id} className="glass rounded-xl flex flex-col shadow-lg border border-gray-200"
                         style={{ minHeight: '580px' }}>
                      
                      {/* Photo with Overlay Text */}
                      <div className="relative h-64">
                        <img
                          src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=400&background=1e293b&color=ffffff`}
                          alt={person.name}
                          className="w-full h-full object-cover rounded-t-xl"
                        />
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-t-xl" />
                        
                        {/* Text overlay on photo */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{person.name}</h3>
                          <p className="text-primary-300 font-semibold mb-1 drop-shadow-md">{person.title}</p>
                          <p className="text-gray-200 text-sm drop-shadow-md">{person.department}</p>
                        </div>
                      </div>
                      
                      {/* Content Below Photo */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Bio Section - Dynamic height */}
                        <div className="flex-grow">
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {person.bio}
                          </p>
                        </div>
                        
                        {/* Fixed positioning sections at bottom */}
                        <div className="mt-auto">
                          {/* Research Interest - Fixed positioning */}
                          <div className="mb-4" style={{ minHeight: '80px' }}>
                            {person.research_interests && person.research_interests.length > 0 && (
                              <>
                                <h4 className="text-gray-900 font-medium text-sm mb-2">Research Interest:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {person.research_interests.map((interest, index) => (
                                    <span
                                      key={index}
                                      className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs border border-primary-200"
                                    >
                                      {interest}
                                    </span>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                          
                          {/* Social/Research Links - Fixed positioning */}
                          <div className="mb-4" style={{ minHeight: '32px' }}>
                            <div className="flex flex-wrap gap-3">
                              <a href={person.social_links?.google_scholar || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlescholar.svg" alt="Scholar" className="w-full h-full" />
                              </a>
                              <a href={person.social_links?.researchgate || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/researchgate.svg" alt="RG" className="w-full h-full" />
                              </a>
                              <a href={person.social_links?.orcid || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/orcid.svg" alt="ORCID" className="w-full h-full" />
                              </a>
                              <a href={person.social_links?.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" className="w-full h-full" />
                              </a>
                              <a href={person.social_links?.github || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub" className="w-full h-full" />
                              </a>
                              <a href={person.social_links?.ieee || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ieee.svg" alt="IEEE" className="w-full h-full" />
                              </a>
                              <a href={`mailto:${person.email || 'example@email.com'}`} className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maildotru.svg" alt="Email" className="w-full h-full" />
                              </a>
                            </div>
                          </div>
                          
                          {/* Fixed Know More Button at Bottom */}
                          <div>
                            <button 
                              onClick={() => person.website && window.open(person.website, '_blank')}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors border border-gray-300"
                            >
                              Know More
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                    {categories.find(c => c.id === activeCategory)?.icon && 
                      React.createElement(categories.find(c => c.id === activeCategory).icon, {
                        className: "h-12 w-12 text-gray-400"
                      })
                    }
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    No Members Found in this Category
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    We are seeking members for our {categories.find(c => c.id === activeCategory)?.name.toLowerCase()} team. 
                    Join us to contribute to cutting-edge research in sustainable energy and smart grid technologies.
                  </p>
                  
                  <div className="space-y-4">
                    <button className="btn-primary">
                      Express Interest
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Join Our Team Section */}
          <div className="mt-20 text-center glass rounded-xl p-12 border border-gray-200">
            <h3 className="text-3xl font-bold font-heading text-gray-900 mb-4">
              Join Our Research Team
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Interested in contributing to sustainable energy and smart grid research? 
              We welcome collaborations with researchers, students, and industry partners.
            </p>
            
            <Link to="/contact" className="btn-primary">
              Get In Touch
            </Link>
          </div>

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

export default People;