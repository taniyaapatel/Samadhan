// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON
app.use(express.json());

// Serve static UI from public/
app.use(express.static(path.join(__dirname, 'public')));

// In-memory students list (initial names you requested)
let students = [
  { id: 1, name: 'Taniya Patel', course: 'CSE' },
  { id: 2, name: 'Apoorva Khare', course: 'CSE' },
  { id: 3, name: 'Nitesh Chourasiya', course: 'CSE' }
];

// API: GET list
app.get('/api/students', (req, res) => {
  res.json(students);
});

// API: POST add student
app.post('/api/students', (req, res) => {
  const { id, name, course } = req.body;
  if (!id || !name) return res.status(400).json({ message: 'id and name are required' });
  if (students.some(s => s.id === id)) return res.status(409).json({ message: 'id already exists' });

  const student = { id, name, course: course || 'CSE' };
  students.push(student);
  res.status(201).json({ message: 'Student added', student });
});

// Serve index.html for any other route (SPA friendly)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
