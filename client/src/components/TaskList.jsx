import React, { useState } from "react";
import TaskItem from "./TaskItem";

function TaskList({ tasks, setTasks, selectedProjectId }) {
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const filteredTasks = selectedProjectId
    ? tasks.filter((task) => task.projectId === selectedProjectId)
    : tasks;

  function onDelete(task) {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }

  const toggleExpanded = (id) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="container bg-light-subtle rounded-4 p-4"
      style={{ minHeight: "40rem" }}
    >
      {selectedProjectId === null ? (
        <h5 className="mb-3 font-monospace">Select a Project to View Tasks</h5>
      ) : (
        <>
          <h2 className="mb-3 font-monospace">Your Tasks</h2>
          {filteredTasks.length === 0 ? (
            <p className="mb-0 mt-2">No tasks found.</p>
          ) : (
            <ul className="container list-group mb-0 mt-2">
              {filteredTasks.map((task) => (
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
        </>
      )}
    </div>
  );
}

export default TaskList;
