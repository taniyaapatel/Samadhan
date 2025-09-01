export default function TodoList({ tasks, toggleTask, deleteTask }) {
  return (
    <ul className="space-y-3 w-full max-w-sm">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex justify-between items-center bg-white shadow-md rounded-2xl px-4 py-2"
        >
          <span
            onClick={() => toggleTask(task.id)}
            className={`cursor-pointer ${
              task.done ? "line-through text-gray-400" : "text-gray-700"
            }`}
          >
            {task.text}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-pink-500 hover:text-pink-700"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
