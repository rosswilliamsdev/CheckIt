import { useState, useEffect } from "react";
import "./App.css";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import ProjectForm from "./components/ProjectForm";

function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Fetch tasks from the server when the component mounts
  // and whenever the tasks state changes
  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [tasks]);

  useEffect(() => {
    fetch("http://localhost:3001/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, [projects]);

  function fetchProjects() {
    fetch("http://localhost:3001/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }

  return (
    <div className="d-flex">
      <Sidebar
        projects={projects}
        setProjects={setProjects}
        fetchProjects={fetchProjects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
      />
      <div
        className="flex-grow-1 mx-3"
        style={{ width: "35rem" }}
      >
        <ProjectForm setProjects={setProjects} />
        <TaskForm setTasks={setTasks} />
        <TaskList
          setTasks={setTasks}
          tasks={tasks}
          selectedProjectId={selectedProjectId}
        />
      </div>
    </div>
  );
}

export default App;
