import React, { useState } from "react";
import TaskItem from "./TaskItem";

function TaskList({ tasks, setTasks }) {
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  function onDelete(task) {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }

  const toggleExpanded = (id) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container bg-light-subtle rounded-4 p-4">
      <h2 className="mb-3 font-monospace">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="container list-group">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={() => onDelete(task)}
              isExpanded={expandedTaskId === task.id}
              onToggleExpand={() => toggleExpanded(task.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
