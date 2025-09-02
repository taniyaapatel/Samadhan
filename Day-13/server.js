const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection with better error handling
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://taniya:taniya@taniya.ni0qzmm.mongodb.net/taniya?retryWrites=true&w=majority&appName=taniya', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('💡 Make sure MongoDB is running on your system');
        console.log('💡 On Windows, MongoDB should start automatically if installed as a service');
        console.log('💡 You can also try: mongod (in a separate terminal)');

        // Continue running the server even if MongoDB fails
        // This allows the frontend to work (though notes won't be saved)
    }
};

connectDB();

// Note Schema
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        default: 'General',
        enum: ['General', 'Work', 'Personal', 'Ideas', 'Shopping', 'Health']
    },
    priority: {
        type: String,
        default: 'Medium',
        enum: ['Low', 'Medium', 'High']
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('Note', noteSchema);

// Routes

// GET all notes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error: error.message });
    }
});

// GET single note by ID
app.get('/api/notes/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching note', error: error.message });
    }
});

// POST create new note
app.post('/api/notes', async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                message: 'Database not connected. Please ensure MongoDB is running.',
                error: 'MongoDB connection not available'
            });
        }

        const { title, content, category, priority } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const newNote = new Note({
            title,
            content,
            category: category || 'General',
            priority: priority || 'Medium'
        });

        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({
            message: 'Error creating note',
            error: error.message,
            details: 'Check if MongoDB is running and accessible'
        });
    }
});

// PUT update note
app.put('/api/notes/:id', async (req, res) => {
    try {
        const { title, content, category, priority, isCompleted } = req.body;

        const updateData = {
            title,
            content,
            category,
            priority,
            isCompleted,
            updatedAt: Date.now()
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: 'Error updating note', error: error.message });
    }
});

// DELETE note
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully', deletedNote });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error: error.message });
    }
});

// PATCH toggle note completion
app.patch('/api/notes/:id/toggle', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.isCompleted = !note.isCompleted;
        note.updatedAt = Date.now();

        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling note', error: error.message });
    }
});

// GET notes by category
app.get('/api/notes/category/:category', async (req, res) => {
    try {
        const notes = await Note.find({ category: req.params.category }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes by category', error: error.message });
    }
});

// GET notes by priority
app.get('/api/notes/priority/:priority', async (req, res) => {
    try {
        const notes = await Note.find({ priority: req.params.priority }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes by priority', error: error.message });
    }
});

// Search notes
app.get('/api/notes/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const notes = await Note.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error searching notes', error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Notes App server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} in your browser`);
    console.log(`🔗 API available at http://localhost:${PORT}/api/notes`);
});
