const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

const students = JSON.parse(fs.readFileSync("students.json", "utf8"));

app.get("/api/students", (req, res) => {
  res.json(students);
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
