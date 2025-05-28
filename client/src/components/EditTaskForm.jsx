import React, { useState } from "react";

function EditTaskForm({ initialValues, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialValues.title || "",
    description: initialValues.description || "",
    priority: initialValues.priority || "medium",
    dueDate: initialValues.dueDate || "",
    status: initialValues.status || "pending",
    dateCreated: initialValues.dateCreated || new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
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
        <label className="form-label align-self-start fw-bold">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3 d-flex flex-column">
        <label className="form-label align-self-start fw-bold">Priority</label>
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
        <label className="form-label align-self-start fw-bold">Due Date</label>
        <input
          type="date"
          className="form-control"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>
      <div className="d-flex justify-content-start gap-2">
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default EditTaskForm;
