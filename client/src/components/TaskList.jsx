import React, { useState, useCallback } from "react";
import TaskItem from "./TaskItem";
import { deleteTask } from "../api/tasks";

function TaskList({
  tasks,
  refetchTasks,
  selectedProjectId,
  onChecklistChange,
}) {
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const filteredTasks = selectedProjectId
    ? tasks.filter((task) => task.projectId === selectedProjectId)
    : tasks;

  const handleDelete = useCallback(
    (id) => {
      deleteTask(id)
        .then(() => refetchTasks())
        .catch((err) => console.error(err));
    },
    [refetchTasks]
  );

  const handleToggleExpand = useCallback((id) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div
      className="container bg-light-subtle rounded-4 p-4 m-auto"
      style={{ minHeight: "40rem" }}
    >
      {selectedProjectId === null ? (
        <h5 className="mb-3 font-monospace text-center">
          Select a Project to View Tasks
        </h5>
      ) : (
        <>
          <div className="d-flex justify-content-center">
            <h2 className="mb-3 font-monospace text-decoration-underline">
              Tasks
            </h2>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="mb-0 mt-2 d-flex justify-content-center">
              No tasks found.
            </p>
          ) : (
            <ul className="container d-flex flex-column list-group mb-0 mt-2 align-items-center">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  expandedTaskId={expandedTaskId}
                  onDelete={handleDelete}
                  onToggleExpand={handleToggleExpand}
                  onChecklistChange={onChecklistChange}
                  refetchTasks={refetchTasks}
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
