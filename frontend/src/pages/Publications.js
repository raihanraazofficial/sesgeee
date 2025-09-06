import React, { useEffect, useState } from 'react';
import { ArrowUp, Search, BookOpen, ExternalLink } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Publications = () => {
  const { publications, fetchData, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPublications, setFilteredPublications] = useState([]);

  useEffect(() => {
    fetchData('publications');
  }, [fetchData]);

  useEffect(() => {
    if (publications.length > 0) {
      const filtered = publications.filter(pub =>
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.authors.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPublications(filtered);
    }
  }, [publications, searchTerm]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Publications"
        description="Explore our research publications in sustainable energy and smart grid technologies. Discover cutting-edge research that's shaping the future of energy systems."
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxwdWJsaWNhdGlvbnN8ZW58MHx8fHwxNzU2NjU0MTQ5fDA&ixlib=rb-4.1.0&q=85"
        height="h-96"
      />

      {/* Search Section */}
      <section className="py-12 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search publications by title or author..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-primary-600/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-400 mb-1">{publications.length}</div>
              <div className="text-sm text-gray-400">Total Publications</div>
            </div>
            <div className="bg-secondary-600/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-secondary-400 mb-1">182</div>
              <div className="text-sm text-gray-400">Total Citations</div>
            </div>
            <div className="bg-primary-600/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-400 mb-1">2024</div>
              <div className="text-sm text-gray-400">Latest Year</div>
            </div>
            <div className="bg-secondary-600/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-secondary-400 mb-1">7</div>
              <div className="text-sm text-gray-400">Research Areas</div>
            </div>
          </div>

          {loading.publications ? (
            <LoadingSpinner text="Loading publications..." />
          ) : (
            <>
              {filteredPublications.length > 0 ? (
                <div className="space-y-6">
                  {filteredPublications.map((publication) => (
                    <div key={publication.id} className="glass rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">{publication.title}</h3>
                          <p className="text-gray-300 mb-2">{publication.authors}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                            <span className="bg-primary-600/20 text-primary-400 px-2 py-1 rounded">
                              {publication.category === 'journal' ? 'Journal' : 'Conference'}
                            </span>
                            <span>{publication.journal}</span>
                            <span>{publication.year}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <button className="text-primary-400 hover:text-primary-300 transition-colors flex items-center space-x-1">
                              <ExternalLink className="h-4 w-4" />
                              <span>View Publication</span>
                            </button>
                            <button className="text-gray-400 hover:text-gray-300 transition-colors">
                              Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {searchTerm ? 'No publications found' : 'Publications Coming Soon'}
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    {searchTerm 
                      ? 'Try adjusting your search terms or browse all publications.'
                      : 'Our publication database is being updated. Meanwhile, please contact us for specific publication requests.'
                    }
                  </p>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="btn-secondary mr-4"
                    >
                      Clear Search
                    </button>
                  )}
                  <button className="btn-primary">
                    Contact for Publications
                  </button>
                </div>
              )}
            </>
          )}

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

export default Publications;