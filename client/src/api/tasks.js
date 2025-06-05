import { authFetch } from "./api";

async function submitTask(formData) {
  const response = await authFetch(`${import.meta.env.VITE_API_URL}/tasks`, {
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
  const response = await authFetch(
    `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}

async function updateTaskStatus(id, status) {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/tasks/${id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update task status");
  }

  return await res.json();
}

async function updateTask(id, taskData) {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export { deleteTask, submitTask, updateTaskStatus, updateTask };
