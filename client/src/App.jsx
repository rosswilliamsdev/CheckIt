import { useState, useEffect } from "react";
import "./App.css";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";

function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

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

  return (
    <div className="d-flex">
      <Sidebar projects={projects} setProjects={setProjects} />
      <div className="flex-grow-1 p-5">
        <Header />
        <TaskForm setTasks={setTasks} />
        <TaskList setTasks={setTasks} tasks={tasks} />
      </div>
    </div>
  );
}

export default App;
