import React, { useEffect, useState } from "react";
import ChecklistItemForm from "./ChecklistItemForm";
import {
  deleteChecklistItem,
  toggleChecklistItem,
  updateChecklistContent,
} from "../api/checklist";

function Checklist({ taskId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  function onDelete(checklistItem) {
    setItems((prev) => prev.filter((c) => c.id !== checklistItem.id));
  }

  async function handleDelete(checklistItem) {
    try {
      await deleteChecklistItem(checklistItem.id);
      onDelete(checklistItem);
    } catch (err) {
      console.error("error deleting task", err);
    }
  }

  const handleCheck = async (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    try {
      const updatedItem = await toggleChecklistItem(item);
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, isDone: updatedItem.isDone } : i
        )
      );
    } catch (err) {
      console.error("Error toggling checklist item:", err);
    }
  };

  const handleEdit = (id, content) => {
    setEditingId(id);
    setEditedContent(content);
  };

  const handleEditSubmit = async (id) => {
    try {
      const updatedItem = await updateChecklistContent(id, editedContent);
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, content: updatedItem.content } : i
        )
      );
      setEditingId(null);
      setEditedContent("");
    } catch (err) {
      console.error("Failed to update checklist item", err);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3001/tasks/${taskId}/checklist`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch checklist");
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) return <p>Loading checklist...</p>;

  return (
    <div>
      <h5>Checklist</h5>
      {items.length === 0 && <p>No items in this checklist.</p>}
      <ul className="list-group mt-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex align-items-center"
          >
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={!!item.isDone}
              onChange={() => handleCheck(item.id)}
            />
            {editingId === item.id ? (
              <input
                type="text"
                className="form-control"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onBlur={() => handleEditSubmit(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditSubmit(item.id);
                }}
                autoFocus
              />
            ) : (
              <span onClick={() => handleEdit(item.id, item.content)}>
                {item.content}
              </span>
            )}
            <button
              className="btn btn-sm btn-outline-danger ms-auto"
              onClick={() => handleDelete(item)}
              aria-label="Delete checklist item"
            >
              <i className="bi bi-trash"></i>
            </button>
          </li>
        ))}
      </ul>
      <ChecklistItemForm
        taskId={taskId}
        onAdd={(newItem) => setItems((prev) => [...prev, newItem])}
      />
    </div>
  );
}

export default Checklist;
