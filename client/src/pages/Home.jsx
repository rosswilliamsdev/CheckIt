import { useState, useEffect, useCallback } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import Header from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import ProjectForm from "../components/ProjectForm";
import { authFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProjectInfo from "../components/ProjectInfo";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [projectRefreshTrigger, setProjectRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    authFetch("/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  useEffect(() => {
    authFetch("/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.getElementById("root")?.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const refetchTasks = useCallback(() => {
    authFetch("/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setProjectRefreshTrigger((prev) => prev + 1);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const refetchProjects = useCallback(() => {
    authFetch("/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const handleChecklistChange = useCallback(() => {
    setProjectRefreshTrigger((prev) => prev + 1);
  }, []);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!user) return null;
  return (
    <div className="d-flex" style={{ minHeight: "100vh", width: "100vw" }}>
      <Sidebar
        projects={projects}
        setProjects={setProjects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        logout={logout}
        navigate={navigate}
        refetchProjects={refetchProjects}
      />
      <div className="flex-grow-1 mx-3" style={{ width: "35rem" }}>
        <ProjectForm
          setProjects={setProjects}
          refetchProjects={refetchProjects}
        />
        <TaskForm
          setTasks={setTasks}
          selectedProjectId={selectedProjectId}
          refetchTasks={refetchTasks}
        />
        <ProjectInfo
          selectedProjectId={selectedProjectId}
          refreshTrigger={projectRefreshTrigger}
        />
        <TaskList
          setTasks={setTasks}
          tasks={tasks}
          selectedProjectId={selectedProjectId}
          refetchTasks={refetchTasks}
          onChecklistChange={handleChecklistChange}
        />
      </div>
    </div>
  );
}
