import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Printer, 
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { fetchData } = useData();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadNewsItem();
  }, [slug]);

  const loadNewsItem = async () => {
    try {
      setLoading(true);
      
      console.log('[NewsDetail] Loading news item for slug:', slug);
      
      // Extract ID from slug (format: title-slug-id)
      const idMatch = slug?.match(/-([^-]+)$/);
      console.log('[NewsDetail] ID match result:', idMatch);
      
      if (!idMatch) {
        console.log('[NewsDetail] No ID found in slug, redirecting to /news');
        navigate('/news');
        return;
      }
      
      const id = idMatch[1];
      console.log('[NewsDetail] Extracted ID:', id);
      
      // Fetch all news and find the specific item
      // Use same parameters as News.js to ensure we get the same dataset
      // Force to get mock data for consistency with News.js page
      const allNews = await fetchData('news', { 
        status: 'published',
        sort_by: 'published_date',
        sort_order: 'desc'
      });
      console.log('[NewsDetail] Fetched news items:', allNews?.length || 0, 'items');
      console.log('[NewsDetail] News IDs:', allNews?.map(n => `${n.id} (${n.title?.substring(0, 30)}...)`));
      
      // Try to find by ID first
      let item = allNews.find(news => news.id === id);
      console.log('[NewsDetail] Found news item by ID:', item ? item.title : 'NOT FOUND');
      
      // If not found, try string comparison
      if (!item) {
        item = allNews.find(news => String(news.id) === String(id));
        console.log('[NewsDetail] Found news item by string ID:', item ? item.title : 'NOT FOUND');
      }
      
      if (!item) {
        console.log('[NewsDetail] News item not found, redirecting to /news');
        navigate('/news');
        return;
      }
      
      setNewsItem(item);
      console.log('[NewsDetail] News item loaded successfully');
    } catch (error) {
      console.error('Error loading news item:', error);
      navigate('/news');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = newsItem?.title || 'SESGRG News';
    const text = newsItem?.excerpt || 'Check out this news article from SESGRG';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryStyles[category] || categoryStyles.news}`}>
        {categoryNames[category] || 'News'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading article..." />
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <Link to="/news" className="text-primary-600 hover:text-primary-700">
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              to="/news"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to News
            </Link>
            
            <div className="flex items-center space-x-3">
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setSharing(!sharing)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                
                {/* Share Dropdown */}
                {sharing && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Twitter className="h-4 w-4 text-blue-400" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span>Email</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Printer className="h-5 w-5" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Featured Image */}
          {newsItem.image && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={newsItem.image}
                alt={newsItem.image_alt || newsItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6">
                {getCategoryBadge(newsItem.category)}
              </div>
              {newsItem.is_featured && (
                <div className="absolute top-6 right-6">
                  <span className="bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-1 rounded-full text-sm font-medium border">
                    Featured
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="p-8">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {newsItem.title}
              </h1>
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">{newsItem.author}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{formatDate(newsItem.published_date)}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>5 min read</span>
                </div>
              </div>

              {/* Excerpt */}
              {newsItem.excerpt && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    {newsItem.excerpt}
                  </p>
                </div>
              )}
            </header>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-8 prose-headings:text-gray-900 prose-p:text-gray-800 prose-li:text-gray-800 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: newsItem.content }}
            />

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm border border-primary-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Google Calendar for Events */}
            {(newsItem.category === 'events' || newsItem.category === 'upcoming_events') && newsItem.google_calendar_link && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Event Calendar
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <iframe
                    src={newsItem.google_calendar_link}
                    style={{ border: 0 }}
                    width="100%"
                    height="300"
                    frameBorder="0"
                    scrolling="no"
                    title="Event Calendar"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Article Footer */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Published by <span className="font-medium text-gray-900">{newsItem.author}</span>
                  {newsItem.updated_at && newsItem.updated_at !== newsItem.created_at && (
                    <span className="ml-2">
                      • Updated {formatDate(newsItem.updated_at)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSharing(!sharing)}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share Article</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More News & Events</h2>
          <div className="text-center">
            <Link
              to="/news"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              View All News & Events
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .sticky { position: static !important; }
          button { display: none !important; }
          nav { display: none !important; }
          .no-print { display: none !important; }
          
          .prose {
            font-size: 12pt;
            line-height: 1.5;
          }
          
          .prose h1 {
            font-size: 24pt;
            margin-bottom: 12pt;
          }
          
          .prose h2 {
            font-size: 18pt;
            margin-top: 18pt;
            margin-bottom: 6pt;
          }
          
          .prose p {
            margin-bottom: 12pt;
          }
          
          img {
            max-width: 100%;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsDetail;