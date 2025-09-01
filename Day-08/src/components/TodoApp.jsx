import { useState } from "react";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);

  const addTask = (text) => {
    setTasks([...tasks, { id: Date.now(), text, done: false }]);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">🌸 Cute To-Do List 🌸</h1>

      <TodoInput addTask={addTask} />
      <TodoList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
    </div>
  );
}
