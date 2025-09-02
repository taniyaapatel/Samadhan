// Notes App JavaScript - Full CRUD Functionality
class NotesApp {
    constructor() {
        this.notes = [];
        this.currentFilters = {
            category: 'all',
            priority: 'all',
            status: 'all'
        };
        this.searchQuery = '';
        this.editingNoteId = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadNotes();
        this.setupSearch();
    }

    bindEvents() {
        // Add note button
        document.getElementById('addNoteBtn').addEventListener('click', () => this.showAddModal());
        document.getElementById('createFirstNote').addEventListener('click', () => this.showAddModal());

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.hideModal());
        document.getElementById('noteForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Delete modal events
        document.getElementById('closeDeleteModal').addEventListener('click', () => this.hideDeleteModal());
        document.getElementById('cancelDelete').addEventListener('click', () => this.hideDeleteModal());
        document.getElementById('confirmDelete').addEventListener('click', () => this.confirmDelete());

        // Filter events
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByCategory(e.target.dataset.category));
        });

        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByPriority(e.target.dataset.category));
        });

        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByStatus(e.target.dataset.status));
        });

        // Search events
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('clearSearch').addEventListener('click', () => this.clearSearch());

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal();
                this.hideDeleteModal();
            }
        });
    }

    setupSearch() {
        let searchTimeout;
        const searchInput = document.getElementById('searchInput');

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });
    }

    async loadNotes() {
        try {
            const response = await fetch('/api/notes');
            if (!response.ok) throw new Error('Failed to fetch notes');

            this.notes = await response.json();
            this.renderNotes();
            this.updateStats();
        } catch (error) {
            this.showToast('Error loading notes', 'error');
            console.error('Error loading notes:', error);
        }
    }

    renderNotes() {
        const container = document.getElementById('notesContainer');
        const emptyState = document.getElementById('emptyState');

        const filteredNotes = this.getFilteredNotes();

        if (filteredNotes.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        emptyState.style.display = 'none';

        container.innerHTML = filteredNotes.map(note => this.createNoteCard(note)).join('');

        // Bind note action events
        this.bindNoteEvents();
    }

    getFilteredNotes() {
        let filtered = [...this.notes];

        // Apply category filter
        if (this.currentFilters.category !== 'all') {
            filtered = filtered.filter(note => note.category === this.currentFilters.category);
        }

        // Apply priority filter
        if (this.currentFilters.priority !== 'all') {
            filtered = filtered.filter(note => note.priority === this.currentFilters.priority);
        }

        // Apply status filter
        if (this.currentFilters.status === 'completed') {
            filtered = filtered.filter(note => note.isCompleted);
        } else if (this.currentFilters.status === 'pending') {
            filtered = filtered.filter(note => !note.isCompleted);
        }

        // Apply search filter
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query)
            );
        }

        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    createNoteCard(note) {
        const priorityClass = note.priority.toLowerCase();
        const completedClass = note.isCompleted ? 'completed' : '';
        const completedIcon = note.isCompleted ? 'fa-check-circle' : 'fa-circle';
        const completedText = note.isCompleted ? 'Mark Incomplete' : 'Mark Complete';

        return `
            <div class="note-card ${completedClass}" data-id="${note._id}">
                <div class="note-header">
                    <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                </div>

                <p class="note-content">${this.escapeHtml(note.content)}</p>

                <div class="note-meta">
                    <span class="note-category">${note.category}</span>
                    <span class="note-priority ${priorityClass}">${note.priority}</span>
                </div>

                <div class="note-actions">
                    <button class="action-btn complete" title="${completedText}" data-action="toggle">
                        <i class="fas ${completedIcon}"></i>
                    </button>
                    <button class="action-btn" title="Edit Note" data-action="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" title="Delete Note" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>

                <div class="note-date">
                    Created: ${this.formatDate(note.createdAt)}
                    ${note.updatedAt !== note.createdAt ? `<br>Updated: ${this.formatDate(note.updatedAt)}` : ''}
                </div>
            </div>
        `;
    }

    bindNoteEvents() {
        document.querySelectorAll('.note-card').forEach(card => {
            const noteId = card.dataset.id;

            card.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;

                    switch (action) {
                        case 'toggle':
                            this.toggleNoteCompletion(noteId);
                            break;
                        case 'edit':
                            this.editNote(noteId);
                            break;
                        case 'delete':
                            this.showDeleteModal(noteId);
                            break;
                    }
                });
            });
        });
    }

    async toggleNoteCompletion(noteId) {
        try {
            const response = await fetch(`/api/notes/${noteId}/toggle`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to toggle note');

            const updatedNote = await response.json();
            const noteIndex = this.notes.findIndex(note => note._id === noteId);

            if (noteIndex !== -1) {
                this.notes[noteIndex] = updatedNote;
                this.renderNotes();
                this.updateStats();
                this.showToast('Note status updated', 'success');
            }
        } catch (error) {
            this.showToast('Error updating note', 'error');
            console.error('Error toggling note:', error);
        }
    }

    editNote(noteId) {
        const note = this.notes.find(note => note._id === noteId);
        if (!note) return;

        this.editingNoteId = noteId;
        this.showEditModal(note);
    }

    showEditModal(note) {
        document.getElementById('modalTitle').textContent = 'Edit Note';
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        document.getElementById('noteCategory').value = note.category;
        document.getElementById('notePriority').value = note.priority;

        this.showModal();
    }

    showAddModal() {
        this.editingNoteId = null;
        document.getElementById('modalTitle').textContent = 'Add New Note';
        document.getElementById('noteForm').reset();
        document.getElementById('noteCategory').value = 'General';
        document.getElementById('notePriority').value = 'Medium';

        this.showModal();
    }

    showModal() {
        document.getElementById('noteModal').classList.add('show');
        document.getElementById('noteTitle').focus();
    }

    hideModal() {
        document.getElementById('noteModal').classList.remove('show');
        this.editingNoteId = null;
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const noteData = {
            title: formData.get('title').trim(),
            content: formData.get('content').trim(),
            category: formData.get('category'),
            priority: formData.get('priority')
        };

        if (!noteData.title || !noteData.content) {
            this.showToast('Title and content are required', 'warning');
            return;
        }

        try {
            if (this.editingNoteId) {
                await this.updateNote(this.editingNoteId, noteData);
            } else {
                await this.createNote(noteData);
            }

            this.hideModal();
        } catch (error) {
            this.showToast('Error saving note', 'error');
            console.error('Error saving note:', error);
        }
    }

    async createNote(noteData) {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create note');
        }

        const newNote = await response.json();
        this.notes.unshift(newNote);
        this.renderNotes();
        this.updateStats();
        this.showToast('Note created successfully', 'success');
    }

    async updateNote(noteId, noteData) {
        const response = await fetch(`/api/notes/${noteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
        });

        if (!response.ok) throw new Error('Failed to update note');

        const updatedNote = await response.json();
        const noteIndex = this.notes.findIndex(note => note._id === noteId);

        if (noteIndex !== -1) {
            this.notes[noteIndex] = updatedNote;
            this.renderNotes();
            this.showToast('Note updated successfully', 'success');
        }
    }

    showDeleteModal(noteId) {
        const note = this.notes.find(note => note._id === noteId);
        if (!note) return;

        document.getElementById('deleteNoteTitle').textContent = note.title;
        document.getElementById('deleteModal').classList.add('show');
        this.noteToDelete = noteId;
    }

    hideDeleteModal() {
        document.getElementById('deleteModal').classList.remove('show');
        this.noteToDelete = null;
    }

    async confirmDelete() {
        if (!this.noteToDelete) return;

        try {
            const response = await fetch(`/api/notes/${this.noteToDelete}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete note');

            this.notes = this.notes.filter(note => note._id !== this.noteToDelete);
            this.renderNotes();
            this.updateStats();
            this.showToast('Note deleted successfully', 'success');
            this.hideDeleteModal();
        } catch (error) {
            this.showToast('Error deleting note', 'error');
            console.error('Error deleting note:', error);
        }
    }

    filterByCategory(category) {
        this.currentFilters.category = category;
        this.updateActiveFilter('category', category);
        this.renderNotes();
    }

    filterByPriority(priority) {
        this.currentFilters.priority = priority;
        this.updateActiveFilter('priority', priority);
        this.renderNotes();
    }

    filterByStatus(status) {
        this.currentFilters.status = status;
        this.updateActiveFilter('status', status);
        this.renderNotes();
    }

    updateActiveFilter(type, value) {
        // Remove active class from all buttons of this type
        const selector = type === 'category' ? '.category-btn' :
                        type === 'priority' ? '.priority-btn' : '.status-btn';

        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        const activeBtn = document.querySelector(`[data-${type}="${value}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    handleSearch(query) {
        this.searchQuery = query;
        this.renderNotes();

        // Show/hide clear search button
        const clearBtn = document.getElementById('clearSearch');
        clearBtn.style.display = query.trim() ? 'block' : 'none';
    }

    clearSearch() {
        document.getElementById('searchInput').value = '';
        this.searchQuery = '';
        this.renderNotes();
        document.getElementById('clearSearch').style.display = 'none';
    }

    updateStats() {
        const total = this.notes.length;
        const completed = this.notes.filter(note => note.isCompleted).length;
        const pending = total - completed;

        document.getElementById('totalNotes').textContent = total;
        document.getElementById('completedNotes').textContent = completed;
        document.getElementById('pendingNotes').textContent = pending;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${icon} toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;

        const container = document.getElementById('toastContainer');
        container.appendChild(toast);

        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
});

// Add some sample data for demonstration (remove in production)
window.addEventListener('load', () => {
    // Check if we have any notes, if not, add some sample data
    setTimeout(async () => {
        try {
            const response = await fetch('/api/notes');
            const notes = await response.json();

            if (notes.length === 0) {
                // Add sample notes
                const sampleNotes = [
                    {
                        title: 'Welcome to Smart Notes!',
                        content: 'This is your first note. Click the edit button to modify it or create new notes using the "New Note" button.',
                        category: 'General',
                        priority: 'High'
                    },
                    {
                        title: 'Shopping List',
                        content: 'Milk, Bread, Eggs, Vegetables, Fruits',
                        category: 'Shopping',
                        priority: 'Medium'
                    },
                    {
                        title: 'Work Meeting Notes',
                        content: 'Discuss Q4 goals, Review team performance, Plan next sprint',
                        category: 'Work',
                        priority: 'High'
                    },
                    {
                        title: 'Health Goals',
                        content: 'Exercise 30 minutes daily, Drink 8 glasses of water, Get 8 hours of sleep',
                        category: 'Health',
                        priority: 'Medium'
                    }
                ];

                for (const note of sampleNotes) {
                    await fetch('/api/notes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(note)
                    });
                }

                // Reload the page to show sample notes
                window.location.reload();
            }
        } catch (error) {
            console.log('Could not add sample notes:', error);
        }
    }, 1000);
});
