import { useState } from "react";

export default function TodoInput({ addTask }) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim() === "") return;
    addTask(input);
    setInput("");
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a task..."
        className="px-4 py-2 rounded-2xl border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button
        onClick={handleAdd}
        className="bg-pink-500 text-white px-4 py-2 rounded-2xl shadow hover:bg-pink-600"
      >
        Add
      </button>
    </div>
  );
}
