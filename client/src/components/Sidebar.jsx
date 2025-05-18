import React, { useState } from "react";
import Header from "./Header";
import { deleteProject } from "../api/projects";

function Sidebar({
  projects,
  setProjects,
  // fetchProjects,
  selectedProjectId,
  setSelectedProjectId,
  darkMode,
  setDarkMode,
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
      className="d-flex flex-column p-3 bg-light-subtle container rounded-4 mb-4 mx-1 align-content-center"
      style={{ width: "15rem" }}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <br />

      <div className="w-100 mb-3 d-flex flex-column align-content-center">
        <h5 className="mb-4 text-center">Active Projects</h5>
        <button
          className="btn btn-outline-secondary btn-sm w-95 align-self-center fw-bold"
          style={{ width: "10rem" }}
          onClick={() => setManageMode((prev) => !prev)}
        >
          {manageMode ? "☑️ Done" : "🗂️ Manage Projects"}
        </button>
      </div>
      <ul className="nav nav-pills flex-column">
        {projects.map((project) => (
          <li
            className="nav-item my-2 p-1 d-flex justify-content-between align-items-center text-center"
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
