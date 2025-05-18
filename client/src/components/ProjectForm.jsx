import React, { useState } from "react";
import { submitProject } from "../api/projects";

function ProjectForm({ setProjects }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    userId: 1,
    dateCreated: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProject = await submitProject(formData);
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setFormData({
      title: "",
      description: "",
      userId: 1, // a static userId for simplicity, replace with actual user ID logic
      dateCreated: new Date().toISOString().split("T")[0],
    });
    setIsExpanded(false);
  };

  return (
    <div className="container bg-light-subtle  p-3 rounded-4 mb-4">
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
        Create A New Project
      </h2>
      {isExpanded && (
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
              maxLength={19}
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
          <button type="submit" className="btn btn-primary mt-3 mb-3">
            Add Project
          </button>
        </form>
      )}
    </div>
  );
}

export default ProjectForm;
