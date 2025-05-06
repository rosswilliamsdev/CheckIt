import React from "react";
import Checklist from "./Checklist";
import { deleteTask } from "../api/tasks";

function TaskItem({ task, onDelete, isExpanded, onToggleExpand }) {
  async function handleDelete() {
    try {
      await deleteTask(task.id);
      onDelete();
    } catch (err) {
      console.error("error deleting task", err);
    }
  }

  return (
    <li className="list-group-item border border-2 border-black m-3 p-4 rounded-5 shadow-md">
      <div className="d-flex justify-content-between align-items-center">
        <div
          className="flex-grow-1 cursor-pointer"
          onClick={onToggleExpand}
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
              task.status === "completed"
                ? "bg-success"
                : task.status === "in_progress"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {task.status === "completed"
              ? "Completed"
              : task.status === "in_progress"
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
      {isExpanded && (
        <div className="mt-3">
          <Checklist taskId={task.id} />
        </div>
      )}
    </li>
  );
}

export default TaskItem;
