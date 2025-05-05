import React, { useEffect, useState } from "react";
import ChecklistItemForm from "./ChecklistItemForm";

function Checklist({ taskId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/checklist/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete checklist item");
        setItems((prev) => prev.filter((i) => i.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleCheck = (itemId) => {
    console.log("Sending update:", {
      isDone: items.find((i) => i.id === itemId).isDone ? 0 : 1,
    });
    console.log("Updating checklist item ID:", itemId);
    fetch(`http://localhost:3001/checklist/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isDone: items.find((i) => i.id === itemId).isDone ? 0 : 1,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update checklist item");
        return res.json();
      })
      .then((updatedItem) => {
        setItems((prev) =>
          prev.map((i) =>
            i.id === itemId ? { ...i, isDone: updatedItem.isDone } : i
          )
        );
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (id, content) => {
    setEditingId(id);
    setEditedContent(content);
  };

  const handleEditSubmit = (id) => {
    fetch(`http://localhost:3001/checklist/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editedContent }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update checklist item");
        return res.json();
      })
      .then((updatedItem) => {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, content: updatedItem.content } : i
          )
        );
        setEditingId(null);
        setEditedContent("");
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetch(`http://localhost:3001/tasks/${taskId}/checklist`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch checklist");
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) return <p>Loading checklist...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

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
              onClick={() => handleDelete(item.id)}
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
