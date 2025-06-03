import React, { useState } from "react";
import Header from "./Header";
import { deleteProject } from "../api/projects";

function Sidebar({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  darkMode,
  setDarkMode,
  logout,
  navigate,
  refetchProjects,
}) {
  const [manageMode, setManageMode] = useState(false);

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      refetchProjects();
      setSelectedProjectId(null);
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  console.log("Sidebar rendering projects:", projects);
  return (
    <div
      className="d-flex flex-column p-3 bg-light-subtle container rounded-4 mb-4 mx-1 align-content-center"
      style={{ width: "20rem" }}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <br />

      <div className="w-100 mb-3 d-flex flex-column">
        <h5 className="mb-4 font-monospace">Active Projects</h5>
        <button
          className="btn btn-outline-secondary btn-sm w-95 fw-bold"
          style={{ width: "10rem" }}
          onClick={() => setManageMode((prev) => !prev)}
        >
          {manageMode ? "☑️ Done" : "🗂️ Manage Projects"}
        </button>
      </div>
      <ul className="nav nav-pills flex-column">
        {projects.map((project) => (
          <li
            className="nav-item my-2 d-flex justify-content-between align-items-center text-center"
            key={project.id}
          >
            <a
              href="#"
              className={`nav-link ${
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
      <button
        className="btn btn-outline-danger btn-sm mt-4 font-monospace"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Log Out
      </button>
    </div>
  );
}

export { Sidebar };
