import React, { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 1270);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      refetchProjects();
      setSelectedProjectId(null);
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  return (
    <div style={{ maxWidth: "15rem" }}>
      {isMobile && (
        <div>
          <button
            className="btn btn-outline-secondary position-fixed top-0 start-0 m-2 z-3 fw-bold"
            style={{ zIndex: 1050, borderWidth: "2px" }}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>
      )}
      <div
        className={`d-flex flex-column p-3 bg-light-subtle container rounded-4 mb-4 mx-1 align-content-center position-fixed top-0 start-0 vh-100 transition-transform`}
        style={{
          width: "100%",
          maxWidth: "15rem",
          zIndex: 2,
          transform:
            isSidebarOpen || !isMobile ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div
          className={`d-flex align-items-center mb-2 ${isMobile ? "ms-5" : ""}`}
        >
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
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
          style={{ width: "50%" }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export { Sidebar };
