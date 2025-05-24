import React, { useEffect, useState } from "react";
import ChecklistItemForm from "./ChecklistItemForm";
import {
  deleteChecklistItem,
  toggleChecklistItem,
  updateChecklistContent,
} from "../api/checklist";
import { authFetch } from "../api/api";

function Checklist({ taskId, onStatusChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  async function handleDelete(checklistItem) {
    try {
      await deleteChecklistItem(checklistItem.id);
      refetchChecklist();
    } catch (err) {
      console.error("error deleting task", err);
    }
  }

  const handleCheck = async (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    try {
      await toggleChecklistItem(item);
      refetchChecklist();
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
      await updateChecklistContent(id, editedContent);
      setEditingId(null);
      setEditedContent("");
      refetchChecklist();
    } catch (err) {
      console.error("Failed to update checklist item", err);
    }
  };

  const refetchChecklist = () => {
    setLoading(true);
    authFetch(`/tasks/${taskId}/checklist`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch checklist");
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refetchChecklist();
  }, [taskId]);

  useEffect(() => {
    if (!onStatusChange) return;

    const total = items.length;
    const completed = items.filter((i) => i.isDone).length;

    let newStatus = "pending";
    if (total > 0 && completed === total) {
      newStatus = "completed";
    } else if (completed > 0) {
      newStatus = "in_progress";
    }

    onStatusChange(newStatus);
  }, [items, onStatusChange]);

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
      <ChecklistItemForm taskId={taskId} refetchChecklist={refetchChecklist} />
    </div>
  );
}

export default Checklist;
