import React, { useState } from "react";
import { submitTask } from "../api/tasks";

function TaskForm({ selectedProjectId, refetchTasks }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "pending",
    dateCreated: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = await submitTask({
      ...formData,
      projectId: selectedProjectId,
    });
    refetchTasks();
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      status: "pending",
      dateCreated: new Date().toISOString().split("T")[0],
    });
    setIsExpanded(false);
    console.log("New task created: " + newTask);
  };

  return (
    <div>
      {selectedProjectId === null ? (
        <div style={{ display: "none" }}></div>
      ) : (
        <div className="container bg-light-subtle  p-3 rounded-4 my-4">
          <h2
            className="font-monospace d-flex align-items-center justify-content-center"
            onClick={() => setIsExpanded((prev) => !prev)}
            role="button"
          >
            <i
              className={`bi me-2 ${
                isExpanded ? "bi-caret-down-fill" : "bi-caret-right-fill"
              }`}
            ></i>
            Add A New Task
          </h2>
          {isExpanded && (
            <form
              onSubmit={handleSubmit}
              className="m-4 d-flex flex-column m-auto form-slide"
              style={{ width: "90%", maxWidth: "40rem" }}
            >
              <div className="mb-3 d-flex flex-column">
                <label className="form-label align-self-start fw-bold">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="mb-3 d-flex flex-column">
                <label className="form-label align-self-start fw-bold">
                  Description
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={300}
                />
              </div>
              <div className="mb-3 d-flex flex-column">
                <label className="form-label align-self-start fw-bold">
                  Priority
                </label>
                <select
                  className="form-select"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-3 d-flex flex-column">
                <label className="form-label align-self-start fw-bold">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3 mb-3">
                Add Task
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskForm;
