'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({
    category: 'all',
    priority: 'all',
    status: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium'
  });
  const [toasts, setToasts] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        // First try to get user from URL params (if redirected from login)
        const userParam = searchParams.get('user');
        if (userParam) {
          try {
            const userData = JSON.parse(decodeURIComponent(userParam));
            setUser(userData);
            setLoading(false);
            return;
          } catch (e) {
            // If parsing fails, continue with API call
          }
        }

        // Fallback to API call
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const userData = await response.json();
        setUser(userData.user);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, searchParams]);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const response = await fetch('/api/notes', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch notes');

      const notesData = await response.json();
      setNotes(notesData);
    } catch (error) {
      showToast('Error loading notes', 'error');
      console.error('Error loading notes:', error);
    }
  };

  const getFilteredNotes = () => {
    let filtered = [...notes];

    // Apply category filter
    if (currentFilters.category !== 'all') {
      filtered = filtered.filter(note => note.category === currentFilters.category);
    }

    // Apply priority filter
    if (currentFilters.priority !== 'all') {
      filtered = filtered.filter(note => note.priority === currentFilters.priority);
    }

    // Apply status filter
    if (currentFilters.status === 'completed') {
      filtered = filtered.filter(note => note.isCompleted);
    } else if (currentFilters.status === 'pending') {
      filtered = filtered.filter(note => !note.isCompleted);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  const showAddModal = () => {
    setEditingNoteId(null);
    setFormData({
      title: '',
      content: '',
      category: 'General',
      priority: 'Medium'
    });
    setShowModal(true);
  };

  const showEditModal = (note) => {
    setEditingNoteId(note._id);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority
    });
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
    setEditingNoteId(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Title and content are required', 'warning');
      return;
    }

    try {
      if (editingNoteId) {
        await updateNote(editingNoteId, formData);
      } else {
        await createNote(formData);
      }

      hideModal();
    } catch (error) {
      showToast('Error saving note', 'error');
      console.error('Error saving note:', error);
    }
  };

  const createNote = async (noteData) => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(noteData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create note');
    }

    const newNote = await response.json();
    setNotes(prev => [newNote, ...prev]);
    showToast('Note created successfully', 'success');
  };

  const updateNote = async (noteId, noteData) => {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(noteData)
    });

    if (!response.ok) throw new Error('Failed to update note');

    const updatedNote = await response.json();
    setNotes(prev => prev.map(note =>
      note._id === noteId ? updatedNote : note
    ));
    showToast('Note updated successfully', 'success');
  };

  const toggleNoteCompletion = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}/toggle`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to toggle note');

      const updatedNote = await response.json();
      setNotes(prev => prev.map(note =>
        note._id === noteId ? updatedNote : note
      ));
      showToast('Note status updated', 'success');
    } catch (error) {
      showToast('Error updating note', 'error');
      console.error('Error toggling note:', error);
    }
  };

  const openDeleteModal = (note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const hideDeleteModal = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      const response = await fetch(`/api/notes/${noteToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete note');

      setNotes(prev => prev.filter(note => note._id !== noteToDelete._id));
      showToast('Note deleted successfully', 'success');
      hideDeleteModal();
    } catch (error) {
      showToast('Error deleting note', 'error');
      console.error('Error deleting note:', error);
    }
  };

  const filterByCategory = (category) => {
    setCurrentFilters(prev => ({ ...prev, category }));
  };

  const filterByPriority = (priority) => {
    setCurrentFilters(prev => ({ ...prev, priority }));
  };

  const filterByStatus = (status) => {
    setCurrentFilters(prev => ({ ...prev, status }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const updateStats = () => {
    const total = notes.length;
    const completed = notes.filter(note => note.isCompleted).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const filteredNotes = getFilteredNotes();
  const stats = updateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl text-indigo-600">📝</div>
              <h1 className="text-xl font-semibold text-gray-900">Smart Notes</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
              <button
                onClick={showAddModal}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <span>+</span>
                New Note
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg h-fit sticky top-24">
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
                <div className="space-y-2">
                  {['all', 'General', 'Work', 'Personal', 'Ideas', 'Shopping', 'Health'].map(category => (
                    <button
                      key={category}
                      onClick={() => filterByCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        currentFilters.category === category
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category === 'all' ? 'All Notes' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Priority</h3>
                <div className="space-y-2">
                  {['all', 'High', 'Medium', 'Low'].map(priority => (
                    <button
                      key={priority}
                      onClick={() => filterByPriority(priority)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        currentFilters.priority === priority
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {priority === 'all' ? 'All Priorities' : priority}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Status</h3>
                <div className="space-y-2">
                  {['all', 'pending', 'completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => filterByStatus(status)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        currentFilters.status === status
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {status === 'all' ? 'All Notes' : status === 'pending' ? 'Pending' : 'Completed'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Stats */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No notes found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Create your first note to get started'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={showAddModal}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create Note
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map(note => (
                  <div
                    key={note._id}
                    className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${
                      note.isCompleted ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {escapeHtml(note.title)}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleNoteCompletion(note._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            note.isCompleted
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={note.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {note.isCompleted ? '✓' : '○'}
                        </button>
                        <button
                          onClick={() => showEditModal(note)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Edit note"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => openDeleteModal(note)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete note"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {escapeHtml(note.content)}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                        {note.category}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        note.priority === 'High' ? 'bg-red-100 text-red-700' :
                        note.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {note.priority}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Created: {formatDate(note.createdAt)}
                      {note.updatedAt !== note.createdAt && (
                        <div>Updated: {formatDate(note.updatedAt)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Note Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingNoteId ? 'Edit Note' : 'Add New Note'}
              </h2>
              <button
                onClick={hideModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter note title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Write your note here..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {['General', 'Work', 'Personal', 'Ideas', 'Shopping', 'Health'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {['Low', 'Medium', 'High'].map(pri => (
                      <option key={pri} value={pri}>{pri}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={hideModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingNoteId ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && noteToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="text-4xl mb-4">🗑️</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Delete Note</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this note?
              </p>
              <p className="font-medium text-gray-800 mb-6 bg-gray-100 p-3 rounded-lg">
                {noteToDelete.title}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={hideDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white min-w-64 ${
              toast.type === 'success' ? 'bg-green-500' :
              toast.type === 'error' ? 'bg-red-500' :
              toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
