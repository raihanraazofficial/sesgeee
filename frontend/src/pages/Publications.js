import React, { useEffect, useState, useMemo } from 'react';
import { ArrowUp, Search, Copy, ExternalLink, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Publications = () => {
  const { publications, fetchData, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData('publications');
  }, [fetchData]);

  // Research areas for filter
  const researchAreaNames = [
    'Smart Grid Technologies',
    'Microgrids & Distributed Energy Systems', 
    'Renewable Energy Integration',
    'Grid Optimization & Stability',
    'Energy Storage Systems',
    'Power System Automation',
    'Cybersecurity and AI for Power Infrastructure'
  ];

  // IEEE Citation Formatter
  const formatIEEECitation = (pub) => {
    const authors = Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors || '';
    
    if (pub.publication_type === 'journal') {
      return (
        <>
          <strong>{authors}</strong>, "<em>{pub.title}</em>," <em>{pub.journal_name || 'Journal'}</em>
          {pub.volume && `, vol. ${pub.volume}`}
          {pub.issue && `, no. ${pub.issue}`}
          {pub.pages && `, pp. ${pub.pages}`}
          {pub.month && `, ${pub.month}`} {pub.year}.
        </>
      );
    } else if (pub.publication_type === 'conference') {
      return (
        <>
          <strong>{authors}</strong>, "<em>{pub.title}</em>," in <em>{pub.conference_name || 'Conference Proceedings'}</em>, 
          {pub.location && ` ${pub.location},`} {pub.year}
          {pub.pages && `, pp. ${pub.pages}`}.
        </>
      );
    } else if (pub.publication_type === 'book_chapter') {
      return (
        <>
          <strong>{authors}</strong>, "<em>{pub.title}</em>," in <em>{pub.book_title || 'Book Title'}</em>
          {pub.edition && `, ${pub.edition}`}
          {pub.editor && pub.editor.length > 0 && `, ${pub.editor.join(', ')}, ${pub.editor.length === 1 ? 'Ed.' : 'Eds.'}`}
          {pub.publisher && `. ${pub.publisher}`}
          {pub.location && `, ${pub.location}`}
          {pub.year && `, ${pub.year}`}
          {pub.pages && `, pp. ${pub.pages}`}.
        </>
      );
    }
    return `${authors}, "${pub.title}," ${pub.year}.`;
  };

  // Copy citation to clipboard
  const copyCitation = (citation) => {
    const textElement = document.createElement('div');
    textElement.innerHTML = citation;
    const plainText = textElement.textContent || textElement.innerText || '';
    navigator.clipboard.writeText(plainText);
    // Could add toast notification here
    alert('Citation copied to clipboard!');
  };

  // Request paper email
  const requestPaper = (pub) => {
    const subject = `Request for Paper: ${pub.title}`;
    const body = `Dear Author,

I would like to request access to your paper titled "${pub.title}" published in ${pub.year}.

Publication Details:
- Authors: ${Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}
- Year: ${pub.year}
${pub.journal_name ? `- Journal: ${pub.journal_name}` : ''}
${pub.conference_name ? `- Conference: ${pub.conference_name}` : ''}
${pub.book_title ? `- Book: ${pub.book_title}` : ''}

Thank you for your consideration.

Best regards,
[Your Name]`;
    
    window.open(`mailto:sesg@bracu.ac.bd?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Generate auto numbering
  const getPublicationNumber = (pub, index, filteredPubs) => {
    const typePrefix = pub.publication_type === 'journal' ? 'J' : 
                      pub.publication_type === 'conference' ? 'C' : 'B';
    const sameTypeIndex = filteredPubs
      .filter(p => p.publication_type === pub.publication_type)
      .findIndex(p => p.id === pub.id) + 1;
    return `${typePrefix}.${sameTypeIndex}`;
  };

  // Get category color
  const getCategoryColor = (type) => {
    switch(type) {
      case 'journal': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'conference': return 'bg-green-50 text-green-600 border-green-200';
      case 'book_chapter': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  // Filter and sort publications
  const filteredPublications = useMemo(() => {
    let filtered = publications.filter(pub => {
      const matchesSearch = searchTerm === '' || 
        pub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(pub.authors) ? pub.authors.join(' ') : pub.authors || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.journal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.conference_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.book_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pub.keywords && pub.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = categoryFilter === 'all' || pub.publication_type === categoryFilter;
      const matchesYear = yearFilter === 'all' || pub.year.toString() === yearFilter;
      const matchesArea = areaFilter === 'all' || 
        (pub.research_areas && pub.research_areas.some(area => area.toLowerCase().includes(areaFilter.toLowerCase())));
      
      return matchesSearch && matchesCategory && matchesYear && matchesArea;
    });

    // Sort publications
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'title') {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [publications, searchTerm, categoryFilter, yearFilter, areaFilter, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCitations = publications.reduce((sum, pub) => sum + (pub.citations || 0), 0);
    const latestYear = publications.length > 0 ? Math.max(...publications.map(pub => pub.year)) : new Date().getFullYear();
    
    return {
      totalPublications: publications.length,
      totalCitations,
      latestYear,
      researchAreas: 7
    };
  }, [publications]);

  // Pagination
  const totalPages = Math.ceil(filteredPublications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPublications = filteredPublications.slice(startIndex, endIndex);

  const handleGoToPage = () => {
    const page = parseInt(goToPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPage('');
    }
  };

  // Get unique years
  const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Publications"
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxwdWJsaWNhdGlvbnN8ZW58MHx8fHwxNzU2NjU0MTQ5fDA&ixlib=rb-4.1.0&q=85"
        height="h-96"
        enableAnimations={false}
      />



      {/* Category Filter Buttons */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>
              <button
                onClick={() => {
                  setCategoryFilter('journal');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  categoryFilter === 'journal'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Journal
              </button>
              <button
                onClick={() => {
                  setCategoryFilter('conference');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  categoryFilter === 'conference'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Conference Proceedings
              </button>
              <button
                onClick={() => {
                  setCategoryFilter('book_chapter');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  categoryFilter === 'book_chapter'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Book Chapter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-xl p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by author, title, journal, conference, book, or keywords..."
                  className="form-input pl-10 pr-4 w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-input text-sm"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Research Area</label>
                <select
                  value={areaFilter}
                  onChange={(e) => {
                    setAreaFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-input text-sm"
                >
                  <option value="all">All Areas</option>
                  {researchAreaNames.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-input text-sm"
                >
                  <option value="year">Year</option>
                  <option value="title">Title</option>
                  <option value="citations">Citations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="form-input text-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading.publications ? (
            <LoadingSpinner text="Loading publications..." />
          ) : filteredPublications.length > 0 ? (
            <>
              {/* Publications List */}
              <div className="space-y-4 mb-8">
                {currentPublications.map((publication, index) => (
                  <div key={publication.id} className="glass rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      {/* Auto Number */}
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 border ${getCategoryColor(publication.publication_type)}`}>
                        <span className="font-bold text-sm">
                          {getPublicationNumber(publication, index, filteredPublications)}
                        </span>
                      </div>

                      <div className="flex-1">
                        {/* Publication Type and Year */}
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(publication.publication_type)}`}>
                            {publication.publication_type === 'journal' ? 'Journal Article' : 
                             publication.publication_type === 'conference' ? 'Conference Proceedings' : 'Book Chapter'}
                          </span>
                          <span className="text-gray-600 text-sm font-medium">{publication.year}</span>
                          {publication.citations > 0 && (
                            <span className="text-yellow-600 text-sm">Citations: {publication.citations}</span>
                          )}
                        </div>

                        {/* IEEE Citation */}
                        <div className="text-gray-700 text-sm leading-relaxed mb-4">
                          {formatIEEECitation(publication)}
                        </div>

                        {/* Keywords */}
                        {publication.keywords && publication.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {publication.keywords.map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-4">
                          {/* Publication Link - Always visible */}
                          {publication.link ? (
                            <a
                              href={publication.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Publication Link</span>
                            </a>
                          ) : (
                            <span className="flex items-center space-x-1 text-gray-400 text-sm font-medium cursor-not-allowed">
                              <ExternalLink className="h-4 w-4" />
                              <span>Publication Link</span>
                            </span>
                          )}

                          {!publication.is_open_access && (
                            <button
                              onClick={() => requestPaper(publication)}
                              className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                            >
                              <Mail className="h-4 w-4" />
                              <span>Request Paper</span>
                            </button>
                          )}

                          <button
                            onClick={() => copyCitation(formatIEEECitation(publication))}
                            className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm font-medium"
                          >
                            <Copy className="h-4 w-4" />
                            <span>Copy Citation</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredPublications.length)} of {filteredPublications.length} publications
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Go to page */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Go to:</span>
                      <input
                        type="number"
                        value={goToPage}
                        onChange={(e) => setGoToPage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGoToPage()}
                        placeholder="Page"
                        min="1"
                        max={totalPages}
                        className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-gray-900 text-sm"
                      />
                      <button
                        onClick={handleGoToPage}
                        className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                      >
                        Go
                      </button>
                    </div>

                    {/* Page navigation */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded text-sm ${
                                currentPage === page
                                  ? 'bg-primary-600 text-white'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {searchTerm || categoryFilter !== 'all' || yearFilter !== 'all' || areaFilter !== 'all' 
                  ? 'No Publications Found' 
                  : 'No Publications Available'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                {searchTerm || categoryFilter !== 'all' || yearFilter !== 'all' || areaFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters to find more publications.'
                  : 'Our publication database is being updated. Meanwhile, please contact us for specific publication requests.'
                }
              </p>
              
              {(searchTerm || categoryFilter !== 'all' || yearFilter !== 'all' || areaFilter !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setYearFilter('all');
                    setAreaFilter('all');
                    setCurrentPage(1);
                  }}
                  className="btn-secondary mr-4"
                >
                  Clear All Filters
                </button>
              )}
              <button className="btn-primary">
                Contact for Publications
              </button>
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

export default Publications;