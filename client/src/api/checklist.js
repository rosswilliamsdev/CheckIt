async function deleteChecklistItem(id) {
  fetch(`http://localhost:3001/checklist/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to delete checklist item");
  });
}

export { deleteChecklistItem };
