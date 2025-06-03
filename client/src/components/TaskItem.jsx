import React from "react";
import { useState } from "react";
import Checklist from "./Checklist";
import { deleteTask, updateTask } from "../api/tasks";
import EditTaskForm from "./EditTaskForm";

function TaskItem({
  task,
  onDelete,
  expandedTaskId,
  onToggleExpand,
  onChecklistChange,
  refetchTasks,
}) {
  const [status, setStatus] = useState(task.status);
  const [isEditing, setIsEditing] = useState(false);
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

  async function handleEditSubmit(updatedTask) {
    try {
      await updateTask(task.id, { ...updatedTask, projectId: task.projectId });
      await refetchTasks();
      console.log("Handle Edit Submit");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update task", err);
    }
  }

  return (
    <li
      className="list-group-item border border-2 border-black m-3 p-4 rounded-5 shadow-md"
      style={{ width: "66%", minWidth: "20rem" }}
    >
      {isEditing ? (
        <EditTaskForm
          initialValues={task}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
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
            <div>
              <button
                className="btn btn-outline-secondary ms-2"
                title="Edit"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil"></i>
              </button>
              <button
                className="btn btn-outline-danger ms-2"
                title="Delete"
                onClick={handleDelete}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div
            className="mt-3"
            style={{ display: isExpanded ? "block" : "none" }}
          >
            <Checklist
              taskId={task.id}
              onStatusChange={handleStatusChange}
              onChecklistChange={onChecklistChange}
            />
          </div>
        </>
      )}
    </li>
  );
}

export default React.memo(TaskItem);
