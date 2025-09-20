import React, { useEffect, useState } from 'react';
import { ArrowUp, Users, UserCheck, Handshake, ExternalLink } from 'lucide-react';
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
                    <div key={person.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      
                      {/* Photo Section */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=400&background=1e293b&color=ffffff`}
                          alt={person.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-6">
                        {/* Basic Info */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{person.name}</h3>
                          <p className="text-primary-600 font-semibold mb-1">{person.title}</p>
                          <p className="text-gray-600 text-sm">{person.department}</p>
                        </div>
                        
                        {/* Social/Research Links */}
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-3">
                            {person.social_links?.google_scholar && person.social_links.google_scholar !== '#' && (
                              <a 
                                href={person.social_links.google_scholar} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                                title="Google Scholar"
                              >
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlescholar.svg" alt="GS" className="w-4 h-4 filter invert" />
                              </a>
                            )}
                            
                            {person.social_links?.researchgate && person.social_links.researchgate !== '#' && (
                              <a 
                                href={person.social_links.researchgate} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 transition-colors"
                                title="ResearchGate"
                              >
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/researchgate.svg" alt="RG" className="w-4 h-4 filter invert" />
                              </a>
                            )}
                            
                            {person.social_links?.orcid && person.social_links.orcid !== '#' && (
                              <a 
                                href={person.social_links.orcid} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors"
                                title="ORCID"
                              >
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/orcid.svg" alt="ORCID" className="w-4 h-4 filter invert" />
                              </a>
                            )}
                            
                            {person.social_links?.scopus && person.social_links.scopus !== '#' && (
                              <a 
                                href={person.social_links.scopus} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white hover:bg-orange-700 transition-colors"
                                title="Scopus"
                              >
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/scopus.svg" alt="Scopus" className="w-4 h-4 filter invert" />
                              </a>
                            )}
                            
                            {person.social_links?.web_of_science && person.social_links.web_of_science !== '#' && (
                              <a 
                                href={person.social_links.web_of_science} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors"
                                title="Web of Science"
                              >
                                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/webofscience.svg" alt="Web of Science" className="w-4 h-4 filter invert" />
                              </a>
                            )}
                            
                            {person.email && (
                              <a 
                                href={`mailto:${person.email}`} 
                                className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                                title="Email"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <div>
                          <button 
                            onClick={() => person.website && window.open(person.website, '_blank')}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                          >
                            View Profile
                          </button>
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