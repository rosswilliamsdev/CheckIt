import { useState, useEffect } from "react";
import "./App.css";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Header from "./components/Header";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [tasks, setTasks] = useState([]);

  const onRefresh = () => {
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [tasks]);

  return (
    <div className=" p-5 container">
      <Header />
      <TaskForm setTasks={setTasks} />
      <TaskList onDelete={onRefresh} tasks={tasks} />
    </div>
  );
}

export default App;
