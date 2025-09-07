import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Printer, 
  Download,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  CheckCircle,
  FileText,
  BookOpen,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { fetchData } = useData();
  const [newsItem, setNewsItem] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadNewsItem();
  }, [slug]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sharing && !event.target.closest('.share-dropdown')) {
        setSharing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sharing]);

  const loadNewsItem = async () => {
    try {
      setLoading(true);
      
      // Extract ID from slug (format: title-slug-id)
      const idMatch = slug?.match(/-([^-]+)$/);
      if (!idMatch) {
        navigate('/news');
        return;
      }
      
      const id = idMatch[1];
      
      // Fetch all news and find the specific item
      const allNews = await fetchData('news', { 
        status: 'published',
        sort_by: 'published_date',
        sort_order: 'desc'
      });
      
      // Try to find by ID first
      let item = allNews.find(news => news.id === id);
      
      // If not found, try string comparison
      if (!item) {
        item = allNews.find(news => String(news.id) === String(id));
      }
      
      if (!item) {
        navigate('/news');
        return;
      }
      
      setNewsItem(item);
      
      // Load related articles (same category or similar tags)
      const related = allNews
        .filter(news => 
          news.id !== item.id && 
          (news.category === item.category || 
           (news.tags && item.tags && news.tags.some(tag => item.tags.includes(tag))))
        )
        .slice(0, 4);
      
      setRelatedNews(related);
    } catch (error) {
      console.error('Error loading news item:', error);
      navigate('/news');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // Add print-specific styles
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${newsItem?.title || 'SESGRG Article'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 20px; }
          .title { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .meta { color: #666; margin-bottom: 20px; }
          .content { line-height: 1.6; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${newsItem?.title || ''}</div>
          <div class="meta">
            By ${newsItem?.author || ''} | ${formatDate(newsItem?.published_date)}
          </div>
        </div>
        <div class="content">
          ${newsItem?.content || ''}
        </div>
        <div class="footer">
          <p>© SESGRG - Sustainable Energy & Smart Grid Research Group</p>
          <p>Original URL: ${window.location.href}</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadPDF = async () => {
    try {
      // Clean HTML content to plain text
      const cleanContent = newsItem?.content?.replace(/<[^>]*>/g, '').replace(/\n\s*\n/g, '\n\n') || '';
      
      // Create well-formatted content
      const articleContent = `
SESGRG - SUSTAINABLE ENERGY & SMART GRID RESEARCH GROUP
================================================================

${newsItem?.title || 'Untitled Article'}

================================================================

Author: ${newsItem?.author || 'Unknown'}
Published: ${formatDate(newsItem?.published_date)}
Category: ${newsItem?.category?.toUpperCase() || 'NEWS'}

================================================================

${newsItem?.excerpt ? `SUMMARY:\n${newsItem.excerpt}\n\n================================================================\n\n` : ''}CONTENT:

${cleanContent}

${newsItem?.tags && newsItem.tags.length > 0 ? `\n================================================================\n\nTAGS: ${newsItem.tags.join(', ')}\n` : ''}
================================================================

Source: ${window.location.href}
© ${new Date().getFullYear()} SESGRG - Sustainable Energy & Smart Grid Research Group
Department of EEE, BRAC University
      `;
      
      // Create and download file
      const blob = new Blob([articleContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Create a safe filename
      const safeTitle = newsItem?.title?.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50) || 'article';
      const date = new Date(newsItem?.published_date).toISOString().split('T')[0];
      a.download = `SESGRG-${safeTitle}-${date}.txt`;
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      toast.success('Article downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download article. Please try again.');
    }
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
      setSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
      setSharing(false);
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
      {/* Header Navigation - Fixed z-index */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              to="/news"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to News
            </Link>
            
            {/* Professional Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Download Button */}
              <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              
              {/* Share Button - Fixed Dropdown */}
              <div className="relative share-dropdown">
                <button
                  onClick={() => setSharing(!sharing)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                
                {/* Professional Share Dropdown - Fixed positioning */}
                {sharing && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[60] transform transition-all duration-200 ease-out">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Share this article</p>
                    </div>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Facebook className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Share on Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-sky-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                        <Twitter className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Share on Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                        <Linkedin className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Share on LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Share via Email</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <Copy className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{copied ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Featured Image */}
          {newsItem.image && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img
                src={newsItem.image}
                alt={newsItem.image_alt || newsItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-3 mb-4">
                  {getCategoryBadge(newsItem.category)}
                  {newsItem.is_featured && (
                    <span className="bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-1 rounded-full text-sm font-medium border">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-8 lg:p-12">
            {/* Article Header */}
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {newsItem.title}
              </h1>
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                  <User className="h-5 w-5 mr-2 text-primary-600" />
                  <span className="font-medium text-gray-900">{newsItem.author}</span>
                </div>
                
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                  <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                  <span className="font-medium text-gray-900">{formatDate(newsItem.published_date)}</span>
                </div>
                
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5 mr-2 text-primary-600" />
                  <span className="font-medium text-gray-900">5 min read</span>
                </div>
              </div>

              {/* Excerpt */}
              {newsItem.excerpt && (
                <div className="bg-primary-50 border-l-4 border-primary-500 rounded-lg p-6 mb-8">
                  <p className="text-lg text-gray-700 leading-relaxed italic font-medium">
                    {newsItem.excerpt}
                  </p>
                </div>
              )}
            </header>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-10 prose-headings:text-gray-900 prose-p:text-gray-800 prose-li:text-gray-800 prose-strong:text-gray-900 prose-a:text-primary-600 prose-a:hover:text-primary-700"
              dangerouslySetInnerHTML={{ __html: newsItem.content }}
            />

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics:</h3>
                <div className="flex flex-wrap gap-3">
                  {newsItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium border border-primary-200 hover:bg-primary-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Article Footer Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-sm text-gray-600">
            <p className="mb-1">
              <span className="font-medium text-gray-900">Published by:</span> {newsItem.author}
            </p>
            {newsItem.updated_at && newsItem.updated_at !== newsItem.created_at && (
              <p>
                <span className="font-medium text-gray-900">Last updated:</span> {formatDate(newsItem.updated_at)}
              </p>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center mb-8">
                <BookOpen className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedNews.map((item) => (
                  <Link
                    key={item.id}
                    to={getNewsUrl(item)}
                    className="group block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border border-gray-200 hover:border-primary-300"
                  >
                    <div className="flex items-start space-x-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <User className="h-3 w-3 mr-1" />
                          <span>{item.author}</span>
                          <span className="mx-2">•</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(item.published_date).toLocaleDateString()}</span>
                        </div>
                        {item.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Link
                  to="/news"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All News & Events
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
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