import React, { useState } from "react";
import Header from "./Header";
import { deleteProject } from "../api/projects";

function Sidebar({
  projects,
  setProjects,
  // fetchProjects,
  selectedProjectId,
  setSelectedProjectId,
}) {
  const [manageMode, setManageMode] = useState(false);

  const handleDeleteProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
    deleteProject(id);
    console.log("Delete project:", id);
  };

  console.log("Sidebar rendering projects:", projects);
  return (
    <div
      className="d-flex flex-column p-3 bg-light-subtle container rounded-4 mb-4 mx-1"
      style={{ width: "15rem" }}
    >
      <Header />
      <br />
      <h5 className="mb-4">Active Projects</h5>
      <button
        className="btn btn-outline-secondary btn-sm mb-3"
        onClick={() => setManageMode((prev) => !prev)}
      >
        {manageMode ? "Done" : "Manage Projects"}
      </button>
      <ul className="nav nav-pills flex-column">
        {projects.map((project) => (
          <li
            className="nav-item my-2 p-1 d-flex justify-content-between align-items-center"
            key={project.id}
          >
            <a
              href="#"
              className={`nav-link flex-grow-1 ${
                selectedProjectId === project.id ? "active" : ""
              }`}
              onClick={() => setSelectedProjectId(project.id)}
            >
              {project.title}
            </a>
            {manageMode && (
              <button
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => handleDeleteProject(project.id)}
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Sidebar };
