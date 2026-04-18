import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BookOpen, Search, Clock, User, Tag, ChevronRight, Pin, Filter, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

const SUBJECTS = [
  'Power System Analysis', 'Power Electronics', 'Renewable Energy Integration',
  'Smart Grid Technologies', 'Energy Storage Systems', 'Power System Protection',
  'Electrical Machines', 'Control Systems', 'Microgrids & Distributed Energy',
  'Grid Optimization & Stability', 'Cybersecurity for Power Systems', 'Power System Automation',
];

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

const Notes = () => {
  const { fetchData } = useData();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchData('notes');
      setNotes((data || []).filter(n => n.status === 'published'));
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const filteredNotes = useMemo(() => {
    let result = notes.filter(item => {
      const matchesSearch = !searchTerm ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
    result.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.published_date || 0) - new Date(a.published_date || 0);
    });
    return result;
  }, [notes, searchTerm, selectedSubject]);

  const availableSubjects = useMemo(() => {
    const subs = [...new Set(notes.map(n => n.subject).filter(Boolean))];
    return SUBJECTS.filter(s => subs.includes(s));
  }, [notes]);

  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }} data-testid="notes-page">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2847 40%, #1a3a5c 70%, #0f2847 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(56,189,248,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(14,165,233,0.1) 0%, transparent 50%)' }}></div>
        {/* Floating grid lines */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full mb-6" style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)' }}>
              <BookOpen className="h-3.5 w-3.5 mr-2" style={{ color: '#38bdf8' }} />
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#7dd3fc' }}>SESG Research Lab</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif", lineHeight: 1.1 }}>
              Student <span style={{ color: '#38bdf8' }}>Notes</span>
            </h1>
            <p className="text-base sm:text-lg max-w-xl mx-auto mb-10" style={{ color: '#94a3b8' }}>
              Course materials & study resources for Power System & Smart Grid subjects
            </p>
            {/* Search */}
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#64748b' }} />
              <input
                data-testid="public-notes-search"
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', focusRingColor: '#38bdf8' }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-700">
                  <X className="h-4 w-4" style={{ color: '#94a3b8' }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Subject Filters */}
        <div className="mb-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center space-x-2 text-sm font-medium mb-4 px-4 py-2 rounded-lg"
            style={{ color: '#94a3b8', background: '#1e293b', border: '1px solid #334155' }}
          >
            <Filter className="h-4 w-4" />
            <span>{showMobileFilters ? 'Hide Filters' : 'Filter by Subject'}</span>
          </button>
          <div className={`${showMobileFilters ? 'flex' : 'hidden'} md:flex flex-wrap gap-2`}>
            <button
              onClick={() => setSelectedSubject('all')}
              data-testid="filter-all"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={selectedSubject === 'all'
                ? { background: '#38bdf8', color: '#0a1628' }
                : { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
            >
              All
            </button>
            {availableSubjects.map(subject => {
              const isActive = selectedSubject === subject;
              const style = getSubjectStyle(subject);
              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={isActive
                    ? { background: style.text, color: '#ffffff' }
                    : { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
                >
                  {subject}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count */}
        <p className="text-xs mb-6" style={{ color: '#64748b' }}>
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
          {selectedSubject !== 'all' && ` in ${selectedSubject}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent" style={{ borderColor: '#38bdf8', borderTopColor: 'transparent' }}></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="mx-auto h-14 w-14 mb-4" style={{ color: '#334155' }} />
            <h3 className="text-lg font-semibold mb-1" style={{ color: '#e2e8f0' }}>No notes found</h3>
            <p className="text-sm" style={{ color: '#64748b' }}>
              {searchTerm || selectedSubject !== 'all' ? 'Try adjusting your search or filters.' : 'Notes will appear once published.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="notes-grid">
            {filteredNotes.map((note) => {
              const subStyle = getSubjectStyle(note.subject);
              return (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}`}
                  className="group block"
                  data-testid={`note-card-${note.id}`}
                >
                  <article
                    className="rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1"
                    style={{ background: '#111c32', border: '1px solid #1e3050', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                  >
                    {/* Image */}
                    {note.featured_image && (
                      <div className="relative h-40 sm:h-44 overflow-hidden">
                        <img src={note.featured_image} alt={note.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111c32 0%, transparent 60%)' }}></div>
                        {note.is_pinned && (
                          <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold flex items-center" style={{ background: '#f59e0b', color: '#1a1a2e' }}>
                            <Pin className="h-3 w-3 mr-1" />Pinned
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col">
                      {/* Subject */}
                      <span className="inline-flex self-start px-2.5 py-1 rounded-md text-[11px] font-bold mb-3" style={{ background: subStyle.bg, color: subStyle.text, border: `1px solid ${subStyle.border}` }}>
                        {note.subject}
                      </span>

                      {/* Title */}
                      <h2 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-sky-400 transition-colors" style={{ color: '#f1f5f9', fontFamily: "'Poppins', sans-serif" }}>
                        {note.title}
                      </h2>

                      {/* Excerpt */}
                      {note.excerpt && (
                        <p className="text-xs leading-relaxed mb-4 line-clamp-2 flex-1" style={{ color: '#7c8db5' }}>
                          {note.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: '1px solid #1e3050' }}>
                        <div className="flex items-center space-x-3 text-[11px]" style={{ color: '#5b6b8a' }}>
                          <span className="flex items-center"><User className="h-3 w-3 mr-1" />{note.author}</span>
                          <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{note.published_date ? new Date(note.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" style={{ color: '#38bdf8' }} />
                      </div>

                      {/* Tags */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {note.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#1a2744', color: '#5b6b8a' }}>
                              <Tag className="inline h-2 w-2 mr-0.5" />{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="py-8 mt-8" style={{ borderTop: '1px solid #1e293b' }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs" style={{ color: '#475569' }}>SESG Research Lab &middot; Sustainable Energy & Smart Grid Research &middot; BRAC University</p>
        </div>
      </div>
    </div>
  );
};

export default Notes;
