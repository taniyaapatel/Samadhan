import React, { useState } from "react";

export default function Postcards({ post, setPosts }) {
  const [comment, setComment] = useState("");

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    const res = await fetch(`http://localhost:5000/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
    const updatedPost = await res.json();

    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === post.id ? updatedPost : p))
    );
    setComment("");
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <p className="font-semibold text-pink-600">{post.user}</p>
      <p className="mt-1">{post.content}</p>

      <div className="mt-3 space-y-1">
        {post.comments.map((c, i) => (
          <p key={i} className="text-sm text-gray-600">
            💬 {c}
          </p>
        ))}
      </div>

      <div className="flex space-x-2 mt-3">
        <input
          className="flex-1 p-2 border rounded-xl"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-pink-400 text-white px-3 rounded-xl hover:bg-pink-500"
        >
          ➕
        </button>
      </div>
    </div>
  );
}
