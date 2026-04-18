import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Clock, User, Tag, Pin, Share2, ChevronRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import 'katex/dist/katex.min.css';

const SUBJECT_COLORS = {
  'Power System Analysis': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: '#0284c7' },
  'Power Electronics': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: '#7c3aed' },
  'Renewable Energy Integration': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', accent: '#16a34a' },
  'Smart Grid Technologies': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', accent: '#0891b2' },
  'Energy Storage Systems': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', accent: '#d97706' },
  'Power System Protection': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: '#dc2626' },
  'Electrical Machines': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', accent: '#4f46e5' },
  'Control Systems': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', accent: '#0d9488' },
  'Microgrids & Distributed Energy': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: '#059669' },
  'Grid Optimization & Stability': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', accent: '#0369a1' },
  'Cybersecurity for Power Systems': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', accent: '#e11d48' },
  'Power System Automation': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', accent: '#ea580c' },
};

const getSubjectStyle = (subject) => SUBJECT_COLORS[subject] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', accent: '#6b7280' };

const NoteDetail = () => {
  const { noteId } = useParams();
  const { fetchData } = useData();
  const [note, setNote] = useState(null);
  const [relatedNotes, setRelatedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNote = useCallback(async () => {
    try {
      setLoading(true);
      const allNotes = await fetchData('notes');
      const published = (allNotes || []).filter(n => n.status === 'published');
      const found = published.find(n => n.id === noteId);
      setNote(found || null);
      // Related notes from same subject
      if (found) {
        const related = published
          .filter(n => n.id !== found.id && n.subject === found.subject)
          .slice(0, 3);
        setRelatedNotes(related);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData, noteId]);

  useEffect(() => { loadNote(); }, [loadNote]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: note?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Note Not Found</h2>
          <p className="text-gray-500 mb-6">The note you're looking for doesn't exist or has been removed.</p>
          <Link to="/notes" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors" data-testid="back-to-notes-btn">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  const subStyle = getSubjectStyle(note.subject);

  return (
    <div className="min-h-screen bg-white" data-testid="note-detail-page">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/notes" className="flex items-center text-white/80 hover:text-white transition-colors text-sm" data-testid="note-detail-back-link">
              <ArrowLeft className="h-4 w-4 mr-2" />Back to Notes
            </Link>
            <button onClick={handleShare} className="flex items-center text-white/80 hover:text-white transition-colors text-sm" data-testid="share-note-btn">
              <Share2 className="h-4 w-4 mr-2" />Share
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      {note.featured_image && (
        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <img src={note.featured_image} alt={note.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          {note.is_pinned && (
            <div className="inline-flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-xs font-medium border border-amber-200 mb-4">
              <Pin className="h-3 w-3 mr-1" />Pinned Note
            </div>
          )}
          <div className="mb-3">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${subStyle.bg} ${subStyle.text} border ${subStyle.border}`}>
              {note.subject}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4" style={{ fontFamily: "'Poppins', sans-serif" }} data-testid="note-detail-title">
            {note.title}
          </h1>
          {note.excerpt && (
            <p className="text-lg text-gray-500 leading-relaxed mb-6">{note.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-100">
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1.5 text-gray-400" />
              {note.author}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
              {note.published_date ? new Date(note.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </span>
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                {note.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <article
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-red-600 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-primary-500 prose-blockquote:bg-primary-50/50 prose-blockquote:py-1 prose-blockquote:italic prose-img:rounded-xl prose-img:shadow-lg prose-table:border-collapse"
          dangerouslySetInnerHTML={{ __html: note.content }}
          data-testid="note-detail-content"
        />
      </div>

      {/* Related Notes */}
      {relatedNotes.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-100 py-12 mt-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              More from {note.subject}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNotes.map(rn => (
                <Link key={rn.id} to={`/notes/${rn.id}`} className="group block bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1" data-testid={`related-note-${rn.id}`}>
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">{rn.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{rn.excerpt}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <User className="h-3 w-3 mr-1" />{rn.author}
                    <ChevronRight className="h-3 w-3 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/notes" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg" data-testid="browse-all-notes-btn">
            <BookOpen className="h-4 w-4 mr-2" />Browse All Notes
          </Link>
          <p className="text-gray-400 text-sm mt-4">
            SESG Research Lab &middot; BRAC University
          </p>
        </div>
      </div>

      {/* Content Styles */}
      <style>{`
        .prose table { width: 100%; border-collapse: collapse; margin: 24px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .prose table th { background: linear-gradient(135deg, #f9fafb, #f3f4f6); padding: 12px 16px; text-align: left; font-weight: 600; color: #111827; border: 1px solid #e5e7eb; border-bottom: 2px solid #e5e7eb; }
        .prose table td { padding: 12px 16px; border: 1px solid #f3f4f6; color: #374151; }
        .prose table tr:nth-child(even) { background-color: #fafbfc; }
        .prose table tr:hover { background-color: #f9fafb; }
        .prose .professional-table-content { border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .prose pre { border-radius: 12px; padding: 20px; font-size: 14px; line-height: 1.6; overflow-x: auto; }
        .prose code { font-family: 'Fira Code', 'Monaco', 'Consolas', monospace; }
        .prose .ql-code-block-container { background: #1f2937; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .prose .ql-code-block { background: transparent; color: #e5e7eb; font-family: 'Fira Code', monospace; }
        .prose blockquote { border-left: 4px solid #0284c7; background: #f0f9ff; padding: 16px 20px; border-radius: 0 12px 12px 0; }
        .prose img { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .prose iframe { width: 100%; border-radius: 12px; margin: 16px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .katex-formula { background: linear-gradient(135deg, #e3f2fd, #f3e5f5); border: 1px solid #bbdefb; border-radius: 6px; padding: 4px 8px; display: inline-block; }
      `}</style>
    </div>
  );
};

export default NoteDetail;
