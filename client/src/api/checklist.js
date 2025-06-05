import { authFetch } from "./api";

// !!!
// Backend assumes isDone property will be a 0 or 1
// !!!

async function createChecklistItem(taskId, content) {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/${taskId}/checklist`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, isDone: 0 }),
    }
  );
  if (!res.ok) throw new Error("Failed to add checklist item");
  return await res.json();
}

async function deleteChecklistItem(id) {
  authFetch(`${import.meta.env.VITE_API_URL}/checklist/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to delete checklist item");
  });
}

// item: { id, isDone, content }
// it's an update
async function toggleChecklistItem(item) {
  const updatedIsDone = item.isDone ? 0 : 1;

  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/checklist/${item.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDone: updatedIsDone, content: item.content }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to toggle checklist item");
  }

  return await res.json();
}

async function updateChecklistContent(item) {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/checklist/${item.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: item.content,
        isDone: item.isDone,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update checklist item content");
  }

  return await res.json();
}

export {
  createChecklistItem,
  deleteChecklistItem,
  toggleChecklistItem,
  updateChecklistContent,
};
