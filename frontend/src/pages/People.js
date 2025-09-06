import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ExternalLink, ArrowUp, Users, UserCheck, Handshake } from 'lucide-react';
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
      setFilteredPeople(filtered);
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

  // Mock data for demonstration (same as reference website)
  const mockPeople = {
    advisors: [
      {
        id: '1',
        name: 'Shameem Ahmad, PhD',
        title: 'Associate Professor',
        department: 'Department of EEE, BRAC University',
        bio: 'Specialist in smart grids, microgrids, and AI-driven power system control with expertise in renewable energy and advanced power converters.',
        research_interests: ['Microgrids & Distributed Energy Systems', 'Grid Optimization & Stability', 'Renewable Energy Integration'],
        image: 'https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Shameem%20Ahmad.jpg',
        email: 'shameem.ahmad@bracu.ac.bd',
        social_links: {
          google_scholar: '#',
          researchgate: '#',
          orcid: '#',
          linkedin: '#',
          github: '#',
          ieee: '#'
        }
      },
      {
        id: '2',
        name: 'Amirul Islam, PhD',
        title: 'Assistant Professor',
        department: 'Department of EEE, BRAC University',
        bio: 'Researcher in artificial intelligence and power systems with expertise in multimodal signal processing, smart grid automation, and interdisciplinary applications of AI.',
        research_interests: ['Power System Automation', 'Cybersecurity and AI for Power Infrastructure'],
        image: 'https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Amirul%20Islam.jpg',
        email: 'amirul.islam@bracu.ac.bd',
        social_links: {
          google_scholar: '#',
          researchgate: '#',
          orcid: '#',
          linkedin: '#',
          github: '#',
          ieee: '#'
        }
      },
      {
        id: '3',
        name: 'A. S. Nazmul Huda, PhD',
        title: 'Associate Professor',
        department: 'Department of EEE, BRAC University',
        bio: 'Expert in power systems reliability, renewable energy, and smart grid optimization with strong focus on modeling, simulation, and condition monitoring.',
        research_interests: ['Smart Grid Technologies', 'Renewable Energy Integration', 'Grid Optimization & Stability', 'Energy Storage Systems'],
        image: 'https://i.ibb.co.com/mVjdfL22/Nazmul-sir.jpg',
        email: 'nazmul.huda@bracu.ac.bd',
        social_links: {
          google_scholar: '#',
          researchgate: '#',
          orcid: '#',
          linkedin: '#',
          github: '#',
          ieee: '#'
        }
      }
    ],
    team_members: [],
    collaborators: []
  };

  const currentData = filteredPeople.length > 0 ? filteredPeople : mockPeople[activeCategory] || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Our Team"
        description="Meet the dedicated researchers, advisors, and collaborators who are advancing sustainable energy and smart grid technologies at our research lab."
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85"
        height="h-96"
      />

      {/* Main Content */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-dark-800 rounded-lg p-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <category.icon className="h-5 w-5" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading.people && (
            <LoadingSpinner text="Loading team members..." />
          )}

          {/* People Grid */}
          {!loading.people && (
            <>
              {currentData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentData.map((person) => (
                    <div key={person.id} className="research-card flex flex-col"
                         style={{ minHeight: '580px' }}>
                      <div className="relative h-64">
                        <img
                          src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=400&background=1e293b&color=ffffff`}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                      
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-white mb-2">{person.name}</h3>
                          <p className="text-primary-400 font-medium mb-1">{person.title}</p>
                          <p className="text-gray-400 text-sm mb-4">{person.department}</p>
                          
                          <p className="text-gray-300 text-sm leading-relaxed mb-4" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {person.bio}
                          </p>
                          
                          {person.research_interests && person.research_interests.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-white font-medium text-sm mb-2">Research Interest:</h4>
                              <div className="flex flex-wrap gap-2">
                                {person.research_interests.map((interest, index) => (
                                  <span
                                    key={index}
                                    className="bg-primary-600/20 text-primary-400 px-2 py-1 rounded text-xs"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Social/Research Links */}
                          <div className="flex flex-wrap gap-3 mb-4">
                            <a href={person.social_links?.google_scholar || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlescholar.svg" alt="Scholar" className="w-full h-full filter invert" />
                            </a>
                            <a href={person.social_links?.researchgate || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/researchgate.svg" alt="RG" className="w-full h-full filter invert" />
                            </a>
                            <a href={person.social_links?.orcid || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/orcid.svg" alt="ORCID" className="w-full h-full filter invert" />
                            </a>
                            <a href={person.social_links?.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" className="w-full h-full filter invert" />
                            </a>
                            <a href={person.social_links?.github || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub" className="w-full h-full filter invert" />
                            </a>
                            <a href={person.social_links?.ieee || "#"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ieee.svg" alt="IEEE" className="w-full h-full filter invert" />
                            </a>
                            <a href={`mailto:${person.email || 'example@email.com'}`} className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maildotru.svg" alt="Email" className="w-full h-full filter invert" />
                            </a>
                          </div>
                        </div>
                        
                        {/* Fixed Know More Button at Bottom */}
                        <div className="mt-auto">
                          <button 
                            onClick={() => person.website && window.open(person.website, '_blank')}
                            className="w-full bg-dark-700 hover:bg-dark-600 text-white py-2 px-4 rounded-lg transition-colors"
                          >
                            Know More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    {categories.find(c => c.id === activeCategory)?.icon && 
                      React.createElement(categories.find(c => c.id === activeCategory).icon, {
                        className: "h-12 w-12 text-gray-400"
                      })
                    }
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    No Members Found in this Category
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
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
          <div className="mt-20 text-center glass rounded-xl p-12">
            <h3 className="text-3xl font-bold font-heading text-white mb-4">
              Join Our Research Team
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
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

export default People;