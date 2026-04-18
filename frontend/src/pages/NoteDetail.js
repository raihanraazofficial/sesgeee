import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Clock, User, Tag, Pin, Share2, ChevronRight, MessageCircle, Send, Copy, Check } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';

const SUBJECT_COLORS = {
  'Power System Analysis': { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Power Electronics': { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  'Renewable Energy Integration': { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
  'Smart Grid Technologies': { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
  'Energy Storage Systems': { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  'Power System Protection': { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  'Electrical Machines': { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  'Control Systems': { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  'Microgrids & Distributed Energy': { bg: '#ecfdf5', text: '#059669', border: '#6ee7b7' },
  'Grid Optimization & Stability': { bg: '#f0f9ff', text: '#0369a1', border: '#7dd3fc' },
  'Cybersecurity for Power Systems': { bg: '#fff1f2', text: '#be123c', border: '#fda4af' },
  'Power System Automation': { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' },
};
const getSubjectStyle = (subject) => SUBJECT_COLORS[subject] || { bg: '#f9fafb', text: '#374151', border: '#d1d5db' };

const NoteDetail = () => {
  const { noteId } = useParams();
  const { fetchData, createItem } = useData();
  const [note, setNote] = useState(null);
  const [relatedNotes, setRelatedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const loadNote = useCallback(async () => {
    try {
      setLoading(true);
      const allNotes = await fetchData('notes');
      const published = (allNotes || []).filter(n => n.status === 'published');
      const found = published.find(n => n.id === noteId);
      setNote(found || null);
      if (found) {
        setRelatedNotes(published.filter(n => n.id !== found.id && n.subject === found.subject).slice(0, 3));
      }
      // Load comments
      try {
        const allComments = await fetchData('comments');
        setComments((allComments || []).filter(c => c.note_id === noteId).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)));
      } catch {
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchData, noteId]);

  useEffect(() => { loadNote(); }, [loadNote]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    setSubmittingComment(true);
    try {
      await createItem('comments', { note_id: noteId, name: commentName.trim(), text: commentText.trim(), created_at: new Date().toISOString() });
      setComments(prev => [{ id: `temp-${Date.now()}`, note_id: noteId, name: commentName.trim(), text: commentText.trim(), created_at: new Date().toISOString() }, ...prev]);
      setCommentName('');
      setCommentText('');
    } catch (err) {
      console.error('Comment error:', err);
      // Still add locally even if Firestore fails
      setComments(prev => [{ id: `local-${Date.now()}`, note_id: noteId, name: commentName.trim(), text: commentText.trim(), created_at: new Date().toISOString() }, ...prev]);
      setCommentName('');
      setCommentText('');
    }
    setSubmittingComment(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(note?.title || 'Student Note');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a1628' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent" style={{ borderColor: '#38bdf8', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a1628' }}>
        <div className="text-center">
          <BookOpen className="mx-auto h-14 w-14 mb-4" style={{ color: '#334155' }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: '#e2e8f0' }}>Note Not Found</h2>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>The note you're looking for doesn't exist.</p>
          <Link to="/notes" className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ background: '#38bdf8', color: '#0a1628' }} data-testid="back-to-notes-btn">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  const subStyle = getSubjectStyle(note.subject);

  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }} data-testid="note-detail-page">
      {/* Top Bar */}
      <div style={{ background: '#0f1d35', borderBottom: '1px solid #1e3050' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/notes" className="flex items-center text-sm transition-colors hover:text-sky-400" style={{ color: '#7c8db5' }} data-testid="note-detail-back-link">
            <ArrowLeft className="h-4 w-4 mr-1.5" />Back to Notes
          </Link>
          <div className="relative">
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center text-sm transition-colors hover:text-sky-400" style={{ color: '#7c8db5' }} data-testid="share-note-btn">
              <Share2 className="h-4 w-4 mr-1.5" />Share
            </button>
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 rounded-lg shadow-xl z-50 py-2 w-52" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm hover:bg-gray-700" style={{ color: '#e2e8f0' }}>
                  WhatsApp
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm hover:bg-gray-700" style={{ color: '#e2e8f0' }}>
                  Facebook
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm hover:bg-gray-700" style={{ color: '#e2e8f0' }}>
                  Twitter / X
                </a>
                <button onClick={handleCopyLink} className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 w-full text-left" style={{ color: '#e2e8f0' }}>
                  {copied ? <><Check className="h-4 w-4 mr-2 text-green-400" />Copied!</> : <><Copy className="h-4 w-4 mr-2" />Copy Link</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Image */}
      {note.featured_image && (
        <div className="relative h-52 sm:h-64 md:h-80 overflow-hidden">
          <img src={note.featured_image} alt={note.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a1628 0%, rgba(10,22,40,0.5) 50%, transparent 100%)' }}></div>
        </div>
      )}

      {/* Article */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {note.is_pinned && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                <Pin className="h-3 w-3 mr-1" />Pinned
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold" style={{ background: subStyle.bg, color: subStyle.text, border: `1px solid ${subStyle.border}` }}>
              {note.subject}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 leading-tight" style={{ color: '#f1f5f9', fontFamily: "'Poppins', sans-serif" }} data-testid="note-detail-title">
            {note.title}
          </h1>
          {note.excerpt && <p className="text-sm sm:text-base mb-5" style={{ color: '#7c8db5', lineHeight: 1.7 }}>{note.excerpt}</p>}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs pb-6" style={{ color: '#5b6b8a', borderBottom: '1px solid #1e3050' }}>
            <span className="flex items-center"><User className="h-3.5 w-3.5 mr-1.5" />{note.author}</span>
            <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1.5" />{note.published_date ? new Date(note.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                {note.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[11px]" style={{ background: '#1a2744', color: '#7c8db5' }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <article
          className="note-article-content"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content, { ADD_TAGS: ['iframe'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'loading', 'class', 'style'] }) }}
          data-testid="note-detail-content"
        />

        {/* Share Bar */}
        <div className="flex flex-wrap items-center gap-3 py-6 mt-8" style={{ borderTop: '1px solid #1e3050' }}>
          <span className="text-xs font-semibold" style={{ color: '#5b6b8a' }}>Share:</span>
          <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80" style={{ background: '#25d366', color: '#fff' }}>WhatsApp</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80" style={{ background: '#1877f2', color: '#fff' }}>Facebook</a>
          <a href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80" style={{ background: '#1da1f2', color: '#fff' }}>Twitter</a>
          <button onClick={handleCopyLink} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80" style={{ background: '#334155', color: '#e2e8f0' }}>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-8 rounded-xl p-5 sm:p-6" style={{ background: '#111c32', border: '1px solid #1e3050' }} data-testid="comments-section">
          <h3 className="text-lg font-bold flex items-center mb-6" style={{ color: '#f1f5f9', fontFamily: "'Poppins', sans-serif" }}>
            <MessageCircle className="h-5 w-5 mr-2" style={{ color: '#38bdf8' }} />
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="mb-6 rounded-lg p-4" style={{ background: '#0f1d35', border: '1px solid #1e3050' }} data-testid="comment-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Your name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1"
                style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', focusRing: '#38bdf8' }}
                required
                data-testid="comment-name-input"
              />
            </div>
            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm mb-3 focus:outline-none focus:ring-1 resize-none"
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
              required
              data-testid="comment-text-input"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentName.trim() || !commentText.trim()}
              className="flex items-center px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
              style={{ background: '#38bdf8', color: '#0a1628' }}
              data-testid="comment-submit-btn"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />{submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-center py-6 text-sm" style={{ color: '#5b6b8a' }}>No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="rounded-lg p-4" style={{ background: '#0f1d35', border: '1px solid #1e3050' }} data-testid={`comment-${c.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{c.name}</span>
                    <span className="text-[11px]" style={{ color: '#5b6b8a' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#94a3b8', lineHeight: 1.6 }}>{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Notes */}
      {relatedNotes.length > 0 && (
        <div className="py-10" style={{ background: '#0f1d35', borderTop: '1px solid #1e3050' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h3 className="text-lg font-bold mb-6" style={{ color: '#f1f5f9', fontFamily: "'Poppins', sans-serif" }}>
              More from <span style={{ color: '#38bdf8' }}>{note.subject}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedNotes.map(rn => (
                <Link key={rn.id} to={`/notes/${rn.id}`} className="group block rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5" style={{ background: '#111c32', border: '1px solid #1e3050' }} data-testid={`related-note-${rn.id}`}>
                  <h4 className="text-sm font-semibold mb-2 group-hover:text-sky-400 transition-colors line-clamp-2" style={{ color: '#e2e8f0' }}>{rn.title}</h4>
                  <p className="text-xs line-clamp-2 mb-3" style={{ color: '#5b6b8a' }}>{rn.excerpt}</p>
                  <div className="flex items-center text-[11px]" style={{ color: '#5b6b8a' }}>
                    <User className="h-3 w-3 mr-1" />{rn.author}
                    <ChevronRight className="h-3 w-3 ml-auto group-hover:translate-x-1 transition-transform" style={{ color: '#38bdf8' }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="py-6 text-center" style={{ borderTop: '1px solid #1e3050' }}>
        <Link to="/notes" className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ background: '#38bdf8', color: '#0a1628' }} data-testid="browse-all-notes-btn">
          <BookOpen className="h-4 w-4 mr-2" />Browse All Notes
        </Link>
        <p className="text-[11px] mt-4" style={{ color: '#475569' }}>SESG Research Lab &middot; BRAC University</p>
      </div>

      {/* Content Styles */}
      <style>{`
        .note-article-content { color: #cbd5e1; font-size: 15px; line-height: 1.8; }
        .note-article-content h1 { font-size: 28px; font-weight: 800; color: #f1f5f9; margin: 32px 0 16px; font-family: 'Poppins', sans-serif; }
        .note-article-content h2 { font-size: 22px; font-weight: 700; color: #f1f5f9; margin: 28px 0 14px; font-family: 'Poppins', sans-serif; }
        .note-article-content h3 { font-size: 18px; font-weight: 700; color: #e2e8f0; margin: 24px 0 12px; font-family: 'Poppins', sans-serif; }
        .note-article-content h4 { font-size: 16px; font-weight: 600; color: #e2e8f0; margin: 20px 0 10px; }
        .note-article-content p { margin: 12px 0; color: #94a3b8; }
        .note-article-content strong, .note-article-content b { color: #e2e8f0; font-weight: 600; }
        .note-article-content a { color: #38bdf8; text-decoration: underline; text-underline-offset: 3px; }
        .note-article-content a:hover { color: #7dd3fc; }
        .note-article-content ul, .note-article-content ol { margin: 16px 0; padding-left: 24px; color: #94a3b8; }
        .note-article-content li { margin: 8px 0; }
        .note-article-content blockquote { border-left: 3px solid #38bdf8; background: rgba(56,189,248,0.06); padding: 14px 18px; margin: 20px 0; border-radius: 0 8px 8px 0; color: #7dd3fc; font-style: italic; }
        /* CODE BLOCKS - DARK THEME WITH HIGH CONTRAST */
        .note-article-content pre, .note-article-content .ql-code-block-container, .note-article-content pre.ql-code-block {
          background: #0f172a !important; color: #e2e8f0 !important; border: 1px solid #1e3a5f; border-radius: 10px; padding: 18px 20px; margin: 20px 0; overflow-x: auto; font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace; font-size: 13px; line-height: 1.7; white-space: pre-wrap; word-break: break-word;
        }
        .note-article-content .ql-code-block { background: transparent !important; color: #e2e8f0 !important; font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace; font-size: 13px; padding: 0; border: none; }
        .note-article-content code { background: #1e293b; color: #f472b6; padding: 2px 6px; border-radius: 4px; font-family: 'Fira Code', 'Consolas', monospace; font-size: 13px; }
        .note-article-content pre code { background: transparent; color: #e2e8f0; padding: 0; font-size: 13px; }
        /* TABLES */
        .note-article-content table, .note-article-content .professional-table-content { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #1e3050; border-radius: 8px; overflow: hidden; }
        .note-article-content table th { background: #1e293b !important; padding: 10px 14px; text-align: left; font-weight: 700; color: #e2e8f0 !important; border: 1px solid #334155; font-size: 13px; }
        .note-article-content table td { padding: 10px 14px; border: 1px solid #1e3050; color: #94a3b8 !important; font-size: 13px; background: #111c32 !important; }
        .note-article-content table tr:nth-child(even) td { background: #0f1d35 !important; }
        .note-article-content table tr:hover td { background: #1a2744 !important; }
        /* IMAGES & MEDIA */
        .note-article-content img { max-width: 100%; height: auto; border-radius: 10px; margin: 20px 0; border: 1px solid #1e3050; }
        .note-article-content iframe { width: 100%; border-radius: 10px; margin: 16px 0; border: 1px solid #1e3050; }
        .note-article-content .katex-formula { background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2); border-radius: 6px; padding: 6px 10px; display: inline-block; }
        @media (max-width: 640px) {
          .note-article-content { font-size: 14px; }
          .note-article-content h1 { font-size: 22px; }
          .note-article-content h2 { font-size: 18px; }
          .note-article-content h3 { font-size: 16px; }
          .note-article-content pre { padding: 14px; font-size: 12px; }
          .note-article-content table { font-size: 12px; }
          .note-article-content table th, .note-article-content table td { padding: 8px 10px; }
        }
      `}</style>
    </div>
  );
};

export default NoteDetail;
