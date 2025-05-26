import React from "react";
import { useState } from "react";
import Checklist from "./Checklist";
import { deleteTask } from "../api/tasks";

function TaskItem({
  task,
  onDelete,
  expandedTaskId,
  onToggleExpand,
  onChecklistChange,
}) {
  const [status, setStatus] = useState(task.status);
  const isExpanded = expandedTaskId === task.id;
  async function handleDelete() {
    try {
      await deleteTask(task.id);
      onDelete(task.id);
    } catch (err) {
      console.error("error deleting task", err);
    }
  }

  function handleStatusChange(newStatus) {
    setStatus(newStatus);
  }

  return (
    <li className="list-group-item border border-2 border-black m-3 p-4 rounded-5 shadow-md">
      <div className="d-flex justify-content-between align-items-center">
        <div
          className="flex-grow-1 cursor-pointer"
          onClick={() => onToggleExpand(task.id)}
          role="button"
        >
          <h5>
            <i
              className={`bi me-2 ${
                isExpanded ? "bi-caret-down-fill" : "bi-caret-right-fill"
              }`}
            ></i>
            {task.title}
          </h5>
          <p className="mb-1 text-muted">{task.description}</p>
          <small className="text-secondary">
            Due: {task.dueDate || "None"} | Priority: {task.priority}
          </small>
          <span
            className={`badge border border-black mx-2 ${
              status === "completed"
                ? "bg-success"
                : status === "in_progress"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
            style={{ minWidth: "100px" }}
          >
            {status === "completed"
              ? "Completed"
              : status === "in_progress"
              ? "In Progress"
              : "Pending"}
          </span>
        </div>
        <button
          className="btn btn-outline-danger ms-3"
          title="Delete"
          onClick={handleDelete}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
      <div className="mt-3" style={{ display: isExpanded ? "block" : "none" }}>
        <Checklist
          taskId={task.id}
          onStatusChange={handleStatusChange}
          onChecklistChange={onChecklistChange}
        />
      </div>
    </li>
  );
}

export default React.memo(TaskItem);
