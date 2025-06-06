import React, { useState } from "react";
import { createChecklistItem } from "../api/checklist";

function ChecklistItemForm({ taskId, onNewItem }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    createChecklistItem(taskId, content)
      .then((newItem) => {
        onNewItem(newItem);
        setContent("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 d-flex form-slide">
      <input
        type="text"
        className="form-control me-2"
        placeholder="New checklist item"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={100}
      />
      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
}

export default ChecklistItemForm;
