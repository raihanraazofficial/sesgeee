import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BookOpen, Search, Clock, User, Tag, ChevronRight, Pin, Filter } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

const SUBJECTS = [
  'Power System Analysis',
  'Power Electronics',
  'Renewable Energy Integration',
  'Smart Grid Technologies',
  'Energy Storage Systems',
  'Power System Protection',
  'Electrical Machines',
  'Control Systems',
  'Microgrids & Distributed Energy',
  'Grid Optimization & Stability',
  'Cybersecurity for Power Systems',
  'Power System Automation',
];

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

const Notes = () => {
  const { fetchData } = useData();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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
    // Pinned notes first, then by date
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" data-testid="notes-page">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <BookOpen className="h-4 w-4 text-white mr-2" />
              <span className="text-white/90 text-sm font-medium">SESG Research Lab</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Student Notes
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Course materials, lecture notes, and study resources for Power System & Smart Grid related subjects
            </p>
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                data-testid="public-notes-search"
                type="text"
                placeholder="Search notes by title, subject, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-xl border-0 focus:ring-2 focus:ring-primary-300 focus:outline-none text-gray-900 text-base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subject Filters */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            <Filter className="h-4 w-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubject('all')}
                data-testid="filter-all"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedSubject === 'all'
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                All Subjects
              </button>
              {availableSubjects.map(subject => {
                const style = getSubjectStyle(subject);
                return (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    data-testid={`filter-${subject.replace(/\s+/g, '-').toLowerCase()}`}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedSubject === subject
                        ? `${style.bg} ${style.text} border ${style.border} shadow-md`
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
            {selectedSubject !== 'all' && ` in ${selectedSubject}`}
          </p>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notes...</p>
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedSubject !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Notes will appear here once they are published.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="notes-grid">
            {filteredNotes.map((note, index) => {
              const subStyle = getSubjectStyle(note.subject);
              return (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}`}
                  className="group block"
                  data-testid={`note-card-${note.id}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    {/* Image */}
                    {note.featured_image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={note.featured_image}
                          alt={note.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        {note.is_pinned && (
                          <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center shadow-lg">
                            <Pin className="h-3 w-3 mr-1" />Pinned
                          </div>
                        )}
                      </div>
                    )}
                    {!note.featured_image && note.is_pinned && (
                      <div className="px-5 pt-5">
                        <div className="inline-flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-medium border border-amber-200">
                          <Pin className="h-3 w-3 mr-1" />Pinned
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Subject badge */}
                      <div className="mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${subStyle.bg} ${subStyle.text} border ${subStyle.border}`}>
                          {note.subject}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {note.title}
                      </h2>

                      {/* Excerpt */}
                      {note.excerpt && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                          {note.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex items-center space-x-3 text-xs text-gray-400">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {note.author}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {note.published_date ? new Date(note.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                      </div>

                      {/* Tags */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {note.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="inline-flex items-center text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                              <Tag className="h-2.5 w-2.5 mr-1" />{tag}
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
      <div className="bg-gray-50 border-t border-gray-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            SESG Research Lab &middot; Sustainable Energy & Smart Grid Research &middot; BRAC University
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notes;
