async function deleteTask(taskId) {
  const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}

export { deleteTask };
