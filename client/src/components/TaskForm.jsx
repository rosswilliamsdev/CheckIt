import React, { useState } from "react";

function TaskForm({ setTasks }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "pending",
    userId: 1,
    dateCreated: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
          status: "pending",
          userId: 1, // a static userId for simplicity, replace with actual user ID logic
          dateCreated: new Date().toISOString().split("T")[0],
        });
      })
      .catch((err) => console.error("Error creating task:", err));
  };

  return (
    <div className="container bg-light-subtle  p-3 rounded-4 my-4">
      <form onSubmit={handleSubmit} className="m-4 d-flex flex-column">
        <div className="mb-3 d-flex flex-column">
          <label className="form-label align-self-start fw-bold">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
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
    </div>
  );
}

export default TaskForm;
