import React, { useEffect, useState } from "react";
import Postcards from "./components/Postcards";
import Profilecard from "./components/Profilecard";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    const res = await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: "You", content: newPost }),
    });
    const newPostData = await res.json();
    setPosts([...posts, newPostData]);
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center p-6 space-y-6">
      <h1 className="text-2xl font-bold text-pink-600">🌸Social Dashboard</h1>

      <Profilecard />

      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-4 flex space-x-2">
        <input
          className="flex-1 p-2 border rounded-xl"
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button
          onClick={handleAddPost}
          className="bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600"
        >
          Post
        </button>
      </div>

      <div className="w-full max-w-md space-y-4">
        {posts.map((post) => (
          <Postcards key={post.id} post={post} setPosts={setPosts} />
        ))}
      </div>
    </div>
  );
}
