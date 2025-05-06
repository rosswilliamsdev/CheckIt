async function submitTask(formData) {
  const response = await fetch("http://localhost:3001/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  const newTask = await response.json();
  return newTask;
}

async function deleteTask(taskId) {
  const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}

export { deleteTask, submitTask };
