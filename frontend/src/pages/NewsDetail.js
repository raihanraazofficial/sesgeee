import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUp, Calendar, User, Tag, Share2, Printer, Download, Copy, Eye } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const NewsDetail = () => {
  const { id } = useParams();
  const { news, fetchData, loading } = useData();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchData('news');
  }, [fetchData]);

  useEffect(() => {
    if (news.length > 0 && id) {
      const foundArticle = news.find(item => item.id === id);
      setArticle(foundArticle);

      if (foundArticle) {
        // Find related articles (same category, different id)
        const related = news
          .filter(item => 
            item.id !== id && 
            item.category === foundArticle.category &&
            item.status === 'published'
          )
          .slice(0, 3);
        setRelatedArticles(related);
      }
    }
  }, [news, id]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (article) {
      const content = `
        ${article.title}
        
        ${article.excerpt}
        
        ${article.content?.replace(/<[^>]*>/g, '') || ''}
        
        Published: ${new Date(article.published_date).toLocaleDateString()}
        Author: ${article.author || 'SESGRG Team'}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const copyContent = () => {
    if (article) {
      const content = article.content?.replace(/<[^>]*>/g, '') || '';
      navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard!');
    }
  };

  if (loading.news) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner text="Loading article..." />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        {/* Back Navigation */}
        <section className="py-6 bg-gray-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/news"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to News & Events</span>
            </Link>
          </div>
        </section>

        {/* Not Found */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass rounded-xl p-12">
              <h2 className="text-4xl font-bold font-heading text-gray-900 mb-6">
                Article Not Found
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                The article you're looking for doesn't exist or may have been removed.
              </p>
              
              <Link to="/news" className="btn-primary">
                Back to News & Events
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <section className="py-6 bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/news"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to News & Events</span>
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
              article.category === 'news' ? 'text-blue-800 bg-blue-100 border-blue-200' :
              article.category === 'events' ? 'text-green-800 bg-green-100 border-green-200' :
              article.category === 'upcoming_events' ? 'text-purple-800 bg-purple-100 border-purple-200' :
              'text-gray-800 bg-gray-100 border-gray-200'
            }`}>
              {article.category === 'upcoming_events' ? 'Upcoming Events' : 
               article.category?.charAt(0).toUpperCase() + article.category?.slice(1) || 'News'}
            </span>
            {article.is_featured && (
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-yellow-800 bg-yellow-100 border border-yellow-200">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{new Date(article.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            {article.author && (
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>By {article.author}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>SESGRG Team</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors print:hidden"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            <button
              onClick={copyContent}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {article.image && (
        <section className="mb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <img
              src={article.image}
              alt={article.image_alt || article.title}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Excerpt */}
          <div className="bg-gray-50 border-l-4 border-primary-500 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-700 italic leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Main Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-blockquote:border-l-primary-500 prose-blockquote:text-gray-700"
            dangerouslySetInnerHTML={{ 
              __html: article.content || '<p>Content not available.</p>' 
            }}
          />

          {/* Google Calendar Integration for Events */}
          {article.google_calendar_link && (article.category === 'events' || article.category === 'upcoming_events') && (
            <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Calendar</h3>
              <iframe
                src={article.google_calendar_link}
                style={{ border: 0 }}
                width="100%"
                height="400"
                frameBorder="0"
                scrolling="no"
                title="Event Calendar"
                className="rounded-lg"
              />
            </div>
          )}

          {/* Tags */}
          {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 font-medium">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <div key={relatedArticle.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {relatedArticle.image && (
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.image_alt || relatedArticle.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link 
                        to={`/news/${relatedArticle.id}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {relatedArticle.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {relatedArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(relatedArticle.published_date).toLocaleDateString()}</span>
                      <Link 
                        to={`/news/${relatedArticle.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Top */}
      <div className="py-8 text-center bg-white">
        <button
          onClick={scrollToTop}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mx-auto"
        >
          <span>Back to Top</span>
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NewsDetail;