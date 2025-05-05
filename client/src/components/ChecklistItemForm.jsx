import React, { useState } from "react";

function ChecklistItemForm({ taskId, onAdd }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    fetch(`http://localhost:3001/tasks/${taskId}/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, isDone: 0 }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add checklist item");
        return res.json();
      })
      .then((newItem) => {
        onAdd(newItem);
        setContent("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 d-flex">
      <input
        type="text"
        className="form-control me-2"
        placeholder="New checklist item"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
}

export default ChecklistItemForm;
