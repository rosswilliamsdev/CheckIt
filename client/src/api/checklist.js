async function createChecklistItem(taskId, content) {
  const res = await fetch(`http://localhost:3001/tasks/${taskId}/checklist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, isDone: 0 }),
  });
  if (!res.ok) throw new Error("Failed to add checklist item");
  return await res.json();
}

async function deleteChecklistItem(id) {
  fetch(`http://localhost:3001/checklist/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to delete checklist item");
  });
}

// item: { id, isDone, content }
// it's an update
async function toggleChecklistItem(item) {
  const updatedIsDone = item.isDone ? 0 : 1;

  const res = await fetch(`http://localhost:3001/checklist/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isDone: updatedIsDone, content: item.content }),
  });

  if (!res.ok) {
    throw new Error("Failed to toggle checklist item");
  }

  return await res.json();
}

async function updateChecklistContent(id, content) {
  const res = await fetch(`http://localhost:3001/checklist/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

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
