const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;
const DATA_FILE = "./data.json";

app.use(cors());
app.use(express.json());

// Load posts
const loadData = () => JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
// Save posts
const saveData = (data) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Get all posts
app.get("/posts", (req, res) => {
  const data = loadData();
  res.json(data.posts);
});

// Add a new post
app.post("/posts", (req, res) => {
  const data = loadData();
  const newPost = {
    id: Date.now(),
    user: req.body.user || "Anonymous",
    content: req.body.content,
    comments: [],
  };
  data.posts.push(newPost);
  saveData(data);
  res.json(newPost);
});

// Add a comment
app.post("/posts/:id/comments", (req, res) => {
  const data = loadData();
  const post = data.posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.comments.push(req.body.comment);
  saveData(data);
  res.json(post);
});

app.listen(PORT, () =>
  console.log(`🚀 Backend running at http://localhost:${PORT}`)
);
