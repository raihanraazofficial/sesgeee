import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen, Pin } from 'lucide-react';
import { toast } from 'react-toastify';
import { useData } from '../../contexts/DataContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';

window.katex = katex;

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

const AdminNotes = () => {
  const { fetchData, createItem, updateItem, deleteItem } = useData();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [tableConfig, setTableConfig] = useState({ rows: 3, cols: 3 });
  const [currentQuillRef, setCurrentQuillRef] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    subject: 'Power System Analysis',
    published_date: new Date().toISOString().slice(0, 16),
    tags: [],
    status: 'published',
    featured_image: '',
    is_pinned: false,
  });

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: ['serif', 'monospace', 'helvetica', 'arial', 'georgia', 'times-new-roman', 'courier-new'] }, { size: ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '42px', '54px', '68px', '84px', '98px'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }, { background: ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        [{ table: 'table' }, { pdf: 'pdf' }, { formula: 'formula' }],
        ['clean'],
      ],
      handlers: {
        table: function () { insertTable(this.quill); },
        pdf: function () { insertPDF(this.quill); },
        formula: function () { insertFormula(this.quill); },
      },
    },
    clipboard: { matchVisual: false },
  }), []);

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'script',
    'list', 'bullet', 'indent', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video',
    'table', 'formula',
  ];

  const insertTable = (quill) => {
    setCurrentQuillRef(quill);
    setIsTableDialogOpen(true);
  };

  const handleInsertTable = () => {
    if (!currentQuillRef) return;
    const numRows = parseInt(tableConfig.rows);
    const numCols = parseInt(tableConfig.cols);
    if (isNaN(numRows) || isNaN(numCols) || numRows < 1 || numRows > 20 || numCols < 1 || numCols > 10) {
      toast.error('Please enter valid numbers (Rows: 1-20, Columns: 1-10)');
      return;
    }
    let tableHTML = `<table class="professional-table-content" style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e5e7eb;"><thead><tr style="background: linear-gradient(135deg, #f9fafb, #f3f4f6); border-bottom: 2px solid #e5e7eb;">`;
    for (let col = 1; col <= numCols; col++) {
      tableHTML += `<th style="border: 1px solid #e5e7eb; padding: 12px 16px; text-align: left; font-weight: 600; color: #111827;">Column ${col}</th>`;
    }
    tableHTML += `</tr></thead><tbody>`;
    for (let row = 1; row <= numRows; row++) {
      tableHTML += `<tr style="${row % 2 === 0 ? 'background-color: #fafbfc;' : ''}">`;
      for (let col = 1; col <= numCols; col++) {
        tableHTML += `<td style="border: 1px solid #f3f4f6; padding: 12px 16px; color: #374151;">Data ${row}-${col}</td>`;
      }
      tableHTML += `</tr>`;
    }
    tableHTML += `</tbody></table>`;
    const range = currentQuillRef.getSelection();
    if (range) currentQuillRef.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
    setIsTableDialogOpen(false);
    setCurrentQuillRef(null);
    setTableConfig({ rows: 3, cols: 3 });
    toast.success('Table inserted!');
  };

  const insertPDF = (quill) => {
    const url = prompt('Enter PDF URL:');
    if (!url) return;
    const title = prompt('Enter PDF title (optional):', 'Document') || 'Document';
    const pdfHTML = `<div style="border: 2px solid #e9ecef; border-radius: 12px; padding: 24px; margin: 24px 0; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);"><div style="display: flex; align-items: center; margin-bottom: 16px;"><div style="width: 48px; height: 48px; background: linear-gradient(135deg, #dc3545, #c82333); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 16px; color: white; font-weight: bold;">PDF</div><div><h4 style="margin: 0; font-size: 18px; font-weight: 600; color: #212529;">${title}</h4><p style="margin: 4px 0 0 0; font-size: 14px; color: #6c757d;">PDF Document</p></div></div><div style="background: white; border-radius: 8px; overflow: hidden; margin-bottom: 16px;"><iframe src="${url}#toolbar=1" width="100%" height="500px" style="border: none; display: block;" loading="lazy" title="${title}"></iframe></div><div><a href="${url}" target="_blank" style="display: inline-flex; padding: 10px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">Download PDF</a> <a href="${url}" target="_blank" style="display: inline-flex; padding: 10px 16px; background: #6c757d; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin-left: 8px;">Open in New Tab</a></div></div>`;
    const range = quill.getSelection();
    if (range) quill.clipboard.dangerouslyPasteHTML(range.index, pdfHTML);
  };

  const insertFormula = (quill) => {
    const formula = prompt('Enter LaTeX formula (e.g., E = mc^2, \\frac{a}{b}):');
    if (!formula) return;
    try {
      const katexHTML = katex.renderToString(formula, { throwOnError: false, displayMode: false, output: 'html' });
      const formulaHTML = `<span style="display: inline-block; background: linear-gradient(135deg, #e3f2fd, #f3e5f5); border: 1px solid #bbdefb; border-radius: 6px; padding: 8px 12px; margin: 4px;"><span class="katex-formula" style="font-size: 16px;">${katexHTML}</span></span>`;
      const range = quill.getSelection();
      if (range) quill.clipboard.dangerouslyPasteHTML(range.index, formulaHTML);
      toast.success('Formula inserted!');
    } catch (error) {
      toast.error('Invalid LaTeX formula.');
    }
  };

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchData('notes');
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(item => {
      const matchesSearch = !searchTerm ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = subjectFilter === 'all' || item.subject === subjectFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [notes, searchTerm, subjectFilter, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const noteData = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        published_date: new Date(formData.published_date).toISOString(),
      };
      if (editingItem) {
        await updateItem('notes', editingItem.id, noteData);
        toast.success('Note updated successfully!');
      } else {
        await createItem('notes', noteData);
        toast.success('Note created successfully!');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
      loadNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error(editingItem ? 'Failed to update note' : 'Failed to create note');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      content: item.content || '',
      excerpt: item.excerpt || '',
      author: item.author || '',
      subject: item.subject || 'Power System Analysis',
      published_date: item.published_date ? new Date(item.published_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      status: item.status || 'published',
      featured_image: item.featured_image || '',
      is_pinned: item.is_pinned || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        await deleteItem('notes', item.id);
        toast.success('Note deleted!');
        loadNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', content: '', excerpt: '', author: '',
      subject: 'Power System Analysis',
      published_date: new Date().toISOString().slice(0, 16),
      tags: [], status: 'published', featured_image: '', is_pinned: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-notes-page">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold font-heading text-gray-900">Student Notes Management</h1>
              <p className="text-gray-600 mt-1">Create and manage course notes for students</p>
            </div>
            <button
              data-testid="add-note-btn"
              onClick={() => { setEditingItem(null); resetForm(); setIsModalOpen(true); }}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                data-testid="notes-search-input"
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <select
              data-testid="notes-subject-filter"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">All Subjects</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              data-testid="notes-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notes found</h3>
              <p className="mt-1 text-sm text-gray-500">Start by creating a new note for students.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" data-testid="notes-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNotes.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50" data-testid={`note-row-${item.id}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {item.featured_image ? (
                              <img className="h-10 w-10 rounded object-cover" src={item.featured_image} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded bg-primary-100 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-primary-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-medium text-gray-900">{item.title}</div>
                              {item.is_pinned && (
                                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full border border-amber-300">
                                  <Pin className="inline h-3 w-3 mr-0.5" />Pinned
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">by {item.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                          {item.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${item.status === 'published' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                          {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.published_date ? new Date(item.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-primary-600 hover:text-primary-900 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                            title="Edit"
                            data-testid={`edit-note-${item.id}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                            data-testid={`delete-note-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-testid="note-modal">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Edit Note' : 'Add New Note'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    data-testid="note-title-input"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <input
                    data-testid="note-author-input"
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    data-testid="note-subject-select"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Published Date</label>
                  <input
                    type="datetime-local"
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    data-testid="note-status-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="flex items-center pt-7">
                  <input
                    type="checkbox"
                    id="is_pinned"
                    checked={formData.is_pinned}
                    onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_pinned" className="ml-2 block text-sm text-gray-900">
                    <Pin className="inline h-4 w-4 mr-1 text-amber-600" />Pin this note
                  </label>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt / Short Description</label>
                <textarea
                  data-testid="note-excerpt-input"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Brief summary of the note..."
                />
              </div>

              {/* Rich Text Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ zIndex: 1000, position: 'relative' }}>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ height: '350px', zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
                    className="bg-white"
                    readOnly={false}
                  />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Editor Features:</strong> Bold, Italic, Headers, Lists, Tables, Code Blocks, Math Formulas (LaTeX), PDF embed, Images (URL), Videos (URL), Links</p>
                </div>
              </div>

              {/* Image & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                  <input
                    data-testid="note-image-input"
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="power systems, analysis (comma separated)"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingItem(null); resetForm(); }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  data-testid="note-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  data-testid="note-submit-btn"
                >
                  {editingItem ? 'Update' : 'Create'} Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Dialog */}
      {isTableDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Table</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rows (1-20)</label>
                <input type="number" min="1" max="20" value={tableConfig.rows} onChange={(e) => setTableConfig({ ...tableConfig, rows: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Columns (1-10)</label>
                <input type="number" min="1" max="10" value={tableConfig.cols} onChange={(e) => setTableConfig({ ...tableConfig, cols: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white" />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button type="button" onClick={() => { setIsTableDialogOpen(false); setCurrentQuillRef(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleInsertTable} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">Insert Table</button>
            </div>
          </div>
        </div>
      )}

      {/* Quill styles */}
      <style>{`
        .ql-editor { min-height: 300px !important; font-size: 16px; line-height: 1.6; }
        .ql-toolbar { border-top: 1px solid #e5e7eb; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; background: linear-gradient(135deg, #f9fafb, #ffffff); position: relative; z-index: 1001; padding: 8px; }
        .ql-container { border-bottom: 1px solid #e5e7eb; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; background: white; position: relative; z-index: 1000; }
        .ql-toolbar .ql-table::before { content: "T"; font-weight: bold; font-size: 14px; color: #3b82f6; }
        .ql-toolbar .ql-pdf::before { content: "PDF"; font-weight: bold; font-size: 10px; color: #dc3545; }
        .ql-toolbar .ql-formula::before { content: "fx"; font-weight: bold; font-size: 11px; background: #2196f3; color: white; border-radius: 3px; padding: 1px 4px; }
        .ql-toolbar .ql-picker-options { position: absolute; z-index: 1003; background: white; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-radius: 6px; max-height: 200px; overflow-y: auto; }
      `}</style>
    </div>
  );
};

export default AdminNotes;
