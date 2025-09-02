const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Load students data from students.json
let students = JSON.parse(fs.readFileSync("students.json", "utf8"));

// Save data back to students.json
function saveData() {
  fs.writeFileSync("students.json", JSON.stringify(students, null, 2));
}

// GET all students
app.get("/students", (req, res) => {
  res.json(students);
});

// GET student by ID
app.get("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find(s => s.id === id);
  student ? res.json(student) : res.status(404).json({ message: "Student not found" });
});

// POST new student
app.post("/students", (req, res) => {
  const newStudent = {
    id: students.length ? students[students.length - 1].id + 1 : 1,
    name: req.body.name,
    age: req.body.age
  };
  students.push(newStudent);
  saveData();
  res.status(201).json(newStudent);
});

// PUT update student
app.put("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find(s => s.id === id);
  if (student) {
    student.name = req.body.name || student.name;
    student.age = req.body.age || student.age;
    saveData();
    res.json(student);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
});

// DELETE student
app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students.splice(index, 1);
    saveData();
    res.json({ message: "Student deleted" });
  } else {
    res.status(404).json({ message: "Student not found" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
